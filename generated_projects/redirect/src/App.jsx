import React from "react";
import "./App.css";

function GeneratedApp() {
  const [page, setPage] = React.useState("home");
  const [username, setUsername] = React.useState(null);
  const [dataInput, setDataInput] = React.useState("");
  const [savedData, setSavedData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check for login status from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setPage("dashboard"); // Automatically navigate to dashboard if logged in
    }

    // Load historical data from the database
    window.loadData()
      .then(data => {
        // Assuming each item in data array has a 'payload' property
        const parsedData = data.map(item => item.payload);
        setSavedData(parsedData);
      })
      .catch(error => console.error("Error loading data:", error))
      .finally(() => setIsLoading(false));
  }, []); // Empty dependency array means this effect runs once on mount

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    if (dataInput) {
      localStorage.setItem("username", dataInput);
      setUsername(dataInput);
      setDataInput(""); // Clear the input field
      setPage("dashboard");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    setPage("home");
  };

  const handleAddData = () => {
    if (dataInput) {
      const newDataItem = { text: dataInput, username: username, timestamp: Date.now() };
      window.saveData(newDataItem)
        .then(() => {
          setSavedData(prevData => [...prevData, newDataItem]); // Optimistically update UI
          setDataInput(""); // Clear input field
          setPage("viewData"); // Navigate to view data after successful save
        })
        .catch(error => console.error("Error saving data:", error));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Conditional rendering based on the 'page' state
  let content;
  if (page === "home") {
    content = (
      <div>
        <h1>Home Page</h1>
        <button onClick={() => setPage("login")}>Login</button>
        <button onClick={() => setPage("viewData")}>View Data</button>
      </div>
    );
  } else if (page === "login") {
    // If already logged in, redirect to dashboard
    if (username) {
      setPage("dashboard");
      return null; // Render nothing temporarily while redirecting
    }
    content = (
      <div>
        <h1>Login Page</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter Username"
            value={dataInput}
            onChange={(e) => setDataInput(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={() => setPage("home")}>Back to Home</button>
      </div>
    );
  } else if (page === "dashboard") {
    // If not logged in, redirect to home
    if (!username) {
      setPage("home");
      return null; // Render nothing temporarily while redirecting
    }
    content = (
      <div>
        <h1>Welcome, {username}!</h1>
        <h2>Dashboard Page</h2>
        <button onClick={() => setPage("addData")}>Add Data</button>
        <button onClick={() => setPage("viewData")}>View Data</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  } else if (page === "addData") {
    // Must be logged in to add data
    if (!username) {
      setPage("home");
      return null;
    }
    content = (
      <div>
        <h1>Add Data Page</h1>
        <input
          type="text"
          placeholder="Enter data to save"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
        />
        <button onClick={handleAddData}>Save Data</button>
        <button onClick={() => setPage("dashboard")}>Back to Dashboard</button>
      </div>
    );
  } else if (page === "viewData") {
    content = (
      <div>
        <h1>View Data Page</h1>
        <h2>Stored Data:</h2>
        {savedData.length === 0 ? (
          <p>No data stored yet.</p>
        ) : (
          <ul>
            {savedData.map((item, index) => (
              <li key={index}>
                "{item.text}" by {item.username || "Unknown"} at {new Date(item.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
        {username ? (
          <button onClick={() => setPage("dashboard")}>Back to Dashboard</button>
        ) : (
          <button onClick={() => setPage("home")}>Back to Home</button>
        )}
      </div>
    );
  } else {
    // Fallback for an unknown page state
    content = <div>Page Not Found</div>;
  }

  return content;
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
