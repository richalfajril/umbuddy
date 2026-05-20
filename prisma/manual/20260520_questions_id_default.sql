CREATE EXTENSION IF NOT EXISTS "pgcrypto";

ALTER TABLE "questions"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
