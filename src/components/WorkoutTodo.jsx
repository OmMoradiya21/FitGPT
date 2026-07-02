import { useState } from "react";

// Default fallback exercises if none are provided
const defaultExercises = [
  {
    id: "task_1",
    name: "Barbell Bench Press",
    sets: 3,
    reps: "8-10",
    weight: "135 lbs",
    rest: "90s"
  },
  {
    id: "task_2",
    name: "Incline Dumbbell Press",
    sets: 3,
    reps: "10-12",
    weight: "45 lbs",
    rest: "60s"
  },
  {
    id: "task_3",
    name: "Overhead Tricep Extensions",
    sets: 4,
    reps: "12-15",
    weight: "30 lbs",
    rest: "60s"
  }
];

export default function WorkoutTodo({ workout = defaultExercises, onFinish, onCancel }) {
  const [completedIds, setCompletedIds] = useState(new Set());
  const [feedback, setFeedback] = useState({}); // { [taskId]: 'good' | 'average' | 'hard' }
  const [sessionReview, setSessionReview] = useState("");

  const toggleTodo = (id) => {
    setCompletedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleFeedback = (id, rating) => {
    setFeedback((prev) => ({
      ...prev,
      [id]: rating
    }));
  };

  const handleFinish = () => {
    // Attach feedback to each exercise in the final workout state
    const ratedWorkout = workout.map((task) => ({
      ...task,
      feedback: feedback[task.id] || null // null if not rated
    }));

    if (onFinish) {
      onFinish(ratedWorkout, sessionReview);
    }
  };

  const progressPercentage = workout.length > 0 
    ? Math.round((completedIds.size / workout.length) * 100) 
    : 0;

  return (
    <div className="workout-todo-container">
      {/* Header card with progress bar */}
      <div className="glass-card todo-header-card">
        <div className="todo-header-top">
          <div>
            <h2 className="todo-title">Active Workout</h2>
            <p className="todo-subtitle">Complete your exercises and log your effort.</p>
          </div>
          <button onClick={onCancel} className="btn btn-secondary btn-sm">
            ✕ Exit
          </button>
        </div>

        <div className="todo-progress-section">
          <div className="todo-progress-labels">
            <span>Progress</span>
            <span className="progress-percentage">{progressPercentage}%</span>
          </div>
          <div className="todo-progress-bar-bg">
            <div
              className="todo-progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Todo list */}
      <div className="todo-list">
        {workout.map((task) => {
          const isCompleted = completedIds.has(task.id);
          const selectedRating = feedback[task.id];

          return (
            <div
              key={task.id}
              className={`todo-item-card glass-card ${isCompleted ? "completed" : ""}`}
            >
              <div className="todo-item-main">
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleTodo(task.id)}
                  className={`todo-checkbox ${isCompleted ? "checked" : ""}`}
                  aria-label={`Toggle completion for ${task.name}`}
                >
                  <svg className="checkmark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>

                {/* Details */}
                <div className="todo-details" onClick={() => toggleTodo(task.id)}>
                  <h4 className="todo-item-name">{task.name}</h4>
                  <div className="todo-item-specs">
                    <span>{task.sets} Sets × {task.reps}</span>
                    {task.weight && (
                      <>
                        <span className="dot-separator" />
                        <span>{task.weight}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rest badge */}
                {task.rest && (
                  <div className="todo-rest-badge">
                    ⏱ {task.rest}
                  </div>
                )}
              </div>

              {/* Feedback Emoji Selector */}
              <div className="todo-item-feedback">
                <span className="feedback-label">How was it?</span>
                <div className="emoji-buttons-group">
                  <button
                    type="button"
                    onClick={() => handleFeedback(task.id, "good")}
                    className={`emoji-btn good ${selectedRating === "good" ? "active" : ""}`}
                    title="Good (Easy/Smooth)"
                  >
                    <span className="emoji-icon">😊</span>
                    <span className="emoji-text">Good</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(task.id, "average")}
                    className={`emoji-btn average ${selectedRating === "average" ? "active" : ""}`}
                    title="Average (Challenging but doable)"
                  >
                    <span className="emoji-icon">😐</span>
                    <span className="emoji-text">Medium</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(task.id, "hard")}
                    className={`emoji-btn hard ${selectedRating === "hard" ? "active" : ""}`}
                    title="Hard (Very tough)"
                  >
                    <span className="emoji-icon">🥵</span>
                    <span className="emoji-text">Hard</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Review and Finish card */}
      <div className="glass-card todo-footer-card">
        <div className="form-group full-width">
          <label htmlFor="session-review">Session Review (Optional)</label>
          <textarea
            id="session-review"
            rows="3"
            placeholder="How did you feel today? Any notes about your energy level or achievements..."
            value={sessionReview}
            onChange={(e) => setSessionReview(e.target.value)}
            className="session-review-input"
          />
        </div>

        <button
          onClick={handleFinish}
          disabled={completedIds.size === 0}
          className={`btn btn-finish ${completedIds.size === workout.length ? "success" : "partial"}`}
        >
          {completedIds.size === workout.length ? "🎉 COMPLETE WORKOUT" : "FINISH & SAVE SESSION"}
        </button>
      </div>
    </div>
  );
}
