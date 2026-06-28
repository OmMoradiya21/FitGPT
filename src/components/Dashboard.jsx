import { useState, useEffect } from "react";
import { getAIResponse } from "../services/aiService";
import { db } from "../config/db.js";

export const Dashboard = ({ isNew, setIsNew }) => {
  const [durationOfWorkout, setDurationOfWorkout] = useState(30);
  const [workoutType, setWorkoutType] = useState("strength");
  const [focusArea, setFocusArea] = useState("");
  const [aiResponse, setAIResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      const profiles = await db.profile.toArray();
      const latestProfile = profiles[profiles.length - 1];
      if (latestProfile) {
        setProfile(latestProfile);
      }
    }
    fetchProfile();
  }, []);

  async function generateWorkoutPlan(e) {
    e.preventDefault();
    console.log("Generating workout plan...");
    setLoading(true);
    setError(null);

    try {
      const response = await getAIResponse({
        durationOfWorkout,
        workoutType,
        focusArea,
      });
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
          {profile && (
            <div className="glass-card profile-summary-card">
              <div className="profile-summary-header">
                <h3>{profile.name}'s Profile</h3>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Age</span>
                <span className="profile-detail-value">{profile.age} yrs</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Weight</span>
                <span className="profile-detail-value">{profile.weight} kg</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Height</span>
                <span className="profile-detail-value">{profile.height} cm</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Level</span>
                <span className="profile-detail-value">{profile.fitnessLevel}</span>
              </div>
              <div className="profile-detail-row">
                <span className="profile-detail-label">Goal</span>
                <span className="profile-detail-value">
                  {profile.goal === "loseWeight"
                    ? "Lose Weight"
                    : profile.goal === "gainWeight"
                    ? "Gain Weight"
                    : "Maintain Weight"}
                </span>
              </div>
              {profile.injuries && (
                <div className="profile-detail-row" style={{ flexDirection: "column", marginTop: "0.5rem" }}>
                  <span className="profile-detail-label" style={{ marginBottom: "0.25rem" }}>Injuries / Limitations</span>
                  <span className="profile-detail-value" style={{ color: "var(--error)" }}>{profile.injuries}</span>
                </div>
              )}
            </div>
          )}

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
            <div className="empty-plan-state">
              <div className="empty-plan-icon">💪</div>
              <h3>Ready to train?</h3>
              <p>Fill out the workout parameters on the left and click "Generate Plan" to get your customized routine.</p>
            </div>
          )}

          {!loading && aiResponse && (
            <div className="workout-plan-container">
              <div className="glass-card plan-header-card">
                <h2>{aiResponse.title || "Your Custom Workout"}</h2>
                <div className="plan-meta-row">
                  <div className="plan-tag tag-duration">
                    ⏱️ {aiResponse.estimatedDuration || durationOfWorkout} Mins
                  </div>
                  <div className="plan-tag tag-difficulty">
                    🔥 {aiResponse.difficulty || "All Levels"}
                  </div>
                  <div className="plan-tag" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-h)", border: "1px solid var(--border)" }}>
                    🎯 Focus: {focusArea || "General"}
                  </div>
                </div>
              </div>

              <div className="plan-sections-grid">
                {aiResponse.warmup && aiResponse.warmup.length > 0 && (
                  <div className="glass-card plan-column-card">
                    <h3 className="column-title">Warm-up</h3>
                    <ul className="warmup-list">
                      {aiResponse.warmup.map((exercise, idx) => (
                        <li key={idx} className="warmup-item">
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResponse.exercises && aiResponse.exercises.length > 0 && (
                  <div className="glass-card plan-column-card">
                    <h3 className="column-title">Main Exercises</h3>
                    <div className="exercises-grid">
                      {aiResponse.exercises.map((ex, idx) => (
                        <div key={idx} className="exercise-card">
                          <div className="exercise-title">{ex.name}</div>
                          <div className="exercise-stats">
                            <div className="stat-item">
                              <span className="stat-label">Sets</span>
                              <span className="stat-val">{ex.sets || "—"}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Reps</span>
                              <span className="stat-val">{ex.reps || "—"}</span>
                            </div>
                            <div className="stat-item">
                              <span className="stat-label">Rest</span>
                              <span className="stat-val">{ex.restSeconds ? `${ex.restSeconds}s` : "—"}</span>
                            </div>
                          </div>
                          {ex.notes && <div className="exercise-notes">{ex.notes}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {aiResponse.cooldown && aiResponse.cooldown.length > 0 && (
                  <div className="glass-card plan-column-card">
                    <h3 className="column-title">Cool-down</h3>
                    <ul className="cooldown-list">
                      {aiResponse.cooldown.map((exercise, idx) => (
                        <li key={idx} className="cooldown-item">
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiResponse.coachNotes && (
                  <div className="glass-card coach-notes-card">
                    <h3 className="coach-notes-title">⚡ Coach's Advice</h3>
                    <div className="coach-notes-text">{aiResponse.coachNotes}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
