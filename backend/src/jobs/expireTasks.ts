import cron from 'node-cron';
import {expireOverDueTask} from '../services/tasks.service';

export function startExpiryJob() {
    cron.schedule('* * * * *', async () => {
        try {
            const count = await expireOverDueTask();
            if(count > 0) {
                console.log(`[${new Date().toISOString()}] ${count} Tarefa(s) expiradas(s)`);
            };
        } catch (error) {
            console.log('Erro na expiração: ' , error);
            
        }
    })
}