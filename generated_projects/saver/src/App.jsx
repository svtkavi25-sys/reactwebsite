import React from "react";
import "./App.css";

function GeneratedApp() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [peopleCount, setPeopleCount] = React.useState(15);

  // Calculations
  const temperature = (24 - (peopleCount * 0.3)).toFixed(1);
  
  let status = "Normal";
  let suggestion = "Standard Cooling Mode";
  let statusColor = "#10b981"; // Green

  if (peopleCount === 0) {
    status = "Empty";
    suggestion = "Turn OFF AC and Lights";
    statusColor = "#6b7280"; // Gray
  } else if (peopleCount > 30) {
    status = "Overcrowded";
    suggestion = "Increase Cooling - Maximum Power";
    statusColor = "#ef4444"; // Red
  }

  // Effect-like logic for sound and data saving
  const updatePeople = (val) => {
    const newCount = Math.max(0, parseInt(val) || 0);
    setPeopleCount(newCount);
    
    // Sync to DB
    if (typeof window.saveData === 'function') {
      window.saveData({ 
        action: "update_people_count", 
        value: newCount, 
        temp: 24 - (newCount * 0.3),
        timestamp: Date.now() 
      });
    }

    // Alert Logic
    if (newCount === 0 || newCount > 30) {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(e => console.log("Audio play blocked until user interaction"));
    }
  };

  // Styles
  const styles = {
    container: {
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
      color: '#1f2937'
    },
    nav: {
      display: 'flex',
      backgroundColor: '#1e293b',
      padding: '1rem',
      gap: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    navBtn: (active) => ({
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      backgroundColor: active ? '#3b82f6' : 'transparent',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: '600',
      transition: '0.3s'
    }),
    content: {
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginBottom: '1rem'
    },
    badge: (color) => ({
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      backgroundColor: color,
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: 'bold'
    }),
    input: {
      width: '100%',
      padding: '0.75rem',
      fontSize: '1.25rem',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      marginTop: '1rem'
    },
    alertItem: {
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderLeft: '5px solid'
    }
  };

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <button 
          style={styles.navBtn(currentPage === 'dashboard')} 
          onClick={() => setCurrentPage('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          style={styles.navBtn(currentPage === 'control')} 
          onClick={() => setCurrentPage('control')}
        >
          🎛️ Control
        </button>
        <button 
          style={styles.navBtn(currentPage === 'alerts')} 
          onClick={() => setCurrentPage('alerts')}
        >
          ⚠️ Alerts
        </button>
      </nav>

      <div style={styles.content}>
        
        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div>
            <h1 style={{marginBottom: '1.5rem'}}>Smart Management Overview</h1>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div style={styles.card}>
                <p style={{color: '#6b7280', margin: 0}}>Occupancy</p>
                <h2 style={{fontSize: '2rem', margin: '0.5rem 0'}}>{peopleCount} People</h2>
                <span style={styles.badge(statusColor)}>{status}</span>
              </div>
              <div style={styles.card}>
                <p style={{color: '#6b7280', margin: 0}}>Current Temp</p>
                <h2 style={{fontSize: '2rem', margin: '0.5rem 0'}}>{temperature}°C</h2>
                <p style={{fontSize: '0.8rem', color: '#9ca3af'}}>Formula: 24 - (P * 0.3)</p>
              </div>
            </div>
            <div style={{...styles.card, borderTop: `4px solid ${statusColor}`}}>
              <h3>System Suggestion</h3>
              <p style={{fontSize: '1.2rem', color: '#374151'}}>{suggestion}</p>
            </div>
          </div>
        )}

        {/* Control Page */}
        {currentPage === 'control' && (
          <div>
            <h1>Simulation Control</h1>
            <div style={styles.card}>
              <label>Update Number of People in Room:</label>
              <input 
                type="number" 
                style={styles.input} 
                value={peopleCount}
                onChange={(e) => updatePeople(e.target.value)}
              />
              <div style={{marginTop: '2rem', textAlign: 'center'}}>
                <p>Live Temperature Feedback:</p>
                <div style={{fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6'}}>
                  {temperature}°C
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Page */}
        {currentPage === 'alerts' && (
          <div>
            <h1>System Alerts</h1>
            {peopleCount === 0 && (
              <div style={{...styles.alertItem, backgroundColor: '#fef2f2', borderLeftColor: '#ef4444'}}>
                <div>
                  <strong style={{display: 'block'}}>Room Empty</strong>
                  <span>Energy waste detected. No occupants found.</span>
                </div>
                <span style={{fontSize: '1.5rem'}}>🔌</span>
              </div>
            )}
            
            {peopleCount > 30 && (
              <div style={{...styles.alertItem, backgroundColor: '#fffbe6', borderLeftColor: '#f59e0b'}}>
                <div>
                  <strong style={{display: 'block'}}>Overcrowded</strong>
                  <span>{peopleCount} people detected. CO2 levels may rise.</span>
                </div>
                <span style={{fontSize: '1.5rem'}}>🔥</span>
              </div>
            )}

            {peopleCount > 0 && peopleCount <= 30 && (
              <div style={{textAlign: 'center', padding: '3rem', color: '#9ca3af'}}>
                <p>No active alerts. System running normally.</p>
              </div>
            )}

            <div style={{marginTop: '2rem', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center'}}>
              Alerts trigger sound notifications for 0 or >30 occupants.
            </div>
          </div>
        )}

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
