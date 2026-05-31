-- AlterTable
ALTER TABLE "OAuthToken" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "expiryDate" BIGINT;
