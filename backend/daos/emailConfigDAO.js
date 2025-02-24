const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*
This Function is responsible for creating a new email config To the database.
*/
const createEmailConfig = async (data) => {
  return await prisma.emailIngestionConfig.create({ data });
};

/*
This Function is responsible for fetching all email configs from the database.
*/
const getEmailConfigs = async () => {
  return await prisma.emailIngestionConfig.findMany();
};

/*
This Function is responsible for deleting an email config from the database.
*/
const deleteEmailConfig = async (id) => {
  return await prisma.emailIngestionConfig.delete({ where: { id } });
};

module.exports = {
  createEmailConfig,
  getEmailConfigs,
  deleteEmailConfig,
};
