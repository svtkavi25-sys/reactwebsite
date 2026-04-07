import React from "react";
import "./App.css";

// STRICT RULES:
// - Must use: function GeneratedApp()
// - Must return JSX
// - No import (Assuming React, React.useState, React.useEffect are globally available via script tags in the HTML entry file, common in non-bundler setups or specific environments where this constraint is applied.)
// - No export
// - No ReactDOM.render
// - Use React.useState if needed
// - Keep it simple and valid
function App() {
  // State to simulate people count from an OpenCV input
  const [peopleCount, setPeopleCount] = React.useState(0);
  // Initialize Audio object for alerts
  // Using a simple public domain beep sound. In a real app, this would be a local asset.
  const [alertAudio] = React.useState(new Audio('https://www.soundjay.com/buttons/beep-07a.mp3'));
  // Calculate temperature based on peopleCount
  const temperature = 24 - (peopleCount * 0.3);
  // Determine current status
  let status = 'Normal';
  if (peopleCount === 0) {
    status = 'Empty';
  } else if (peopleCount > 30) {
    status = 'Overcrowded';
  }
  // Determine suggestions based on peopleCount
  let suggestion = 'System normal';
  if (peopleCount === 0) {
    suggestion = 'Turn OFF lights and fans';
  } else if (peopleCount > 30) {
    suggestion = 'Overcrowded – turn ON cooling';
  }
  // useEffect hook to play alert sound when conditions are met
  React.useEffect(() => {
    if (peopleCount === 0 || peopleCount > 30) {
      // Play sound. Note: Browsers might block autoplay of media if not initiated by a direct user gesture.
      // For this exercise, we call play() directly. In a production app, consider user interaction
      // to "unlock" audio or provide a button to enable sounds.
      alertAudio.play().catch(error => {
        // Handle potential errors, e.g., if browser blocks autoplay
        console.warn("Could not play alert sound (browser autoplay policy?):", error);
      });
    }
  }, [peopleCount, alertAudio]); // Re-run effect when peopleCount or alertAudio changes
  // Inline styles for a clean modern dashboard UI
  // Keeping all styles inside the component as per "No external libraries" and "All logic inside one file"
  const dashboardStyles = {
    appContainer: {
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#e0f2f7', // Light blue background
      padding: '20px',
      boxSizing: 'border-box',
    },
    dashboardCard: {
      background: '#ffffff',
      borderRadius: '20px',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
      padding: '40px 30px',
      maxWidth: '550px',
      width: '100%',
      textAlign: 'center',
      border: `4px solid ${
        status === 'Overcrowded' ? '#e74c3c' : // Red for overcrowded
        (status === 'Empty' ? '#f39c12' : '#2ecc71') // Orange for empty, Green for normal
      }`,
      transition: 'border-color 0.4s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      color: '#2c3e50',
      marginBottom: '30px',
      fontSize: '2.4em',
      fontWeight: '700',
    },
    section: {
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '1px solid #ebf2f5',
    },
    lastSection: {
      marginBottom: '0',
      paddingBottom: '0',
      borderBottom: 'none',
    },
    label: {
      fontSize: '1.2em',
      fontWeight: '600',
      color: '#555',
      marginBottom: '10px',
      display: 'block',
    },
    value: {
      fontSize: '2.2em',
      fontWeight: '800',
      color: '#3498db', // Blue for values
      lineHeight: '1.2',
    },
    statusValue: {
      fontSize: '2.2em',
      fontWeight: '800',
      color: status === 'Overcrowded' ? '#e74c3c' : (status === 'Empty' ? '#f39c12' : '#2ecc71'),
      transition: 'color 0.4s ease-in-out',
      textShadow: '0 0 5px rgba(0,0,0,0.05)',
    },
    suggestionValue: {
      fontSize: '1.3em',
      color: status === 'Overcrowded' ? '#c0392b' : (status === 'Empty' ? '#d35400' : '#27ae60'),
      fontStyle: 'italic',
      marginTop: '15px',
      padding: '10px',
      background: status === 'Overcrowded' ? '#faded6' : (status === 'Empty' ? '#fdf2e9' : '#eafaf1'),
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    inputGroup: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '25px',
      flexWrap: 'wrap',
    },
    inputField: {
      padding: '12px 18px',
      fontSize: '1.1em',
      borderRadius: '10px',
      border: '1px solid #ccc',
      width: '90px',
      textAlign: 'center',
      appearance: 'none', // Remove default spinner for number input
      MozAppearance: 'textfield', // Firefox specific
      WebkitAppearance: 'none', // Safari and Chrome specific
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
    },
    button: {
      background: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '12px 22px',
      fontSize: '1.1em',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      outline: 'none',
    },
    // Note: Inline styles don't directly support :hover.
    // In a real app with no external CSS, one might use a <style> tag in JSX
    // or simulate with onMouseEnter/onMouseLeave for complex effects.
    // For simplicity, we define base styles.
    buttonActive: {
      transform: 'translateY(1px)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }
  };
  return (
    <div style={dashboardStyles.appContainer}>
      <div style={dashboardStyles.dashboardCard}>
        <h1 style={dashboardStyles.header}>Smart Electricity Dashboard</h1>
        <div style={dashboardStyles.section}>
          <label style={dashboardStyles.label} htmlFor="people-input">
            Simulate People Count (OpenCV Input):
          </label>
          <div style={dashboardStyles.inputGroup}>
            <button
              style={dashboardStyles.button}
              onClick={() => setPeopleCount(prev => Math.max(0, prev - 1))}
            >
              -
            </button>
            <input
              id="people-input"
              type="number"
              min="0"
              value={peopleCount}
              onChange={(e) => setPeopleCount(parseInt(e.target.value) || 0)}
              style={dashboardStyles.inputField}
            />
            <button
              style={dashboardStyles.button}
              onClick={() => setPeopleCount(prev => prev + 1)}
            >
              +
            </button>
          </div>
        </div>
        <div style={dashboardStyles.section}>
          <span style={dashboardStyles.label}>People In Room:</span>
          <span style={dashboardStyles.value}>{peopleCount}</span>
        </div>
        <div style={dashboardStyles.section}>
          <span style={dashboardStyles.label}>Calculated Temperature:</span>
          <span style={dashboardStyles.value}>{temperature.toFixed(1)}°C</span>
        </div>
        <div style={dashboardStyles.section}>
          <span style={dashboardStyles.label}>Current Status:</span>
          <span style={dashboardStyles.statusValue}>{status}</span>
        </div>
        <div style={dashboardStyles.lastSection}>
          <span style={dashboardStyles.label}>Smart Suggestions:</span>
          <span style={dashboardStyles.suggestionValue}>{suggestion}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="project-shell theme-midnight-glow">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Midnight Glow</span>
          <h1>Midnight Glow</h1>
          <p>A bold, neon-infused interface with layered contrast.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
