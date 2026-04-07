```jsx
function App() {
  // Use React.useState for the counter state.
  // making React.useState accessible directly.
  const [count, setCount] = React.useState(0);

  // Function to handle incrementing the count
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  // Function to handle decrementing the count
  const decrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  // Return JSX for the counter interface
  return (
    <div>
      <h1>Simple Counter</h1>
      <p>Current Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}
```