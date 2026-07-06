import { app } from './app';
import { prisma } from './lib/prisma';
import { startExpiryJob } from './jobs/expireTasks';
import { redis } from './lib/redis';

const PORT = process.env.PORT ?? 3001;

async function main() {
  // 1. Conectar ao banco
  await prisma.$connect();
  console.log('Banco de dados conectado');

  

  // 2. Iniciar o servidor HTTP
  const server = app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });

  // 3. Iniciar o job de expiração de tarefas
  startExpiryJob();

  app.get("/redis-test", async (req, res) => {
  try {
    await redis.set("teste", "123");
    const valor = await redis.get("teste");

    res.json({ ok: true, valor });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

  // 4. Graceful shutdown — fecha conexões antes de encerrar
  const shutdown = async (signal: string) => {
    console.log(`${signal} recebido — encerrando...`);
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Conexões fechadas.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch((err) => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});