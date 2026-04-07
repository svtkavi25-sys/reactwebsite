function App() {
  // State for the list of todos
  const [todos, setTodos] = React.useState([]);
  // State for the input field value when adding a new todo
  const [newTodoText, setNewTodoText] = React.useState('');
  // Function to add a new todo
  const addTodo = () => {
    if (newTodoText.trim() === '') {
      return; // Prevent adding empty todos
    }
    const newTodo = {
      id: Date.now(), // Simple unique ID using timestamp
      text: newTodoText,
      completed: false,
    };
    setTodos([...todos, newTodo]); // Add the new todo to the list
    setNewTodoText(''); // Clear the input field
  };
  // Function to delete a todo by its ID
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };
  // Function to toggle the completed status of a todo by its ID
  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>My Todo List</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          placeholder="Add a new todo"
          style={{ flexGrow: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginRight: '10px' }}
        />
        <button 
          onClick={addTodo}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Todo
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '10px', 
              borderBottom: '1px solid #eee', 
              backgroundColor: todo.completed ? '#f0f8ff' : 'white',
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#888' : '#333'
            }}
          >
            <span style={{ flexGrow: 1, marginRight: '10px' }}>{todo.text}</span>
            <button 
              onClick={() => toggleComplete(todo.id)}
              style={{ padding: '8px 12px', backgroundColor: todo.completed ? '#ffc107' : '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
            >
              {todo.completed ? 'Uncomplete' : 'Complete'}
            </button>
            <button 
              onClick={() => deleteTodo(todo.id)}
              style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}