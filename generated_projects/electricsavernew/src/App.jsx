import React from "react";
import "./App.css";

function GeneratedApp() {
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [peopleCount, setPeopleCount] = React.useState(0);

  // Constants & Formulas
  const temperature = (24 - (peopleCount * 0.3)).toFixed(1);
  
  let status = "Normal";
  let statusColor = "#10b981"; // Green
  let suggestion = "Maintain current cooling.";

  if (peopleCount === 0) {
    status = "Empty";
    statusColor = "#6b7280"; // Gray
    suggestion = "System Suggestion: Turn OFF all AC units and lights.";
  } else if (peopleCount > 30) {
    status = "Overcrowded";
    statusColor = "#ef4444"; // Red
    suggestion = "System Suggestion: Increase cooling to maximum and enable exhaust fans.";
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.saveData({ action: "navigate", page: page, time: Date.now() });
  };

  const updatePeople = (val) => {
    const count = Math.max(0, parseInt(val) || 0);
    setPeopleCount(count);
    window.saveData({ action: "update_people_count", value: count, temperature: 24 - (count * 0.3) });
    
    // Play alert sound if conditions met
    if (count === 0 || count > 30) {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(() => { /* Browser may block autoplay without interaction */ });
    }
  };

  // Styles
  const styles = {
    container: { fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '20px' },
    nav: { display: 'flex', gap: '10px', marginBottom: '30px', backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    navBtn: (active) => ({
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      backgroundColor: active ? '#2563eb' : 'transparent',
      color: active ? '#fff' : '#4b5563',
      fontWeight: '600',
      transition: '0.3s'
    }),
    card: { backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' },
    statValue: { fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' },
    label: { color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '1.1rem', width: '100%', maxWidth: '300px', marginTop: '10px' },
    alertBox: (type) => ({
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: type === 'danger' ? '#fee2e2' : '#fef3c7',
      color: type === 'danger' ? '#991b1b' : '#92400e',
      borderLeft: `5px solid ${type === 'danger' ? '#ef4444' : '#f59e0b'}`,
      marginBottom: '15px'
    })
  };

  return (
    <div style={styles.container}>
      <header>
        <h1 style={{ color: '#1e293b', marginBottom: '20px' }}>⚡ Smart Electricity Manager</h1>
        <nav style={styles.nav}>
          <button 
            style={styles.navBtn(currentPage === 'dashboard')} 
            onClick={() => handlePageChange('dashboard')}
          >Dashboard</button>
          <button 
            style={styles.navBtn(currentPage === 'control')} 
            onClick={() => handlePageChange('control')}
          >Control Panel</button>
          <button 
            style={styles.navBtn(currentPage === 'alerts')} 
            onClick={() => handlePageChange('alerts')}
          >Alerts { (peopleCount === 0 || peopleCount > 30) && "🔴" }</button>
        </nav>
      </header>

      <main>
        {currentPage === 'dashboard' && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.label}>Occupancy</div>
              <div style={styles.statValue}>{peopleCount} <span style={{fontSize: '1rem'}}>People</span></div>
            </div>
            <div style={styles.card}>
              <div style={styles.label}>Calculated Temperature</div>
              <div style={styles.statValue}>{temperature}°C</div>
            </div>
            <div style={styles.card}>
              <div style={styles.label}>System Status</div>
              <div style={{...styles.statValue, color: statusColor}}>{status}</div>
            </div>
            <div style={{...styles.card, gridColumn: '1 / -1', borderLeft: `6px solid ${statusColor}`}}>
              <div style={styles.label}>AI Recommendation</div>
              <p style={{fontSize: '1.2rem', marginTop: '10px', color: '#1e293b'}}>{suggestion}</p>
            </div>
          </div>
        )}

        {currentPage === 'control' && (
          <div style={styles.card}>
            <h2 style={{marginTop: 0}}>Simulation Controls</h2>
            <p style={{color: '#4b5563'}}>Adjust the number of people in the room to see real-time energy calculations.</p>
            
            <div style={{marginTop: '25px'}}>
              <label style={styles.label}>Enter Number of People</label><br/>
              <input 
                type="number" 
                style={styles.input} 
                value={peopleCount} 
                onChange={(e) => updatePeople(e.target.value)}
              />
            </div>

            <div style={{marginTop: '30px', display: 'flex', gap: '10px'}}>
               <button 
                onClick={() => updatePeople(0)}
                style={{...styles.navBtn(false), backgroundColor: '#6b7280', color: 'white'}}
               >Reset (Empty)</button>
               <button 
                onClick={() => updatePeople(45)}
                style={{...styles.navBtn(false), backgroundColor: '#ef4444', color: 'white'}}
               >Simulate Overcrowding</button>
            </div>

            <div style={{marginTop: '40px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '10px'}}>
               <p><strong>Real-time Output:</strong></p>
               <p>Current Temp: {temperature}°C</p>
               <p>Target Power Load: {peopleCount > 0 ? (peopleCount * 120 + 500) : 0} Watts</p>
            </div>
          </div>
        )}

        {currentPage === 'alerts' && (
          <div style={styles.card}>
            <h2 style={{marginTop: 0}}>System Alerts</h2>
            
            {peopleCount === 0 && (
              <div style={styles.alertBox('warning')}>
                <strong>⚠️ ROOM EMPTY</strong>
                <p>No motion detected. Energy waste detected if appliances are running.</p>
              </div>
            )}

            {peopleCount > 30 && (
              <div style={styles.alertBox('danger')}>
                <strong>🚨 OVERCROWDING DETECTED</strong>
                <p>Current occupancy ({peopleCount}) exceeds safety threshold. Temperature rising rapidly.</p>
              </div>
            )}

            {peopleCount > 0 && peopleCount <= 30 && (
              <div style={{textAlign: 'center', padding: '40px', color: '#6b7280'}}>
                <div style={{fontSize: '3rem'}}>✅</div>
                <p>All systems normal. No active alerts.</p>
              </div>
            )}
            
            <div style={{marginTop: '20px', fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center'}}>
              Last Sync with Database: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function App() {
  return (
    <div className="project-shell theme-sunset-warmth">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Sunset Warmth</span>
          <h1>Sunset Warmth</h1>
          <p>A warm, soft interface with uplifting coral tones.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
