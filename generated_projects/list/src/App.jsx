import "./App.css";

function GeneratedApp() {
  // Strict Rule: Must use React.useState
  const [searchTerm, setSearchTerm] = React.useState('');
  // Simple hardcoded list of items
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
  ];
  // Filter items based on the search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Handle input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Strict Rule: Must return JSX
  return (
    <div>
      <h1>Fruit Search Filter</h1>
      <input
        type="text"
        placeholder="Search fruits..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '8px', fontSize: '16px', width: '250px' }}
      />
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <li key={item.id} style={{ padding: '5px 0', borderBottom: '1px solid #eee' }}>
              {item.name}
            </li>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div className="project-shell">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Frost Glass</span>
          <h1>Frost Glass</h1>
          <p>A cool, glassy look with gentle ice-blue accents.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
