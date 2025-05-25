import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeedbackForm = ({ codeId }) => {
  const [feedbackType, setFeedbackType] = useState("generated");
  const [score, setScore] = useState(5);

const handleFeedbackSubmit = async (e) => {
  e.preventDefault();

  if (!codeId) {
    alert("Missing code ID. Please try again.");
    return;
  }

  try {
    await axios.post("http://127.0.0.1:8000/feedback/", {
      code_id: codeId,
      feedback_type: feedbackType,
      score: parseInt(score),
      user_email: localStorage.getItem("email"),
    });
    toast.success(" Feedback submitted successfully!");

  } catch (err) {
    console.error("Error submitting feedback", err);
    alert("Failed to submit feedback.");
  }
};

  return (
    <div className="feedback-form">
      <h3>Rate the AI Response</h3>
      <form onSubmit={handleFeedbackSubmit}>
        <label>
          Feedback Type:
          <select value={feedbackType} onChange={(e) => setFeedbackType(e.target.value)}>
            <option value="generated">Generated</option>
            <option value="debugged">Debugged</option>
            <option value="optimized">Optimized</option>
            <option value="explanation">Explanation</option>
          </select>
        </label>
        <label>
          Rating (1 to 5):
        <select value={score} onChange={(e) => setScore(e.target.value)}>
          <option value="1">⭐ 1</option>
          <option value="2">⭐⭐ 2</option>
          <option value="3">⭐⭐⭐ 3</option>
          <option value="4">⭐⭐⭐⭐ 4</option>
          <option value="5">⭐⭐⭐⭐⭐ 5</option>
        </select>
        </label>
        <button type="submit" className="btn green">Submit Feedback</button>
        <ToastContainer position="bottom-right" autoClose={3000} />

      </form>
    </div>
  );
};

export default FeedbackForm;
