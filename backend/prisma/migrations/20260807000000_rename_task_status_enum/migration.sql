-- Renomeia o valor existente ACTIVE para IN_PROGRESS (mantém os dados existentes)
ALTER TYPE "TaskStatus" RENAME VALUE 'ACTIVE' TO 'IN_PROGRESS';

-- Adiciona o novo valor CANCELLED ao enum
ALTER TYPE "TaskStatus" ADD VALUE 'CANCELLED';

-- Atualiza o valor padrão da coluna status
ALTER TABLE "Task" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';