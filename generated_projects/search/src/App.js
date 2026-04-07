
function App() {
  // Use React.useState to manage the search input value
  const [searchTerm, setSearchTerm] = React.useState('');

  // A hardcoded list of items to filter
  const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Date' },
    { id: 5, name: 'Elderberry' },
    { id: 6, name: 'Fig' },
    { id: 7, name: 'Grape' },
    { id: 8, name: 'Honeydew' },
  ];

  // Filter the items based on the current search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Item Search Filter</h1>

      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '8px', width: '300px', marginBottom: '16px' }}
      />

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <li key={item.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
              {item.name}
            </li>
          ))
        ) : (
          <li>No items found matching "{searchTerm}"</li>
        )}
      </ul>
    </div>
  );
}
