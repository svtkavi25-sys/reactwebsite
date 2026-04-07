import React from "react";
import "./App.css";

/**
 * React.js component for a simple form with name, email, and password fields.
 * Includes client-side validation, error messages, and integration with
 * global window functions for database persistence.
 */
function GeneratedApp() {
  // --- Form State ---
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  // --- Validation Error States ---
  const [nameError, setNameError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [formSubmitted, setFormSubmitted] = React.useState(false);

  // --- Database Sync States ---
  const [history, setHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  const [saveError, setSaveError] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  // --- Effect to load historical data on component mount ---
  React.useEffect(() => {
    setIsLoading(true);
    setLoadError('');
    // Check if window.loadData exists before calling it
    if (typeof window.loadData === 'function') {
      window.loadData()
        .then(data => {
          setHistory(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error loading data:", error);
          setLoadError("Failed to load historical data.");
          setIsLoading(false);
        });
    } else {
      console.warn("window.loadData is not defined. Skipping historical data load.");
      setLoadError("`window.loadData` function not found.");
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Input Change Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormSubmitted(false); // Reset form submission status on any input change

    if (name === 'name') {
      setName(value);
      setNameError(''); // Clear error on change
    } else if (name === 'email') {
      setEmail(value);
      setEmailError(''); // Clear error on change
    } else if (name === 'password') {
      setPassword(value);
      setPasswordError(''); // Clear error on change
    }
  };

  // --- Form Validation Logic ---
  const validateForm = () => {
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      setNameError('Name is required.');
      isValid = false;
    } else {
      setNameError('');
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setSaveError(''); // Clear previous save errors

    if (validateForm()) {
      setFormSubmitted(true); // Indicate successful client-side validation
      
      // Construct payload for database
      const payload = {
        name: name,
        email: email,
        // For security reasons, we generally don't save plain passwords.
        // For this exercise, we'll indicate password presence.
        password_provided: true, 
        submission_time: Date.now(),
      };

      // Call window.saveData if available
      if (typeof window.saveData === 'function') {
        setIsSaving(true);
        try {
          await window.saveData(payload);
          console.log("Form data saved successfully:", payload);
          // Optionally, reload history or add the new item to state
          // For simplicity, let's re-trigger the history load to include the new item.
          setIsLoading(true); // Indicate loading again
          const updatedHistory = await window.loadData();
          setHistory(updatedHistory);
          
          // Clear form fields after successful submission and save
          setName('');
          setEmail('');
          setPassword('');

        } catch (error) {
          console.error("Error saving data:", error);
          setSaveError("Failed to save data. Please try again.");
          setFormSubmitted(false); // Revert success status if save fails
        } finally {
          setIsSaving(false);
        }
      } else {
        console.warn("window.saveData is not defined. Skipping data save.");
        setSaveError("`window.saveData` function not found. Data not saved.");
      }
    } else {
      setFormSubmitted(false); // Validation failed
    }
  };

  // --- JSX Render ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>User Registration Form</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: nameError ? '1px solid red' : '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          {nameError && <p style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }}>{nameError}</p>}
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: emailError ? '1px solid red' : '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          {emailError && <p style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }}>{emailError}</p>}
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', border: passwordError ? '1px solid red' : '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
          {passwordError && <p style={{ color: 'red', fontSize: '0.85em', marginTop: '5px' }}>{passwordError}</p>}
        </div>

        <button 
          type="submit" 
          disabled={isSaving}
          style={{ 
            padding: '12px 20px', 
            backgroundColor: isSaving ? '#999' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            fontSize: '1em', 
            cursor: isSaving ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            marginTop: '10px'
          }}
        >
          {isSaving ? 'Submitting...' : 'Register'}
        </button>

        {formSubmitted && !saveError && (
          <p style={{ color: 'green', textAlign: 'center', marginTop: '15px', fontWeight: 'bold' }}>
            Registration successful! Data {typeof window.saveData === 'function' ? 'saved.' : 'processed locally.'}
          </p>
        )}
        {saveError && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{saveError}</p>
        )}
      </form>

      <hr style={{ margin: '30px 0', borderColor: '#eee' }} />

      <h3 style={{ textAlign: 'center', color: '#333' }}>Historical Submissions ({history.length})</h3>
      {loadError && <p style={{ color: 'red', textAlign: 'center' }}>{loadError}</p>}
      {isLoading && <p style={{ textAlign: 'center' }}>Loading historical data...</p>}
      {!isLoading && history.length === 0 && !loadError && (
        <p style={{ textAlign: 'center' }}>No historical data found.</p>
      )}
      {!isLoading && history.length > 0 && (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {history.slice(-5).reverse().map((item, index) => ( // Display last 5 submissions
            <li key={item.created_at + index} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff', padding: '10px', borderBottom: '1px solid #eee', borderRadius: '4px', marginBottom: '5px' }}>
              <strong>Name:</strong> {item.payload.name || 'N/A'}<br />
              <strong>Email:</strong> {item.payload.email || 'N/A'}<br />
              <small style={{ color: '#666' }}>Submitted: {new Date(item.payload.submission_time || item.created_at).toLocaleString()}</small>
            </li>
          ))}
          {history.length > 5 && (
            <li style={{ textAlign: 'center', color: '#888', marginTop: '10px' }}>...showing last 5 of {history.length} total entries.</li>
          )}
        </ul>
      )}
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
