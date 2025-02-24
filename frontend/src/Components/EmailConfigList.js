import React, { useEffect, useState } from "react";
import axios from "axios";
import { showToast } from "./CustomAlert"; 
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import "../styles/EmailConfigList.css";

function EmailConfigList({ refresh }) {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    fetchConfigs();
  }, [refresh]);

  const fetchConfigs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/email-config");
      setConfigs(response.data);
    } catch (error) {
      showToast("Error fetching email configurations", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}api/email-config/${id}`);
      fetchConfigs();
      showToast("Configuration deleted successfully", "success");
    } catch (error) {
      showToast("Error deleting configuration", "error");
    }
  };

  const fetchEmailsNow = async () => {
    setLoading(true);
    showToast("Fetching emails...", "info");

    try {
      const requestBody = startDate ? { startDate } : {};
      const response = await axios.post(`${process.env.REACT_APP_API_URL}api/email-config/fetch-emails`, requestBody);

      if (response.data.status === "success") {
        showToast(`Fetched ${response.data.savedEmails.length} new emails.`, "success");
      } else if (response.data.status === "no new emails") {
        showToast("No new emails found", "warning");
      } else {
        showToast("Something went wrong while fetching emails", "error");
      }
    } catch (error) {
      showToast("Failed to fetch emails", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="config-list">
      <ToastContainer /> 
      <h2>Configured Emails</h2>

      <div className="fetch-controls">
        <label htmlFor="fetch-date">Start Fetching Attachments From:</label>
        <input
          type="date"
          id="fetch-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button className="fetch-btn" onClick={fetchEmailsNow} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </button>
      </div>

      <ul>
        {configs.map((config) => (
          <li key={config.id}>
            {config.email} - {config.type}
            <button className="delete-btn" onClick={() => handleDelete(config.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EmailConfigList;
