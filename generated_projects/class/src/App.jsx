import React from "react";
import "./App.css";

function GeneratedApp() {
  const [peopleCount, setPeopleCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState('Dashboard');

  // Logic Variables
  const temperature = (24 - peopleCount * 0.3).toFixed(1);
  
  let status = "Normal";
  let alertMsg = "";
  let energyStatus = "Optimal usage";

  if (peopleCount === 0) {
    status = "Empty";
    alertMsg = "No people detected → Turn OFF power";
    energyStatus = "Low usage";
  } else if (peopleCount > 30) {
    status = "Overcrowded";
    alertMsg = "Overcrowded → Increase cooling";
    energyStatus = "High usage";
  }

  // Database Sync
  React.useEffect(() => {
    window.saveData({
      people: peopleCount,
      temp: temperature,
      status: status,
      timestamp: Date.now()
    });
  }, [peopleCount]);

  // Alert Sound Function
  const playAlert = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, context.currentTime);
    osc.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.2);
  };

  React.useEffect(() => {
    if (peopleCount === 0 || peopleCount > 30) {
      playAlert();
    }
  }, [peopleCount]);

  // Styles
  const styles = {
    container: { fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', padding: '20px' },
    nav: { display: 'flex', gap: '10px', marginBottom: '20px', background: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    navButton: (active) => ({
      padding: '10px 20px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: active ? '#2c3e50' : '#ecf0f1',
      color: active ? '#fff' : '#2c3e50',
      fontWeight: 'bold'
    }),
    card: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
    title: { color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px' },
    stat: { fontSize: '24px', margin: '10px 0' },
    input: { padding: '10px', fontSize: '18px', width: '100px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ddd' },
    alertBox: { padding: '15px', borderRadius: '8px', backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba', marginTop: '10px' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>Smart Classroom Energy Optimizer</h1>
      
      {/* Navigation */}
      <div style={styles.nav}>
        {['Dashboard', 'Control Panel', 'Alerts Panel', 'Energy Insights'].map(page => (
          <button 
            key={page} 
            style={styles.navButton(currentPage === page)} 
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={styles.card}>
        
        {currentPage === 'Dashboard' && (
          <div>
            <h2 style={styles.title}>Live Dashboard</h2>
            <p style={styles.stat}>👥 People Count: <strong>{peopleCount}</strong></p>
            <p style={styles.stat}>🌡️ Current Temperature: <strong>{temperature}°C</strong></p>
            <p style={styles.stat}>📍 Status: <span style={{color: status === 'Normal' ? 'green' : 'red'}}>{status}</span></p>
          </div>
        )}

        {currentPage === 'Control Panel' && (
          <div>
            <h2 style={styles.title}>System Control</h2>
            <p>Adjust the number of people in the classroom manually for testing:</p>
            <input 
              style={styles.input}
              type="number" 
              value={peopleCount} 
              onChange={(e) => setPeopleCount(Math.max(0, parseInt(e.target.value) || 0))} 
            />
            <button 
              style={{...styles.navButton(true), backgroundColor: '#3498db'}}
              onClick={() => {
                window.saveData({ "action": "manual_update", "count": peopleCount });
                alert("Data Synced to Database");
              }}
            >
              Update & Sync
            </button>
          </div>
        )}

        {currentPage === 'Alerts Panel' && (
          <div>
            <h2 style={styles.title}>System Alerts</h2>
            {alertMsg ? (
              <div style={styles.alertBox}>
                <h3>⚠️ ALERT ACTIVE</h3>
                <p>{alertMsg}</p>
                <button onClick={playAlert} style={{padding: '5px 10px', cursor: 'pointer'}}>Test Alert Sound</button>
              </div>
            ) : (
              <p style={{color: 'green'}}>✅ System running normally. No alerts.</p>
            )}
          </div>
        )}

        {currentPage === 'Energy Insights' && (
          <div>
            <h2 style={styles.title}>Energy Efficiency</h2>
            <div style={{
              padding: '20px', 
              borderRadius: '8px', 
              backgroundColor: energyStatus === 'High usage' ? '#f8d7da' : '#d4edda',
              color: energyStatus === 'High usage' ? '#721c24' : '#155724'
            }}>
              <h3>Current Rating: {energyStatus}</h3>
              <p>Based on current occupancy of {peopleCount} people.</p>
              <ul>
                <li>Lighting: {peopleCount === 0 ? 'OFF' : 'ON (Auto)'}</li>
                <li>HVAC Setpoint: {temperature}°C</li>
                <li>Power Optimization: {peopleCount === 0 ? 'Maximum' : 'Balanced'}</li>
              </ul>
            </div>
          </div>
        )}

      </div>
      
      <footer style={{marginTop: '20px', fontSize: '12px', textAlign: 'center', color: '#95a5a6'}}>
        Connected to Django Database Sync Engine
      </footer>
    </div>
  );
}

function App() {
  return (
    <div className="project-shell theme-cyber-punk">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Cyber Neon</span>
          <h1>Neon Genesis</h1>
          <p>High-octane aesthetic with vibrant glowing elements.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
