import { useState, useEffect } from 'react'
import './App.css'
import { OnBoarding } from './components/OnBoarding'
import { Dashboard } from './components/Dashboard';
import { db } from './config/db';

function App() {
  const [hasProfile, setHasProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function checkProfile() {
      try {
        const lastProfile = await db.profile.toCollection().last();
        setHasProfile(!!lastProfile);
      } catch (error) {
        console.error("Failed to check profile:", error);
        setHasProfile(false);
      }
    }
    checkProfile();
  }, []);

  if (hasProfile === null) {
    return (
      <div className="loading-container" style={{ minHeight: '100vh', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {!hasProfile ? (
        <OnBoarding isNew={true} onSuccess={() => setHasProfile(true)} />
      ) : isEditing ? (
        <OnBoarding 
          isNew={false} 
          onSuccess={() => {
            setHasProfile(true);
            setIsEditing(false);
          }} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <Dashboard onEditProfile={() => setIsEditing(true)} />
      )}
    </>
  );
}

export default App

