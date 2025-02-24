require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const emailConfigRoutes = require("./routes/emailConfigRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET, POST, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

app.options("*", cors());

app.use(bodyParser.json());

app.use("/api/email-config", emailConfigRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
