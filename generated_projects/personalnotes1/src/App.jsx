import React from "react";
import "./App.css";

// Assume React is globally available, e.g., via a <script src="react.development.js"></script> tag
// and React.useState, React.useEffect are directly accessible.
// This component adheres to the strict rules: no import, no export, function GeneratedApp(), returns JSX.

function App() {
    // --- State Variables ---
    // Core application state for navigation and authentication
    const [currentPage, setCurrentPage] = React.useState('login'); // 'login', 'signup', 'dashboard', 'add-note', 'view-notes'
    const [authToken, setAuthToken] = React.useState(null);
    const [username, setUsername] = React.useState(null);
    const [message, setMessage] = React.useState(''); // For displaying user feedback (success/error)
    const [notes, setNotes] = React.useState([]); // User-specific notes

    // State for forms (controlled components)
    const [loginUsername, setLoginUsername] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [signupUsername, setSignupUsername] = React.useState('');
    const [signupPassword, setSignupPassword] = React.useState('');
    const [newNoteTitle, setNewNoteTitle] = React.useState('');
    const [newNoteContent, setNewNoteContent] = React.useState('');

    // State for global data fetched via window.loadData (separate from user notes)
    const [globalLog, setGlobalLog] = React.useState([]);

    // --- Helper Functions ---

    /**
     * Navigates to a different page and clears any existing messages.
     * @param {string} page The target page ('login', 'signup', 'dashboard', etc.)
     */
    const navigateTo = (page) => {
        setMessage(''); // Clear messages on navigation
        setCurrentPage(page);
    };

    /**
     * Clears authentication details from localStorage and state, then redirects to login.
     * Also logs the logout action using window.saveData.
     */
    const clearAuth = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setAuthToken(null);
        setUsername(null);
        setNotes([]); // Clear notes on logout
        navigateTo('login');
        // Log the logout event to the database using the global function
        window.saveData({ action: "logout", user: username, timestamp: Date.now() });
    };

    /**
     * Displays a temporary message to the user.
     * @param {string} msg The message content.
     * @param {string} type The type of message ('success', 'error', 'info').
     */
    const showMessage = (msg, type = 'info') => {
        setMessage(<p style={{ color: type === 'error' ? 'red' : type === 'success' ? 'green' : 'black', margin: '10px 0' }}>{msg}</p>);
        setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
    };

    // --- Backend Simulation & Fetch API Calls ---
    // These functions simulate API calls to a hypothetical Django backend.
    // In a real application, replace these with actual `fetch` calls to your Django endpoints.
    // For this example, we use a simple in-memory object to simulate user and note storage.

    const simulateBackend = {
        users: {}, // Stores user data: {username: {password: "...", token: "...", notes: []}}
        generateToken: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
    };

    // Initialize a dummy user for quick testing if no users exist
    if (Object.keys(simulateBackend.users).length === 0) {
        simulateBackend.users['testuser'] = {
            password: 'password',
            token: simulateBackend.generateToken(),
            notes: [
                { id: 1, title: 'My First Note', content: 'This is an example note content for testuser.', userId: 'testuser' },
                { id: 2, title: 'Ideas for React App', content: 'Implement dark mode. Add note editing feature. Improve UI responsiveness.', userId: 'testuser' },
            ]
        };
        console.log("Simulated 'testuser' created. Use username: testuser, password: password to login.");
    }

    /**
     * Simulates a login API call.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{token: string, username: string}>}
     */
    const fetchLogin = async (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                if (simulateBackend.users[username] && simulateBackend.users[username].password === password) {
                    resolve({ token: simulateBackend.users[username].token, username: username });
                } else {
                    reject({ message: 'Invalid username or password' });
                }
            }, 500);
        });
    };

    /**
     * Simulates a signup API call.
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{token: string, username: string}>}
     */
    const fetchSignup = async (username, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                if (simulateBackend.users[username]) {
                    reject({ message: 'Username already taken' });
                } else {
                    const newToken = simulateBackend.generateToken();
                    simulateBackend.users[username] = { password, token: newToken, notes: [] };
                    resolve({ token: newToken, username: username });
                }
            }, 500);
        });
    };

    /**
     * Simulates fetching notes for a logged-in user.
     * @param {string} token
     * @param {string} user
     * @returns {Promise<Array<{id: number, title: string, content: string, userId: string}>>}
     */
    const fetchNotes = async (token, user) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                if (simulateBackend.users[user] && simulateBackend.users[user].token === token) {
                    resolve(simulateBackend.users[user].notes);
                } else {
                    reject({ message: 'Authentication failed or user not found' });
                }
            }, 500);
        });
    };

    /**
     * Simulates adding a new note for a user.
     * @param {string} token
     * @param {string} user
     * @param {string} title
     * @param {string} content
     * @returns {Promise<{id: number, title: string, content: string, userId: string}>}
     */
    const fetchAddNote = async (token, user, title, content) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                if (simulateBackend.users[user] && simulateBackend.users[user].token === token) {
                    const currentNotes = simulateBackend.users[user].notes;
                    const newId = currentNotes.length > 0 ? Math.max(...currentNotes.map(n => n.id)) + 1 : 1;
                    const newNote = { id: newId, title, content, userId: user };
                    simulateBackend.users[user].notes.push(newNote);
                    resolve(newNote);
                } else {
                    reject({ message: 'Authentication failed or user not found' });
                }
            }, 500);
        });
    };

    // --- Event Handlers ---

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');
        try {
            const data = await fetchLogin(loginUsername, loginPassword);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            setAuthToken(data.token);
            setUsername(data.username);
            showMessage('Login successful!', 'success');
            navigateTo('dashboard');
            // Log the login event using the global function
            window.saveData({ action: "login", user: data.username, timestamp: Date.now() });
        } catch (error) {
            showMessage(error.message || 'Login failed', 'error');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage('Signing up...');
        try {
            const data = await fetchSignup(signupUsername, signupPassword);
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('username', data.username);
            setAuthToken(data.token);
            setUsername(data.username);
            showMessage('Signup successful! Redirecting to dashboard...', 'success');
            navigateTo('dashboard');
            // Log the signup event using the global function
            window.saveData({ action: "signup", user: data.username, timestamp: Date.now() });
        } catch (error) {
            showMessage(error.message || 'Signup failed', 'error');
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteTitle.trim() || !newNoteContent.trim()) {
            showMessage('Note title and content cannot be empty.', 'error');
            return;
        }
        setMessage('Adding note...');
        try {
            const newNote = await fetchAddNote(authToken, username, newNoteTitle, newNoteContent);
            setNotes([...notes, newNote]); // Update local notes state
            setNewNoteTitle('');
            setNewNoteContent('');
            showMessage('Note added successfully!', 'success');
            // Log the add note event using the global function
            window.saveData({ action: "add_note", user: username, note_id: newNote.id, note_title: newNote.title, timestamp: Date.now() });
        } catch (error) {
            showMessage(error.message || 'Failed to add note.', 'error');
        }
    };

    // --- React Effects ---

    // Effect to check for existing auth token in localStorage on component mount
    React.useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUsername = localStorage.getItem('username');

        if (storedToken && storedUsername) {
            setAuthToken(storedToken);
            setUsername(storedUsername);
            navigateTo('dashboard'); // If already authenticated, go to dashboard
            window.saveData({ action: "app_initialized_authenticated", user: storedUsername, timestamp: Date.now() });
        } else {
            navigateTo('login'); // Otherwise, show login page
            window.saveData({ action: "app_initialized_unauthenticated", timestamp: Date.now() });
        }

        // Load global log data from the database using window.loadData
        window.loadData()
            .then(data => {
                console.log("Global application log data loaded:", data);
                // Sort by created_at descending to show most recent first
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setGlobalLog(sortedData);
            })
            .catch(error => {
                console.error("Error loading global data via window.loadData:", error);
            });

    }, []); // Empty dependency array means this runs only once on mount

    // Effect to load notes when the user is authenticated and on 'view-notes' or 'dashboard' page
    React.useEffect(() => {
        if (authToken && username && (currentPage === 'view-notes' || currentPage === 'dashboard')) {
            setMessage('Loading notes...');
            fetchNotes(authToken, username)
                .then(userNotes => {
                    setNotes(userNotes);
                    setMessage(''); // Clear message after loading
                })
                .catch(error => {
                    showMessage(error.message || 'Failed to load notes.', 'error');
                    setNotes([]); // Clear notes on error
                });
        }
    }, [authToken, username, currentPage]); // Re-run when auth state or current page changes

    // --- Render Functions for Each Page ---

    const renderLoginPage = () => (
        <div style={styles.container}>
            <h2>Login to Personal Notes</h2>
            {message}
            <form onSubmit={handleLogin} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={loginUsername}
                        onChange={(e) => setLoginUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={{ ...styles.button, backgroundColor: '#007bff' }}>Login</button>
            </form>
            <p style={styles.linkText}>Don't have an account? <a href="#" onClick={() => navigateTo('signup')} style={styles.link}>Sign Up</a></p>
        </div>
    );

    const renderSignupPage = () => (
        <div style={styles.container}>
            <h2>Sign Up for Personal Notes</h2>
            {message}
            <form onSubmit={handleSignup} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={signupUsername}
                        onChange={(e) => setSignupUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={{ ...styles.button, backgroundColor: '#28a745' }}>Sign Up</button>
            </form>
            <p style={styles.linkText}>Already have an account? <a href="#" onClick={() => navigateTo('login')} style={styles.link}>Login</a></p>
        </div>
    );

    const renderDashboard = () => (
        <div style={{ ...styles.container, maxWidth: '800px' }}>
            <h2>Welcome, {username}!</h2>
            {message}
            <nav style={styles.navbar}>
                <button onClick={() => navigateTo('add-note')} style={{ ...styles.navButton, backgroundColor: '#17a2b8' }}>Add New Note</button>
                <button onClick={() => navigateTo('view-notes')} style={{ ...styles.navButton, backgroundColor: '#6c757d' }}>View My Notes ({notes.length})</button>
                <button onClick={clearAuth} style={{ ...styles.navButton, backgroundColor: '#dc3545' }}>Logout</button>
            </nav>

            <h3 style={styles.sectionTitle}>Recent Notes</h3>
            {notes.length === 0 ? (
                <p>No notes yet. <a href="#" onClick={() => navigateTo('add-note')} style={styles.link}>Add your first note!</a></p>
            ) : (
                <ul style={styles.noteList}>
                    {notes.slice(0, 3).map(note => ( // Show up to 3 recent notes
                        <li key={note.id} style={styles.noteListItem}>
                            <h4>{note.title}</h4>
                            <p>{note.content.substring(0, 150)}{note.content.length > 150 ? '...' : ''}</p>
                        </li>
                    ))}
                </ul>
            )}
            {notes.length > 3 && (
                <p style={styles.linkText}><a href="#" onClick={() => navigateTo('view-notes')} style={styles.link}>View all {notes.length} notes &rarr;</a></p>
            )}
        </div>
    );

    const renderAddNotePage = () => (
        <div style={{ ...styles.container, maxWidth: '600px' }}>
            <h2>Add New Note</h2>
            {message}
            <form onSubmit={handleAddNote} style={styles.form}>
                <div style={styles.formGroup}>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label>Content:</label>
                    <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        rows="8"
                        required
                        style={{ ...styles.input, resize: 'vertical' }}
                    ></textarea>
                </div>
                <button type="submit" style={{ ...styles.button, backgroundColor: '#17a2b8' }}>Save Note</button>
                <button type="button" onClick={() => navigateTo('dashboard')} style={{ ...styles.button, marginLeft: '10px', backgroundColor: '#6c757d' }}>Cancel</button>
            </form>
        </div>
    );

    const renderViewNotesPage = () => (
        <div style={{ ...styles.container, maxWidth: '800px' }}>
            <h2>My Notes ({notes.length})</h2>
            {message}
            <button onClick={() => navigateTo('dashboard')} style={{ ...styles.button, backgroundColor: '#6c757d', marginBottom: '20px' }}>Back to Dashboard</button>

            {notes.length === 0 ? (
                <p>You haven't added any notes yet. <a href="#" onClick={() => navigateTo('add-note')} style={styles.link}>Add your first note!</a></p>
            ) : (
                <ul style={styles.noteList}>
                    {notes.map(note => (
                        <li key={note.id} style={{ ...styles.noteListItem, borderBottom: '1px solid #eee' }}>
                            <h3>{note.title}</h3>
                            <p>{note.content}</p>
                            {/* In a real app, you might add edit/delete buttons here */}
                        </li>
                    ))}
                </ul>
            )}

            {/* Global log display - for demonstrating window.loadData / window.saveData */}
            <h3 style={styles.sectionTitle}>Application Activity Log (from window.loadData)</h3>
            <div style={styles.globalLogBox}>
                {globalLog.length === 0 ? (
                    <p>No global log entries yet.</p>
                ) : (
                    <ul style={styles.globalLogList}>
                        {globalLog.map((entry, index) => (
                            <li key={index} style={styles.globalLogListItem}>
                                <pre style={styles.globalLogPre}>{JSON.stringify(entry.payload, null, 2)}</pre>
                                <span style={styles.globalLogDate}>{new Date(entry.created_at).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );

    // --- Main Render Logic ---
    // This determines which page component to render based on the current state.
    if (!authToken) {
        // Not authenticated
        if (currentPage === 'signup') {
            return renderSignupPage();
        }
        return renderLoginPage(); // Default to login if not authenticated
    } else {
        // Authenticated
        switch (currentPage) {
            case 'add-note':
                return renderAddNotePage();
            case 'view-notes':
                return renderViewNotesPage();
            case 'dashboard':
            default: // Default to dashboard for any other authenticated page request
                return renderDashboard();
        }
    }
}


// --- Inline Styles (for simplicity, typically would be in a CSS file or styled-components) ---
const styles = {
    container: {
        maxWidth: '500px',
        margin: '50px auto',
        padding: '25px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box',
        fontSize: '16px',
    },
    button: {
        padding: '12px 20px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.2s ease',
        minWidth: '100px',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    navButton: {
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s ease',
    },
    sectionTitle: {
        borderBottom: '1px solid #eee',
        paddingBottom: '10px',
        marginBottom: '20px',
        color: '#333',
    },
    noteList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    noteListItem: {
        background: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
    },
    linkText: {
        marginTop: '20px',
        textAlign: 'center',
        color: '#555',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    globalLogBox: {
        maxHeight: '250px',
        overflowY: 'auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#fdfdfd',
        marginTop: '20px',
    },
    globalLogList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },
    globalLogListItem: {
        borderBottom: '1px dotted #e9e9e9',
        paddingBottom: '10px',
        marginBottom: '10px',
        fontSize: '0.9em',
        color: '#555',
    },
    globalLogPre: {
        margin: '0 0 5px 0',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        backgroundColor: '#f2f2f2',
        padding: '8px',
        borderRadius: '4px',
    },
    globalLogDate: {
        display: 'block',
        fontSize: '0.8em',
        color: '#888',
        textAlign: 'right',
    }
};

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
