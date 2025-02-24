const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/*
This Function is responsible for fetching all email configs from the database.
*/
async function getEmailConfigs() {
  return prisma.emailIngestionConfig.findMany();
}

/*
This Function is responsible for checking if an attachment already exists in the database.
*/
async function checkAttachmentExists(filename) {
  return prisma.emailMetadata.findFirst({
    where: { attachmentFileName: filename },
  });
}

/*
This Function is responsible for saving email metadata to the database.
*/
async function saveEmailMetadata(from, subject, filename, configId) {
  return prisma.emailMetadata.create({
    data: {
      fromAddress: from,
      subject,
      dateReceived: new Date(),
      attachmentFileName: filename,
      emailConfigId: configId,
    },
  });
}

module.exports = {
  getEmailConfigs,
  checkAttachmentExists,
  saveEmailMetadata,
};
