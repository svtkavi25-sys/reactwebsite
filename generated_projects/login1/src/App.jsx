import React from "react";
import "./App.css";

/**
 * React.js component for a simple login page.
 *
 * Requirements:
 * - Uses function GeneratedApp()
 * - Returns JSX
 * - No import, no export, no ReactDOM.render
 * - Uses React.useState for managing component state
 * - Uses React.useEffect for side effects (loading data from localStorage)
 * - Input fields for username and password
 * - Login button
 * - Stores username in localStorage upon successful login
 * - Displays "Welcome username" if already logged in, along with a logout button
 * - Logout button clears username from localStorage
 * - Integrates with `window.saveData` to log login/logout events to the database.
 * - Clean and simple UI using basic inline styles.
 */
function App() {
  // State for username and password input fields
  const [usernameInput, setUsernameInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  // State for the currently logged-in user (null if not logged in)
  const [loggedInUser, setLoggedInUser] = React.useState(null);

  /**
   * React.useEffect hook to check for a logged-in user in localStorage on component mount.
   * If a user is found, update the loggedInUser state.
   */
  React.useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  /**
   * Handles the login process when the form is submitted.
   * - Prevents default form submission.
   * - Performs a basic validation (username and password not empty).
   * - Stores the username in localStorage.
   * - Updates the loggedInUser state.
   * - Calls `window.saveData` to log the login event.
   * - Clears the input fields.
   */
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission to avoid page reload

    if (usernameInput && passwordInput) {
      // For this simple example, any non-empty username/password is considered a "successful" login.
      localStorage.setItem('loggedInUser', usernameInput);
      setLoggedInUser(usernameInput);

      // Log the login event to the database using the global saveData function
      if (window.saveData) {
        window.saveData({
          action: "user_login",
          username: usernameInput,
          timestamp: Date.now()
        });
      }

      // Clear the input fields after successful login
      setUsernameInput('');
      setPasswordInput('');
    } else {
      alert('Please enter both username and password.');
    }
  };

  /**
   * Handles the logout process.
   * - Calls `window.saveData` to log the logout event *before* clearing user data.
   * - Removes the username from localStorage.
   * - Clears the loggedInUser state.
   */
  const handleLogout = () => {
    // Log the logout event to the database using the global saveData function
    // Ensure loggedInUser is not null before trying to save its username
    if (window.saveData && loggedInUser) {
      window.saveData({
        action: "user_logout",
        username: loggedInUser, // Use the current loggedInUser before clearing it
        timestamp: Date.now()
      });
    }

    localStorage.removeItem('loggedInUser'); // Remove user from localStorage
    setLoggedInUser(null); // Clear the logged-in user state
  };

  // Basic inline styles for a clean and simple UI
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  };

  const inputGroupStyle = {
    marginBottom: '15px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '16px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.2s ease',
  };

  const loginButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#dc3545',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      {loggedInUser ? (
        // Render welcome message and logout button if user is logged in
        <div>
          <h2 style={{ color: '#333', textAlign: 'center' }}>Welcome, {loggedInUser}!</h2>
          <button
            onClick={handleLogout}
            style={logoutButtonStyle}
          >
            Logout
          </button>
        </div>
      ) : (
        // Render login form if no user is logged in
        <div>
          <h2 style={{ color: '#333', textAlign: 'center' }}>Login</h2>
          <form onSubmit={handleLogin}>
            <div style={inputGroupStyle}>
              <label htmlFor="username" style={labelStyle}>Username:</label>
              <input
                type="text"
                id="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                style={inputStyle}
                aria-label="Username"
              />
            </div>
            <div style={inputGroupStyle}>
              <label htmlFor="password" style={labelStyle}>Password:</label>
              <input
                type="password"
                id="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={inputStyle}
                aria-label="Password"
              />
            </div>
            <button
              type="submit"
              style={loginButtonStyle}
            >
              Login
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="project-shell theme-deep-forest">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Deep Forest</span>
          <h1>Woodland Serenity</h1>
          <p>Grounded and organic with deep greenery and soft moss tones.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
