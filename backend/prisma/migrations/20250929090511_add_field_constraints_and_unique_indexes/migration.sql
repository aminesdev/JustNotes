/*
  Warnings:

  - You are about to alter the column `token` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `email` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `verificationCode` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - A unique constraint covering the columns `[userId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,title]` on the table `notes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."refresh_tokens" ALTER COLUMN "token" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "verificationCode" SET DATA TYPE VARCHAR(6);

-- CreateIndex
CREATE UNIQUE INDEX "categories_userId_name_key" ON "public"."categories"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "notes_userId_title_key" ON "public"."notes"("userId", "title");
