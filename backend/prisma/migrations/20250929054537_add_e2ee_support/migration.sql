-- DropIndex
DROP INDEX "public"."categories_userId_name_key";

-- AlterTable
ALTER TABLE "public"."notes" ADD COLUMN     "encryptedKey" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "encryptedPrivateKey" TEXT,
ADD COLUMN     "publicKey" TEXT;

-- CreateIndex
CREATE INDEX "categories_userId_idx" ON "public"."categories"("userId");
