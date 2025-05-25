import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const CodeHistory = () => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    const userEmail = localStorage.getItem("email");
    if (!userEmail) return;

    try {
      const res = await axios.get(`http://127.0.0.1:8000/code_history/?email=${userEmail}`);
      setHistory(res.data.reverse());
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/code_history/${id}`);
      fetchHistory();
    } catch (err) {
      console.error("Error deleting entry:", err);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>📂 User History</h1>
        <button className="btn danger" onClick={() => window.location.href = "/dashboard"}>
          ← Back to App
        </button>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>User Input</th>
            <th>Generated</th>
            <th>Debugged</th>
            <th>Optimized</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {history.length === 0 ? (
    <tr>
      <td colSpan="5" style={{ textAlign: "center", padding: "2rem", fontStyle: "italic", color: "#888" }}>
        No history found for this user.
      </td>
    </tr>
  ) : (
    history.map((entry) => (
      <React.Fragment key={entry.id}>
        <tr className="history-row">
          <td>{entry.user_code}</td>
          <td>{entry.generated_code ? "✅" : ""}</td>
          <td>{entry.debugged_code ? "✅" : ""}</td>
          <td>{entry.optimized_code ? "✅" : ""}</td>
          <td>
            <button className="btn small blue" onClick={() => toggleExpand(entry.id)}>
              {expandedId === entry.id ? "Hide" : "View"}
            </button>
            <button className="btn small danger" onClick={() => deleteEntry(entry.id)}>
              Delete
            </button>
          </td>
        </tr>
        {expandedId === entry.id && (
          <tr className="expanded-row">
            <td colSpan="5">
              <div className="expanded-content">
                {entry.generated_code && (
                  <div>
                    <h4>Generated Code:</h4>
                    <pre>{entry.generated_code}</pre>
                  </div>
                )}
                {entry.debugged_code && (
                  <div>
                    <h4>Debugged Code:</h4>
                    <pre>{entry.debugged_code}</pre>
                  </div>
                )}
                {entry.optimized_code && (
                  <div>
                    <h4>Optimized Code:</h4>
                    <pre>{entry.optimized_code}</pre>
                  </div>
                )}
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ))
  )}
</tbody>
      </table>
    </div>
  );
};

export default CodeHistory;
