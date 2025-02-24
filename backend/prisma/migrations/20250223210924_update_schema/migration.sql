/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `EmailIngestionConfig` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "EmailMetadata" (
    "id" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "attachmentFileName" TEXT NOT NULL,
    "emailConfigId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailIngestionConfig_email_key" ON "EmailIngestionConfig"("email");

-- AddForeignKey
ALTER TABLE "EmailMetadata" ADD CONSTRAINT "EmailMetadata_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailIngestionConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
