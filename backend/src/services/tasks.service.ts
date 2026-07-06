import { prisma } from '../lib/prisma'
import { TaskStatus } from '@prisma/client'

const SAFE_SELECT = {
    id: true,
    title: true,
    description: true,
    expiresAt: true,
    status: true,
    createdAt: true,
    updateAt: true,
};

export async function listByUser(userId: string, filter?: TaskStatus) {
    return prisma.task.findMany({
        where: {
            userId,
            ...(filter ? { status: filter } : {}),
        },
        select: SAFE_SELECT,
        orderBy: { createdAt: 'desc' },
    });
}

export async function createTask(userId: string, data: { title: string; description?: string; expiresAt: string }) {
    return prisma.task.create({
       data: {
        title: data.title, description: data.description ?? '', expiresAt: new Date(data.expiresAt),userId,
       },
        select: SAFE_SELECT,
    });
}

export async function updateTask(id: string, userId: string, data: Partial<{ title: string; description: string; expiresAt: string }>) {
    const task = await prisma.task.findFirst({ where: { id, userId } });

    if (!task) return null;

    return prisma.task.update({
        where: { id },
        data: {
            ...(data.title ? {title: data.title} : {}),
            ...(data.description !== undefined ? {description: data.description} : {}),
            ...(data.expiresAt ? {expiresAt: new Date(data.expiresAt)} : {}),
        },
        select: SAFE_SELECT,
    })
}

export async function completeTask(id: string, userId: string) {
    const task = await prisma.task.findFirst({ where: { id, userId } });

    if (!task) return null;

    return prisma.task.update({
        where: { id },
        data: { status: 'COMPLETED' }
    })
}

export async function deleteTask(id: string, userId: string) {
    const task = await prisma.task.findFirst({ where: { id, userId } })

    if (!task) return false;

    await prisma.task.delete({ where: { id } });
    return true;
}

export async function expireOverDueTask() {
    const result = await prisma.task.updateMany({
        where: { status: 'ACTIVE', expiresAt: { lt: new Date() } },
        data: { status: 'EXPIRED' }
    });

    return result.count;
}