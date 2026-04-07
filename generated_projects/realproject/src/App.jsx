import React from "react";
import "./App.css";

function GeneratedApp() {
    const [page, setPage] = React.useState("home");
    const [username, setUsername] = React.useState("");
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [loginInput, setLoginInput] = React.useState("");

    const [localDataInput, setLocalDataInput] = React.useState("");
    const [localEntries, setLocalEntries] = React.useState([]); // Client-side data, stored in localStorage

    const [dbEntries, setDbEntries] = React.useState([]); // Data loaded from the global database

    const LS_USERNAME_KEY = "appUsername";
    const LS_LOCAL_DATA_KEY = "appLocalData";

    React.useEffect(() => {
        const storedUsername = localStorage.getItem(LS_USERNAME_KEY);
        if (storedUsername) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
            setPage("dashboard");
        } else {
            setPage("home");
        }

        const storedLocalData = localStorage.getItem(LS_LOCAL_DATA_KEY);
        if (storedLocalData) {
            try {
                setLocalEntries(JSON.parse(storedLocalData));
            } catch (e) {
                console.error("Failed to parse local data from localStorage", e);
                localStorage.removeItem(LS_LOCAL_DATA_KEY);
            }
        }

        const loadDbData = () => {
            window.loadData()
                .then(data => {
                    const formattedData = data.map(entry => ({
                        ...entry.payload,
                        db_id: entry.id,
                        created_at: entry.created_at,
                        source: "database"
                    }));
                    setDbEntries(formattedData);
                })
                .catch(error => console.error("Error loading data from database:", error));
        };

        loadDbData(); // Initial load of database data

        // Optionally, return a cleanup function if needed, but not for this case.
    }, []); // Run only once on mount

    React.useEffect(() => {
        localStorage.setItem(LS_LOCAL_DATA_KEY, JSON.stringify(localEntries));
    }, [localEntries]);

    const handleLogin = () => {
        if (loginInput.trim()) {
            localStorage.setItem(LS_USERNAME_KEY, loginInput.trim());
            setUsername(loginInput.trim());
            setIsLoggedIn(true);
            setLoginInput("");
            setPage("dashboard");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(LS_USERNAME_KEY);
        localStorage.removeItem(LS_LOCAL_DATA_KEY);
        setUsername("");
        setIsLoggedIn(false);
        setLocalEntries([]);
        setPage("home");
    };

    const handleAddLocalData = () => {
        if (localDataInput.trim()) {
            const newEntry = {
                id: Date.now(),
                text: localDataInput.trim(),
                source: "localStorage",
                user: username
            };
            setLocalEntries(prevEntries => [...prevEntries, newEntry]);
            setLocalDataInput("");

            window.saveData({
                dataType: "user_input",
                value: newEntry.text,
                timestamp: Date.now(),
                user: username
            })
            .then(() => {
                // Re-fetch database data to include the newly saved item
                window.loadData().then(data => {
                    const formattedData = data.map(entry => ({
                        ...entry.payload,
                        db_id: entry.id,
                        created_at: entry.created_at,
                        source: "database"
                    }));
                    setDbEntries(formattedData);
                });
            })
            .catch(error => console.error("Error saving data to database:", error));
        }
    };

    const renderPage = () => {
        switch (page) {
            case "home":
                return (
                    <section style={{ padding: '20px', textAlign: 'center' }}>
                        <h1>Welcome</h1>
                        <p>Use the navigation links to move around.</p>
                    </section>
                );
            case "login":
                return (
                    <section style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
                        <h2>Login</h2>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={loginInput}
                            onChange={(e) => setLoginInput(e.target.value)}
                            style={{ width: 'calc(100% - 22px)', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '3px' }}
                        />
                        <button onClick={handleLogin} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Login</button>
                    </section>
                );
            case "dashboard":
                return (
                    <section style={{ padding: '20px', textAlign: 'center' }}>
                        <h2>Dashboard</h2>
                        {isLoggedIn ? (
                            <p>Hello, {username}!</p>
                        ) : (
                            <p>Please log in to view your dashboard.</p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => setPage("add-data")} style={{ padding: '10px 20px', cursor: 'pointer' }}>Add Data</button>
                            <button onClick={() => setPage("view-data")} style={{ padding: '10px 20px', cursor: 'pointer' }}>View Data</button>
                        </div>
                    </section>
                );
            case "add-data":
                return (
                    <section style={{ padding: '20px', maxWidth: '600px', margin: 'auto', border: '1px solid #eee', borderRadius: '5px' }}>
                        <h2>Add New Data</h2>
                        {isLoggedIn ? (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter data"
                                    value={localDataInput}
                                    onChange={(e) => setLocalDataInput(e.target.value)}
                                    style={{ width: 'calc(100% - 22px)', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '3px' }}
                                />
                                <button onClick={handleAddLocalData} style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Save Data</button>
                                <p style={{ marginTop: '20px' }}>Recent entries:</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {[...localEntries, ...dbEntries].slice(-5).reverse().map((entry, index) => (
                                        <li key={`${entry.id || entry.db_id || `temp-${index}`}`} style={{ padding: '8px 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span>{entry.text || entry.value}</span>
                                            <span style={{ fontSize: '0.8em', color: '#666' }}>{entry.source}</span>
                                        </li>
                                    ))}
                                    {([localEntries, ...dbEntries].length === 0) && <li>No entries yet.</li>}
                                </ul>
                            </>
                        ) : (
                            <p>Please log in to add data.</p>
                        )}
                    </section>
                );
            case "view-data":
                const allData = [...localEntries, ...dbEntries];
                const displayData = allData.length > 0
                    ? allData.map((item, index) => (
                        <li key={`${item.id || item.db_id || `temp-${index}`}`} style={{ padding: '8px 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{item.text || item.value}</span>
                            <span style={{ fontSize: '0.8em', color: '#666' }}>
                                {item.source ? `(${item.source})` : ''}
                                {item.user && ` - ${item.user}`}
                                {item.created_at && ` - ${new Date(item.created_at).toLocaleString()}`}
                            </span>
                        </li>
                    ))
                    : <li>No data entries found.</li>;

                return (
                    <section style={{ padding: '20px', maxWidth: '800px', margin: 'auto', border: '1px solid #eee', borderRadius: '5px' }}>
                        <h2>View All Data</h2>
                        {isLoggedIn ? (
                            <>
                                <p>This includes all data from your current session and previously saved data.</p>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {displayData}
                                </ul>
                            </>
                        ) : (
                            <p>Please log in to view data.</p>
                        )}
                    </section>
                );
            default:
                return (
                    <section style={{ padding: '20px', textAlign: 'center' }}>
                        <h1>Page Not Found</h1>
                        <button onClick={() => setPage("home")} style={{ padding: '10px 20px', margin: '10px', cursor: 'pointer' }}>Go Home</button>
                    </section>
                );
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#f4f4f4', color: '#333' }}>
            <header style={{ backgroundColor: '#333', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                <nav>
                    <button onClick={() => setPage("home")} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1em', cursor: 'pointer', marginRight: '15px' }}>Home</button>
                    {!isLoggedIn && (
                        <button onClick={() => setPage("login")} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1em', cursor: 'pointer', marginRight: '15px' }}>Login</button>
                    )}
                    {isLoggedIn && (
                        <>
                            <button onClick={() => setPage("dashboard")} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1em', cursor: 'pointer', marginRight: '15px' }}>Dashboard</button>
                            <button onClick={() => setPage("add-data")} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1em', cursor: 'pointer', marginRight: '15px' }}>Add Data</button>
                            <button onClick={() => setPage("view-data")} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1em', cursor: 'pointer' }}>View Data</button>
                        </>
                    )}
                </nav>
                {isLoggedIn && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '15px' }}>User: <strong>{username}</strong></span>
                        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Logout</button>
                    </div>
                )}
            </header>

            <main style={{ flexGrow: 1, padding: '20px' }}>
                {renderPage()}
            </main>

            <footer style={{ backgroundColor: '#333', color: 'white', textAlign: 'center', padding: '15px 20px', marginTop: 'auto', boxShadow: '0 -2px 5px rgba(0,0,0,0.2)' }}>
                <p>&copy; {new Date().getFullYear()} App</p>
            </footer>
        </div>
    );
}

function App() {
  return (
    <div className="project-shell theme-royal-gold">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Royal Gold</span>
          <h1>Imperial Essence</h1>
          <p>Sophisticated cream and gold for a premium, timeless feel.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
