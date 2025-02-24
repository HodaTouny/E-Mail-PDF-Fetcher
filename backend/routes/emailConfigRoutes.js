const express = require("express");
const router = express.Router();
const emailConfigController = require("../controllers/emailConfigController");

router.post("/", emailConfigController.addEmailConfig); // This is the route for adding a new email config
router.get("/", emailConfigController.getEmailConfigs); // This is the route for fetching all email configs
router.delete("/:id", emailConfigController.deleteEmailConfig); // This is the route for deleting an email config
router.post("/fetch-emails", emailConfigController.fetchEmails); // This is the route for fetching emails

module.exports = router;
