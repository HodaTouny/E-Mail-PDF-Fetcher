const emailConfigDAO = require("../daos/emailConfigDAO");
const { checkEmails } = require("../emailFetcher");

/*
This Function is responsible for fetching attachments from emails.
*/
const fetchEmails = async (req, res) => {
  try {
    const { startDate } = req.body; 
    const result = await checkEmails(startDate);

    res.json(result);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch emails." });
  }
};

/*
This Function is responsible for adding a new email config.
*/
const addEmailConfig = async (req, res) => {
  try {
    const { email, type, host, username, password } = req.body;
    const newConfig = await emailConfigDAO.createEmailConfig({ email, type, host, username, password });
    res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error saving email config:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
This Function is responsible for fetching all email.
*/
const getEmailConfigs = async (req, res) => {
  try {
    const configs = await emailConfigDAO.getEmailConfigs();
    res.json(configs);
  } catch (error) {
    console.error("Error fetching email configs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/*
This Function is responsible for deleting an email config.
*/
const deleteEmailConfig = async (req, res) => {
  try {
    const { id } = req.params;
    await emailConfigDAO.deleteEmailConfig(id);
    res.json({ message: "Email configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting email config:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addEmailConfig,
  getEmailConfigs,
  deleteEmailConfig,
  fetchEmails
};
