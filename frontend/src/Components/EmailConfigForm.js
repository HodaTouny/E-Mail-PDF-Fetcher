import React, { useState } from "react";
import axios from "axios";
import { showToast } from "./CustomAlert"; 
import "../styles/EmailConfigForm.css";

function EmailConfigForm() {
  const [email, setEmail] = useState("");
  const [type, setType] = useState("IMAP");
  const [host, setHost] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const configData = { email, type, host, username, password };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}api/email-config`, configData);

      setEmail("");
      setType("IMAP");
      setHost("");
      setUsername("");
      setPassword("");

      showToast("Configuration added successfully!", "success");
    } catch (error) {
      showToast("Error adding email configuration.", "error");
    }
  };

  return (
    <div className="config-form">
      <h2>Add Email Configuration</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="IMAP">IMAP</option>
        </select>
        <input type="text" placeholder="Host (Gmail: imap.gmail.com)" value={host} onChange={(e) => setHost(e.target.value)} />
        <input type="text" placeholder="Username (Your Gmail)" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password (App Password from Gmail)" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Save Configuration</button>
      </form>
    </div>
  );
}

export default EmailConfigForm;
