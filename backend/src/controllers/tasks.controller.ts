import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { TaskStatus } from "@prisma/client";
import { completeTask, createTask, deleteTask, listByUser, updateTask } from "@/services/tasks.service";

type TaskParams = {
  id: string;
};

export async function list(req: AuthRequest<TaskParams>, res: Response) {

    const filter = req.query.filter as TaskStatus | undefined;

    const validFilter: TaskStatus[] = ["ACTIVE", "COMPLETED", "EXPIRED"];

    const tasks = await listByUser(req.user!.id,
        filter && validFilter.includes(filter) ? filter : undefined
    );

    return res.json({ tasks })
}

export async function create(req: AuthRequest<TaskParams>, res: Response) {
    const task = await createTask(req.user!.id, req.body);
    return res.status(201).json({ task });
}

export async function update(req: AuthRequest<TaskParams>, res: Response) {
    const task = await updateTask(req.params.id, req.user!.id, req.body);

    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' })

    return res.json({ task })
}

export async function complete(req: AuthRequest<TaskParams>, res: Response) {

    const task = await completeTask(req.params.id, req.user!.id);

    if (!task) return res.status(404).json({ message: 'Tarefa não encontrada' })

    return res.json({ task })
}

export async function remove(req: AuthRequest<TaskParams>, res: Response) {
    const deleted = await deleteTask(req.params.id, req.user!.id)
    if (!deleted) return res.status(404).json({ message: 'Tarefa não encontrada' })
    return res.status(204).send()
}