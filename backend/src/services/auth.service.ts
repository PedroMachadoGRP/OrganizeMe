import bcrypt from "bcryptjs";
import { SignJWT, importPKCS8 } from "jose";
import crypto from 'crypto';
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'

export async function createUser(name:string ,email: string, password: string) {


    const exist = await prisma.user.findUnique({ where: { email } });


    if (exist) throw new Error("EMAIL_IN_USE");

    const salt = process.env.BCRYPT_SALT_ROUNDS || 10;


    const passwordHash = await bcrypt.hash(password, Number(salt));

    const user = await prisma.user.create({
        data: { name,email, passwordHash },
        select: {
            id: true,
            name:true,
            email: true,
            createdAt: true,
        },
    });


    return user;
}

export async function validateCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    const dummy = '$2b$12$dummy.hash.to.prevent.timing.attack.padding.xxxxx';
    const valid = await bcrypt.compare(password, user?.passwordHash ?? dummy)

    if (!user || !valid) throw new Error('INVALID_CREDENTIALS')

    return user;

}

export async function generateTokens(userId: string, email: string) {
    const key = process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, "\n");

    const privateKey = await importPKCS8(process.env.JWT_PRIVATE_KEY!.replace(/\\n/g, '\n'), 'RS256');

    const accessToken = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'RS256' })
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime('15m')
        .sign(privateKey)

    const refreshToken = crypto.randomBytes(64).toString('hex');

    await prisma.session.create({
        data: {
            userId,
            tokenHash: crypto.createHash('sha256').update(refreshToken).digest('hex'),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
    });

    return { accessToken, refreshToken };
}

export async function revokeToken(token: string) {
    await redis.set(`blacklist:${token}`, '1', { ex: 15 * 60 });
}

export async function rotateSession(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const session = await prisma.session.findUnique({ where: { tokenHash } });

    if (!session || session.expiresAt < new Date()) {
        if (session) await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
        throw new Error('INVALID_SESSION');
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });

    if (!user) throw new Error('INVALID_SESSION');

    await prisma.session.delete({ where: { id: session.id } });

    return generateTokens(user.id, user.email);
}