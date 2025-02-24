const Imap = require("imap-simple");
const fs = require("fs");
const path = require("path");
const { getEmailConfigs, checkAttachmentExists, saveEmailMetadata } = require("./daos/emailDAO");

// Define the directory where PDFs will be stored
const PDF_DIR = path.join(__dirname, "pdfs");
if (!fs.existsSync(PDF_DIR)) {
  fs.mkdirSync(PDF_DIR); // Create the directory if it doesn't exist
}

// Set the email checking interval (default: 10 minutes if not specified in env)
const EMAIL_CHECK_INTERVAL = process.env.EMAIL_CHECK_INTERVAL
  ? parseInt(process.env.EMAIL_CHECK_INTERVAL) * 60000
  : 600000;

// Function to fetch emails and extract PDF attachments
async function checkEmails(startDate = null) {
  const configs = await getEmailConfigs(); // Retrieve all configured email accounts
  
  for (const config of configs) {
    // IMAP configuration for connecting to the email server
    const imapConfig = {
      imap: {
        user: config.username,
        password: config.password,
        host: "imap.gmail.com", // Gmail IMAP server
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }, // Allow self-signed certificates
        authTimeout: 15000, // Authentication timeout
        keepalive: { interval: 20000, idleInterval: 60000, forceNoop: true },
      },
    };

    let connection;
    try {
      connection = await Imap.connect(imapConfig); // Connect to the email account
      await connection.openBox("INBOX"); // Open the inbox folder

      // Determine the search date (either user-specified or default to yesterday)
      const date = startDate ? new Date(startDate) : new Date();
      if (!startDate) date.setDate(date.getDate() - 1);

      // Search criteria: Fetch emails since the given date
      const searchCriteria = [["SINCE", date.toISOString().slice(0, 10)]];
      const fetchOptions = { bodies: ["HEADER"], struct: true };

      const messages = await connection.search(searchCriteria, fetchOptions);
      if (messages.length === 0) {
        console.log("No new emails found.");
        connection.end();
        continue;
      }

      let savedEmails = [];
      for (const message of messages) {
        // Extract email headers
        const header = message.parts.find((part) => part.which === "HEADER").body;
        const subject = header.subject ? header.subject[0] : "No Subject";
        const from = header.from ? header.from[0] : "Unknown Sender";

        // Identify email attachments
        const attachments = Imap.getParts(message.attributes.struct)
          .filter((part) => part.disposition && part.disposition.type.toLowerCase() === "attachment");

        if (attachments.length === 0) {
          continue; // Skip emails without attachments
        }

        for (const attachment of attachments) {
          let filename = attachment.params?.filename || `attachment_${Date.now()}.pdf`;
          
          // Check if the file already exists in the database
          const existingFile = await checkAttachmentExists(filename);
          if (existingFile) {
            console.log(`Attachment ${filename} already exists in DB, skipping...`);
            continue;
          }

          const filePath = path.join(PDF_DIR, filename);

          try {
            // Fetch and save the attachment locally
            const attachmentPart = await connection.getPartData(message, attachment);
            fs.writeFileSync(filePath, attachmentPart);
            console.log(`PDF saved: ${filePath}`);

            // Save metadata in the database
            await saveEmailMetadata(from, subject, filename, config.id);
            savedEmails.push({ from, subject, filename });

          } catch (fileError) {
            console.error(`Error saving attachment: ${fileError.message}`);
          }
        }
      }

      connection.end(); // Close IMAP connection
      return { status: "success", savedEmails };

    } catch (error) {
      console.error(`Error fetching emails for ${config.email}:`, error.message);

      // Handle authentication failure
      if (error.code === "AUTHENTICATIONFAILED") {
        console.log("Invalid email credentials.");
        continue;
      }

      // Handle connection reset issues by retrying after a delay
      if (error.code === "ECONNRESET") {
        console.log("Connection reset detected. Retrying...");
        await new Promise(resolve => setTimeout(resolve, 15000));
        return checkEmails(startDate);
      }
    }
  }

  return { status: "no new emails" };
}

// Run the email check periodically based on the defined interval
setInterval(() => checkEmails(), EMAIL_CHECK_INTERVAL);

module.exports = { checkEmails };
