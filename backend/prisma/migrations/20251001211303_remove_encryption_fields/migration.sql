/*
  Warnings:

  - You are about to drop the column `encryptedKey` on the `notes` table. All the data in the column will be lost.
  - You are about to drop the column `encryptedPrivateKey` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."notes" DROP COLUMN "encryptedKey";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "encryptedPrivateKey",
DROP COLUMN "publicKey";
