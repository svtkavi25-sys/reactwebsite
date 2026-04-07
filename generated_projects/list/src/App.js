function App() {
  // Assume React is available globally, as per "No import" rule.
  // Example list of items
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
  ];
  // State to hold the current search term
  const [searchTerm, setSearchTerm] = React.useState('');
  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  // Filter items based on the search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Search Filter</h1>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '8px', fontSize: '16px', width: '300px', marginBottom: '20px' }}
      />
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredItems.map(item => (
          <li key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}