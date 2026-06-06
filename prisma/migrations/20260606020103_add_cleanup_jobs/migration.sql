-- CreateTable
CREATE TABLE "CleanupJob" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "requested" INTEGER NOT NULL,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CleanupJob_pkey" PRIMARY KEY ("id")
);
