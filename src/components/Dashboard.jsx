import { useState, useEffect } from "react";
import { getAIResponse } from "../services/aiService";
import { db } from "../config/db.js";
import WorkoutTodo from "./WorkoutTodo";

export const Dashboard = ({ isNew, setIsNew }) => {
  const [durationOfWorkout, setDurationOfWorkout] = useState(30);
  const [workoutType, setWorkoutType] = useState("strength");
  const [focusArea, setFocusArea] = useState("");
  const [aiResponse, setAIResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedHistoryWorkoutIds, setExpandedHistoryWorkoutIds] = useState(new Set());
  const [showHistorySection, setShowHistorySection] = useState(false);

  const toggleHistoryExpand = (id) => {
    setExpandedHistoryWorkoutIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const fetchHistory = async () => {
    try {
      const pastWorkouts = await db.history.orderBy("id").reverse().limit(10).toArray();
      setHistory(pastWorkouts);
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      const profiles = await db.profile.toArray();
      const latestProfile = profiles[profiles.length - 1];
      if (latestProfile) {
        setProfile(latestProfile);
      }
    }
    fetchProfile();
    fetchHistory();
  }, []);

  const handleFinishWorkout = async (ratedWorkout, review) => {
    try {
      await db.history.add({
        date: new Date().toISOString(),
        completed: true,
        workoutTitle: "Custom Workout",
        duration: durationOfWorkout,
        workoutType: workoutType,
        focusArea: focusArea,
        exercises: ratedWorkout,
        review: review
      });
      setAIResponse(null);
      fetchHistory();
    } catch (e) {
      console.error("Failed to save workout to history:", e);
    }
  };

  async function generateWorkoutPlan(e) {
    e.preventDefault();
    console.log("Generating workout plan...");
    setLoading(true);
    setError(null);

    try {
      console.time("response");
      const response = await getAIResponse({
        durationOfWorkout,
        workoutType,
        focusArea,
      });
      console.timeEnd("response");

      setAIResponse(response);
    } catch (error) {
      setError(error.message);
    } finally {
      console.log("final response");
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-screen">
      <header className="dashboard-header">
        <div className="logo-container" style={{ margin: 0 }}>
          <span className="logo-icon">⚡</span>
          <span className="logo-text">FitGPT</span>
        </div>
        <button onClick={() => setIsNew(true)} className="btn btn-secondary">
          Edit Profile
        </button>
      </header>

      <main className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">

          <div className="glass-card generator-card">
            <h3>Generate Workout</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text)", marginBottom: "1.25rem" }}>
              Customize your workout details and let Gemini design your training plan.
            </p>
            <form onSubmit={generateWorkoutPlan}>
              <div className="form-group">
                <label htmlFor="durationOfWorkout">Duration (minutes)</label>
                <input
                  type="number"
                  id="durationOfWorkout"
                  name="durationOfWorkout"
                  required
                  min="15"
                  max="60"
                  step="15"
                  value={durationOfWorkout}
                  onChange={(e) => setDurationOfWorkout(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="workoutType">Workout Type</label>
                <select
                  id="workoutType"
                  name="workoutType"
                  required
                  value={workoutType}
                  onChange={(e) => setWorkoutType(e.target.value)}
                >
                  <option value="cardio">Cardio</option>
                  <option value="strength">Strength</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="combination">Combination</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="focusArea">Focus Area</label>
                <input
                  type="text"
                  id="focusArea"
                  name="focusArea"
                  placeholder="e.g. chest, legs, full body"
                  required
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" id="generatePlan" disabled={loading ? true : false}>
                {loading ? 'Generating Plan...' : 'Generate Plan'}
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="dashboard-content">
          {error && (
            <div className="alert-error">
              <span>⚠️ Error: {error}</span>
            </div>
          )}

          {loading && (
            <div className="glass-card loading-container">
              <div className="spinner"></div>
              <div className="loading-text">Gemini is crafting your personalized workout...</div>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
                <div className="skeleton-title"></div>
                <div className="skeleton-text" style={{ width: "100%" }}></div>
                <div className="skeleton-text" style={{ width: "85%" }}></div>
                <div className="skeleton-text" style={{ width: "90%" }}></div>
              </div>
            </div>
          )}

          {!loading && !aiResponse && (
            <>
              <div className="empty-plan-state">
                <div className="empty-plan-icon">💪</div>
                <h3>Ready to train?</h3>
                <p>Fill out the workout parameters on the left and click "Generate Plan" to get your customized routine.</p>
              </div>

              {history.length > 0 && (
                <div className="history-section">
                  <h3 className="history-title">Recent Workouts</h3>
                  <div className="history-card-list">
                    {history.map((log) => {
                      const isExpanded = expandedHistoryIds.has(log.id);

                      return (
                        <div key={log.id} className="glass-card history-item-card">
                          <div 
                            className="history-header" 
                            onClick={() => toggleHistoryExpand(log.id)}
                            style={{ cursor: "pointer", userSelect: "none" }}
                          >
                            <span className="history-date">
                              📅 {new Date(log.date).toLocaleDateString(undefined, {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <div className="history-summary" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span className="plan-tag tag-duration">⏱️ {log.duration} mins</span>
                              <span className="plan-tag tag-difficulty" style={{ textTransform: 'capitalize' }}>🔥 {log.workoutType}</span>
                              {log.focusArea && (
                                <span className="plan-tag" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-h)", border: "1px solid var(--border)" }}>
                                  🎯 {log.focusArea}
                                </span>
                              )}
                              <span className="history-expand-indicator" style={{ color: "var(--accent)", fontWeight: "bold", marginLeft: "0.5rem" }}>
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                          </div>

                          {isExpanded && (
                            <>
                              <div className="history-exercises">
                                {log.exercises.map((ex, idx) => (
                                  <div key={idx} className="history-exercise-row">
                                    <span className="history-exercise-name">
                                      {ex.name} ({ex.sets}x{ex.reps})
                                    </span>
                                    {ex.feedback && (
                                      <span className={`history-exercise-feedback feedback-${ex.feedback}`}>
                                        {ex.feedback === "good" ? "😊 Good" : ex.feedback === "average" ? "😐 Medium" : "🥵 Hard"}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {log.review && (
                                <div className="history-review-box">
                                  <strong>Note:</strong> "{log.review}"
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && aiResponse && (
            <WorkoutTodo
              workout={aiResponse}
              onFinish={handleFinishWorkout}
              onCancel={() => setAIResponse(null)}
            />
          )}
        </section>
      </main>
    </div>
  );
};
