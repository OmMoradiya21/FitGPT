import { useState, useEffect } from 'react'
import './App.css'
import { OnBoarding } from './components/OnBoarding'
import { Dashboard } from './components/Dashboard';
import { db } from './config/db';

function App() {
  const [isNew, setIsNew] = useState(null);

  useEffect(() => {
    async function checkProfile() {
      try {
        const lastProfile = await db.profile.toCollection().last();
        if (lastProfile) {
          setIsNew(false);
        } else {
          setIsNew(true);
        }
      } catch (error) {
        console.error("Failed to check profile:", error);
        setIsNew(true);
      }
    }
    checkProfile();
  }, []);

  if (isNew === null) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      { isNew ? <OnBoarding isNew={isNew} setIsNew={setIsNew} /> : null}
      { !isNew ? <Dashboard isNew={isNew} setIsNew={setIsNew} /> : null}
    </>
  )
}

export default App

