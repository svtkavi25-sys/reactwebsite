import React, { useState } from "react";
import "./App.css";

function App() {
  const quizQuestion = {
    text: "What is the capital of Japan?",
    options: [
      { id: "option-1", text: "Beijing" },
      { id: "option-2", text: "Seoul" },
      { id: "option-3", text: "Tokyo" },
      { id: "option-4", text: "Bangkok" },
    ],
    correctAnswerId: "option-3",
  };

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedAnswer(event.target.value);
    setFeedback("");
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      setFeedback("Please select an answer before submitting.");
      return;
    }

    if (selectedAnswer === quizQuestion.correctAnswerId) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Incorrect, please try again. 🤔");
    }
    setSubmitted(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer("");
    setFeedback("");
    setSubmitted(false);
  };

  return (
    <div className="app-shell">
      <div className="quiz-card">
        <header className="quiz-header">
          <div>
            <p className="eyebrow">Quiz Practice</p>
            <h1>{quizQuestion.text}</h1>
            <p className="quiz-description">
              Pick the right answer and submit to get immediate, friendly feedback.
            </p>
          </div>
          <div className="status-chip">
            {submitted ? "Answer submitted" : "Choose one"}
          </div>
        </header>

        <form
          className="quiz-form"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <div className="options-grid">
            {quizQuestion.options.map((option) => (
              <label
                key={option.id}
                className={`option-card ${selectedAnswer === option.id ? "selected" : ""}`}
                htmlFor={option.id}
              >
                <input
                  type="radio"
                  id={option.id}
                  name="quizQuestion"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={handleOptionChange}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>

          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Submit Answer
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetQuiz}>
              Reset
            </button>
          </div>
        </form>

        {feedback && (
          <div className={`feedback-box ${feedback.includes("Correct") ? "correct" : "incorrect"}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
