import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";
import FeedbackForm from "./FeedbackForm";

function App() {
  const [userCode, setUserCode] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fetchHistory = async () => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/code_history/?email=${localStorage.getItem("email")}`);
    setHistory(res.data.reverse());
  } catch (err) {
    console.error("Failed to fetch history:", err);
  }
};

  const cleanResponse = (text) => text.replace(/```python|```/g, "").trim();

  const sendCodeToAPI = async (endpoint) => {
    try {
      setLoading(true);
      const response = await axios.post(`http://127.0.0.1:8000/${endpoint}/`, {
        user_code: userCode,
        user_email: localStorage.getItem("email")
      });
      const data = response.data;

      setAiResponse({
        generated_code: cleanResponse(data.generated_code || ""),
        debugged_code: cleanResponse(data.debugged_code || ""),
        optimized_code: cleanResponse(data.optimized_code || ""),
        explanation: cleanResponse(data.explanation || ""),
      });
      await fetchHistory();

    } catch (err) {
      console.error("Error:", err);
      setAiResponse({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const text =
      aiResponse?.generated_code ||
      aiResponse?.debugged_code ||
      aiResponse?.optimized_code ||
      aiResponse?.explanation ||
      "";

    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const downloadCode = () => {
    const code =
      aiResponse?.generated_code ||
      aiResponse?.debugged_code ||
      aiResponse?.optimized_code ||
      aiResponse?.explanation ||
      "";

    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "code.py";
    link.click();
  };

  const refreshUI = () => {
    setUserCode("");
    setAiResponse(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="top-section">
          <h2>AI Programmer</h2>
          <p>Welcome, {localStorage.getItem("username")}!</p>
          <button className="btn blue" onClick={() => sendCodeToAPI("generate_code")}>Generate</button>
          <button className="btn orange" onClick={() => sendCodeToAPI("debug_code")}>Debug</button>
          <button className="btn green" onClick={() => sendCodeToAPI("optimize_code")}>Optimize</button>
          <button className="btn purple" onClick={() => sendCodeToAPI("explain_code")}>Explain</button>
          <button className="btn gray" onClick={refreshUI}>Refresh</button>
          <button className="btn light" onClick={() => navigate("/history")}>View History</button>
        </div>
        <div className="bottom-section">
          <button className="btn danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <textarea
          placeholder="Enter your Python code or query here..."
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
        />

        {loading && <p className="status">⏳ Processing...</p>}

        {aiResponse && (
          <div className="response-box">
            <h2>AI Response</h2>
            <SyntaxHighlighter language="python" style={darcula}>
              {aiResponse.generated_code ||
                aiResponse.debugged_code ||
                aiResponse.optimized_code ||
                aiResponse.explanation ||
                "No response yet."}
            </SyntaxHighlighter>
            <div className="button-group">
              <button onClick={copyToClipboard} className="btn small">Copy</button>
              <button onClick={downloadCode} className="btn small">Download</button>
            </div>
          </div>
        )}

        {aiResponse && history.length > 0 && (
          <FeedbackForm codeId={history[0].id} />
        )}
      </div>
    </div>
  );
}

export default App;
