import React from "react";
import "./App.css";

function GeneratedApp() {
    // State management
    const [user, setUser] = React.useState(null); // Stores current logged-in username
    const [currentPage, setCurrentPage] = React.useState('login'); // 'login', 'dashboard', 'addNote', 'viewNote'
    const [allNotes, setAllNotes] = React.useState([]); // Stores all notes fetched from DB
    const [selectedNoteId, setSelectedNoteId] = React.useState(null); // ID of the note being viewed

    // Helper for generating simple unique IDs
    const generateId = () => Math.random().toString(36).substr(2, 9);

    // Effect to check for stored session and load data on component mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setUser(storedUser);
            setCurrentPage('dashboard');
            // Load notes immediately if a user is logged in
            loadUserNotes(storedUser);
        }
    }, []); // Run once on mount

    // Function to load notes from the database for the current user
    const loadUserNotes = (currentUser) => {
        window.loadData()
            .then(dbData => {
                // Filter notes for the current user from all fetched data
                // We assume payload has a 'type: "note"' to distinguish notes from other potential data
                const userSpecificNotes = dbData
                    .filter(item => item.payload && item.payload.userId === currentUser && item.payload.type === 'note')
                    .map(item => ({
                        id: item.payload.id,
                        userId: item.payload.userId,
                        title: item.payload.title,
                        content: item.payload.content,
                        created_at: item.created_at // Keep original timestamp from DB
                    }));
                setAllNotes(userSpecificNotes);
            })
            .catch(error => {
                console.error("Failed to load notes:", error);
                // In a real app, you might show a user-friendly error message
            });
    };

    // Navigation handlers
    const goToDashboard = () => {
        setCurrentPage('dashboard');
        if (user) {
            loadUserNotes(user); // Reload notes when returning to dashboard
        }
    };
    const goToAddNote = () => setCurrentPage('addNote');
    const goToViewNote = (noteId) => {
        setSelectedNoteId(noteId);
        setCurrentPage('viewNote');
    };
    const goToLogin = () => {
        setCurrentPage('login');
        setUser(null);
        localStorage.removeItem('currentUser'); // Clear session
        setAllNotes([]); // Clear notes on logout
        setSelectedNoteId(null);
    };

    // --- Login/Signup Page Component ---
    const LoginPage = () => {
        const [usernameInput, setUsernameInput] = React.useState('');
        const [passwordInput, setPasswordInput] = React.useState(''); // Password for concept, not validated in this demo

        const handleAuth = (isSignUp) => {
            if (!usernameInput.trim()) {
                alert('Username cannot be empty.');
                return;
            }

            // Simplified: Signup/Login just means setting the user.
            // A real application would involve backend API calls for authentication.
            setUser(usernameInput.trim());
            localStorage.setItem('currentUser', usernameInput.trim());
            goToDashboard();
            alert(`${isSignUp ? 'Signed up and ' : ''}Logged in as ${usernameInput.trim()}!`);
        };

        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Welcome to Personal Notes!</h2>
                <div style={styles.formGroup}>
                    <label htmlFor="username" style={styles.label}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your username"
                    />
                </div>
                {/* Password field included for demonstration of signup concept, not actively used for validation here */}
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password (optional for demo):</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        style={styles.input}
                        placeholder="Enter your password"
                    />
                </div>
                <div style={styles.buttonGroup}>
                    <button onClick={() => handleAuth(false)} style={styles.button}>Login</button>
                    <button onClick={() => handleAuth(true)} style={styles.button}>Signup</button>
                </div>
            </div>
        );
    };

    // --- Dashboard Page Component ---
    const DashboardPage = () => {
        const userNotes = allNotes.filter(note => note.userId === user);

        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Dashboard - Welcome, {user}!</h2>
                <div style={styles.buttonGroup}>
                    <button onClick={goToAddNote} style={styles.button}>Add New Note</button>
                    <button onClick={goToLogin} style={styles.buttonSecondary}>Logout</button>
                </div>
                <h3 style={styles.subHeading}>Your Notes:</h3>
                {userNotes.length === 0 ? (
                    <p>You don't have any notes yet. Click "Add New Note" to create one!</p>
                ) : (
                    <ul style={styles.noteList}>
                        {userNotes.map(note => (
                            <li key={note.id} style={styles.noteListItem}>
                                <a href="#" onClick={() => goToViewNote(note.id)} style={styles.noteLink}>
                                    {note.title}
                                </a>
                                <span style={styles.noteTimestamp}> (Created: {new Date(note.created_at).toLocaleString()})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    // --- Add Notes Page Component ---
    const AddNotePage = () => {
        const [title, setTitle] = React.useState('');
        const [content, setContent] = React.useState('');

        const handleSaveNote = () => {
            if (!title.trim() || !content.trim()) {
                alert('Title and Content cannot be empty.');
                return;
            }

            const newNoteId = generateId();
            const notePayload = {
                type: 'note', // Tag the payload type for filtering later
                id: newNoteId,
                userId: user,
                title: title.trim(),
                content: content.trim(),
            };

            window.saveData(notePayload)
                .then(() => {
                    alert('Note saved successfully!');
                    goToDashboard(); // Go back to dashboard and reload notes
                })
                .catch(error => {
                    console.error("Failed to save note:", error);
                    alert('Failed to save note. Please try again.');
                });
        };

        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>Add New Note</h2>
                <div style={styles.formGroup}>
                    <label htmlFor="noteTitle" style={styles.label}>Title:</label>
                    <input
                        type="text"
                        id="noteTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={styles.input}
                        placeholder="Enter note title"
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="noteContent" style={styles.label}>Content:</label>
                    <textarea
                        id="noteContent"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="10"
                        style={styles.textarea}
                        placeholder="Write your note content here..."
                    ></textarea>
                </div>
                <div style={styles.buttonGroup}>
                    <button onClick={handleSaveNote} style={styles.button}>Save Note</button>
                    <button onClick={goToDashboard} style={styles.buttonSecondary}>Back to Dashboard</button>
                </div>
            </div>
        );
    };

    // --- View Notes Page Component ---
    const ViewNotePage = () => {
        const note = allNotes.find(n => n.id === selectedNoteId);

        if (!note) {
            return (
                <div style={styles.container}>
                    <p>Note not found or an error occurred.</p>
                    <button onClick={goToDashboard} style={styles.buttonSecondary}>Back to Dashboard</button>
                </div>
            );
        }

        return (
            <div style={styles.container}>
                <h2 style={styles.heading}>View Note: {note.title}</h2>
                <p style={styles.noteContentDisplay}>{note.content}</p>
                <p style={styles.noteTimestamp}>Created: {new Date(note.created_at).toLocaleString()}</p>
                <button onClick={goToDashboard} style={styles.buttonSecondary}>Back to Dashboard</button>
            </div>
        );
    };

    // Main render logic based on currentPage state
    const renderPage = () => {
        // Ensure user is logged in for pages other than 'login'
        if (!user && currentPage !== 'login') {
            return <LoginPage />;
        }

        switch (currentPage) {
            case 'login':
                return <LoginPage />;
            case 'dashboard':
                return <DashboardPage />;
            case 'addNote':
                return <AddNotePage />;
            case 'viewNote':
                return <ViewNotePage />;
            default:
                return <LoginPage />; // Fallback to login
        }
    };

    // Inline styles for basic UI (can be moved to a separate const or CSS file in a larger app)
    const styles = {
        appContainer: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '20px auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
        },
        container: {
            padding: '10px 0',
        },
        heading: {
            color: '#333',
            textAlign: 'center',
            marginBottom: '20px',
        },
        subHeading: {
            color: '#555',
            marginTop: '30px',
            marginBottom: '15px',
        },
        formGroup: {
            marginBottom: '15px',
        },
        label: {
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold',
            color: '#666',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
        },
        textarea: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
            minHeight: '120px',
            resize: 'vertical',
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
        },
        buttonSecondary: {
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s ease',
        },
        noteList: {
            listStyle: 'none',
            padding: '0',
        },
        noteListItem: {
            backgroundColor: '#fff',
            border: '1px solid #eee',
            borderRadius: '5px',
            marginBottom: '10px',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '5px',
        },
        noteLink: {
            textDecoration: 'none',
            color: '#007bff',
            fontSize: '18px',
            fontWeight: 'bold',
        },
        noteContentDisplay: {
            backgroundColor: '#e9ecef',
            padding: '15px',
            borderRadius: '5px',
            whiteSpace: 'pre-wrap', // Preserves whitespace and line breaks
            border: '1px solid #ddd',
            width: '100%',
            boxSizing: 'border-box',
        },
        noteTimestamp: {
            fontSize: '0.8em',
            color: '#888',
        }
    };

    return (
        <div style={styles.appContainer}>
            {renderPage()}
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
