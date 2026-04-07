import React from "react";
import "./App.css";

function GeneratedApp() {
    // State for the username and password input fields
    const [usernameInput, setUsernameInput] = React.useState('');
    const [passwordInput, setPasswordInput] = React.useState('');

    // State for the currently logged-in user.
    // Initialized by checking localStorage to see if a user was previously logged in.
    const [currentUser, setCurrentUser] = React.useState(() => {
        // This function runs only once during the component's initial render
        // to retrieve the stored user from localStorage.
        return localStorage.getItem('loggedInUser');
    });

    /**
     * Handles the login process.
     * Stores the username in localStorage and updates component state.
     * Calls window.saveData to persist the login action.
     */
    const handleLogin = () => {
        if (usernameInput && passwordInput) {
            localStorage.setItem('loggedInUser', usernameInput);
            setCurrentUser(usernameInput); // Update state to trigger re-render

            // Call the global saveData function to log the login event
            if (typeof window.saveData === 'function') {
                window.saveData({
                    action: "login",
                    username: usernameInput,
                    time: Date.now()
                });
            }

            // Clear the password field after login for security and UI cleanliness
            setPasswordInput('');
        } else {
            // Basic validation
            alert('Please enter both username and password to log in.');
        }
    };

    /**
     * Handles the logout process.
     * Clears the username from localStorage and updates component state.
     * Calls window.saveData to persist the logout action.
     */
    const handleLogout = () => {
        const loggedOutUser = currentUser; // Capture current user before clearing state
        localStorage.removeItem('loggedInUser');
        setCurrentUser(null); // Clear state to trigger re-render (show login form)

        // Optionally clear the username input field as well
        setUsernameInput('');

        // Call the global saveData function to log the logout event
        if (typeof window.saveData === 'function') {
            window.saveData({
                action: "logout",
                username: loggedOutUser, // Use the captured username
                time: Date.now()
            });
        }
    };

    // --- Simple Inline Styles for Clean UI ---
    const containerStyle = {
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px',
        margin: '50px auto',
        padding: '25px',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
        textAlign: 'center'
    };

    const inputStyle = {
        width: 'calc(100% - 24px)', // Account for padding
        padding: '12px',
        margin: '10px 0',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px'
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '15px',
        transition: 'background-color 0.2s ease'
    };

    const logoutButtonStyle = {
        ...buttonStyle, // Inherit base button styles
        backgroundColor: '#dc3545',
        marginRight: '0' // Remove right margin if only one button
    };
    
    // Add hover effect for buttons
    buttonStyle[':hover'] = { backgroundColor: '#0056b3' };
    logoutButtonStyle[':hover'] = { backgroundColor: '#c82333' };

    const headingStyle = {
        color: '#333',
        marginBottom: '20px'
    };

    const welcomeMessageStyle = {
        fontSize: '1.8em',
        color: '#007bff',
        marginBottom: '25px'
    };

    return (
        <div style={containerStyle}>
            {currentUser ? (
                // If a user is logged in, display a welcome message and a logout button
                <div>
                    <h2 style={welcomeMessageStyle}>Welcome, {currentUser}!</h2>
                    <button
                        style={logoutButtonStyle}
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            ) : (
                // If no user is logged in, display the login form
                <div>
                    <h2 style={headingStyle}>Login to Your Account</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <input
                            type="password" // Use type="password" for security
                            placeholder="Password"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <button
                        style={buttonStyle}
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            )}
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
