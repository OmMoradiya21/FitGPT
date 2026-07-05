import { useState, useEffect } from "react";
import { db } from "../config/db.js";
import CheckAPIButton from "./CheckAPIButton.jsx";

export const OnBoarding = ({ isNew, onSuccess, onCancel }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [activityLevel, setActivityLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [weeklyCommitment, setWeeklyCommitment] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [injuries, setInjuries] = useState("");
  const [APIKey, setAPIKey] = useState("");
  const [ isAPIValid, setIsAPIValid ] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const profiles = await db.profile.toArray();
      const profile = profiles[profiles.length - 1];
      if (profile) {
        setName(profile.name);
        setAge(profile.age);
        setGender(profile.gender);
        setWeight(profile.weight);
        setHeight(profile.height);
        setActivityLevel(profile.activityLevel);
        setGoal(profile.goal);
        setWeeklyCommitment(profile.weeklyCommitment);
        setFitnessLevel(profile.fitnessLevel);
        setInjuries(profile.injuries);
        setAPIKey(profile.APIKey);
        if (profile.APIKey) {
          setIsAPIValid(true);
        }
      }
    }
    fetchProfile();
  }, []);

  function onboardingFormHandler(event) {
    event.preventDefault();
    db.profile.add({
      name,
      age,
      gender,
      weight,
      height,
      activityLevel,
      goal,
      weeklyCommitment,
      fitnessLevel,
      injuries,
      APIKey,
      date: new Date().toISOString(),
    });
    onSuccess();
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-grid">
        <div className="onboarding-hero">
          <div>
            <div className="logo-container">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">FitGPT</span>
            </div>
            <h2>Unlock Your Peak Potential</h2>
            <p>
              FitGPT uses advanced AI to build personalized, safe, and effective
              training programs tailored specifically for you.
            </p>
            <ul className="hero-benefits">
              <li>Custom AI-generated workouts</li>
              <li>Adapts to your recent history</li>
              <li>Respects injuries & limitations</li>
              <li>Optimized for your schedule</li>
            </ul>
          </div>
          <div>
            <p
              style={{ margin: 0, fontSize: "0.85rem", color: "var(--accent)" }}
            >
              Powered by Gemini 2.5 Flash
            </p>
          </div>
        </div>
        <div className="onboarding-form-panel">
          <h2 className="form-title">
            {isNew ? "Create Your Profile" : "Edit Your Profile"}
          </h2>
          <form onSubmit={onboardingFormHandler} className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="activityLevel">Activity Level</label>
              <select
                id="activityLevel"
                name="activityLevel"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                required
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="veryActive">Very Active</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goal">Goal</label>
              <select
                id="goal"
                name="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                required
              >
                <option value="loseWeight">Lose Weight</option>
                <option value="gainWeight">Gain Weight</option>
                <option value="maintainWeight">Maintain Weight</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weeklyCommitment">Weekly Commitment</label>
              <select
                id="weeklyCommitment"
                name="weeklyCommitment"
                value={weeklyCommitment}
                onChange={(e) => setWeeklyCommitment(e.target.value)}
                required
              >
                <option value="1">1 day/week</option>
                <option value="2">2 days/week</option>
                <option value="3">3 days/week</option>
                <option value="4">4 days/week</option>
                <option value="5">5 days/week</option>
                <option value="6">6 days/week</option>
                <option value="7">7 days/week</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="fitnessLevel">Fitness Level</label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="injuries">Injuries / Limitations</label>
              <input
                type="text"
                id="injuries"
                name="injuries"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="APIKey">API Key</label>
              <CheckAPIButton
                APIKey={APIKey}
                isAPIValid={isAPIValid}
                setIsAPIValid={setIsAPIValid}
              >
                <input
                  type="password"
                  id="APIKey"
                  name="APIKey"
                  value={APIKey}
                  onChange={(e) => {
                    setAPIKey(e.target.value);
                    if (e.target.value !== APIKey) {
                      setIsAPIValid(false);
                    }
                  }}
                  autoComplete="off"
                  required
                />
              </CheckAPIButton>
              <p className="onboarding-footer-text">
                Don't have an API Key?{" "}
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get one here
                </a>
              </p>
            </div>

            <div
              className="form-group full-width"
              style={{ marginTop: "1rem" }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%" }}
                disabled={!isAPIValid}
              >
                {isNew ? "Get Started" : "Save Changes"}
              </button>
              {!isNew && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: "100%", marginTop: "0.75rem" }}
                  onClick={onCancel}
                >
                  Cancel
                </button>
              )}
              <p className="onboarding-footer-text">
                By entering an API key, you authorize this app to make requests
                to Google Gemini on your behalf
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
