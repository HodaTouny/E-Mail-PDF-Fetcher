import React from "react";
import Navbar from "./Components/Navbar";
import EmailConfigForm from "./Components/EmailConfigForm";
import EmailConfigList from "./Components/EmailConfigList";
import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <div className="main-container">
        <EmailConfigForm />
        <EmailConfigList />
      </div>
    </div>
  );
}

export default App;
