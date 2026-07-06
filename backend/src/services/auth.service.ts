import bcrypt from "bcryptjs";
import { SignJWT, importPKCS8 } from "jose";
import crypto from 'crypto';
import { prisma } from '../lib/prisma'
import { redis } from '../lib/redis'

export async function createUser(email: string, password: string) {
    const exist = await prisma.user.findUnique({ where: { email } });

    if (exist) throw new Error('EMAIL_IN_USE');

    const salt = process.env.BCRYPT_SALT_ROUNDS || 10;


    const passwordHash = await bcrypt.hash(password, salt);

    return prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createAt: true }
    });

}

export async function validateCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    const dummy = '$2b$12$dummy.hash.to.prevent.timing.attack.padding.xxxxx';
    const valid = await bcrypt.compare(password, user?.passwordHash ?? dummy)

    if (!user || !valid) throw new Error('INVALID_CREDENTIALS')

    return user;

}

export async function generateTokens(userId: string, email: string) {
    const privateKey = await importPKCS8(process.env.JWT_PRIVATE!.replace(/\\n/g, '\n'), 'RS256');

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

    return {accessToken, refreshToken};
}

export async function revokeToken(token:string) {
    await redis.set(`blacklist:${token}`,'1',{ex:15 * 60});
}