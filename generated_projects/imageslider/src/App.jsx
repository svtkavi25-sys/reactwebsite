import "./App.css";

function GeneratedApp() {
  // Define an array of image URLs
  const images = [
    'https://via.placeholder.com/400x250/FF5733/FFFFFF?text=Image+1',
    'https://via.placeholder.com/400x250/33FF57/FFFFFF?text=Image+2',
    'https://via.placeholder.com/400x250/3357FF/FFFFFF?text=Image+3',
    'https://via.placeholder.com/400x250/F533FF/FFFFFF?text=Image+4',
  ];
  // Use React.useState to manage the current image index
  // The first element is the current state value, the second is a function to update it.
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  // Function to navigate to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % images.length // Loop back to the first image if at the end
    );
  };
  // Function to navigate to the previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length // Loop to the last image if at the beginning
    );
  };
  // Return JSX to render the image slider
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      border: '1px solid #eee',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '450px',
      margin: '50px auto'
    }}>
      <h2>Image Slider</h2>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginTop: '20px'
      }}>
        {/* Previous Button */}
        <button
          onClick={prevImage}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            minWidth: '100px'
          }}
        >
          Previous
        </button>
        {/* Current Image */}
        <img
          src={images[currentImageIndex]}
          alt={`Slider Image ${currentImageIndex + 1}`}
          style={{
            width: '400px',
            height: '250px',
            objectFit: 'cover',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        />
        {/* Next Button */}
        <button
          onClick={nextImage}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            minWidth: '100px'
          }}
        >
          Next
        </button>
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
        Image {currentImageIndex + 1} of {images.length}
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="project-shell theme-midnight-glow">
      <div className="project-card">
        <div className="project-hero">
          <span className="project-badge">Midnight Glow</span>
          <h1>Midnight Glow</h1>
          <p>A bold, neon-infused interface with layered contrast.</p>
        </div>
        <div className="project-content">
          <GeneratedApp />
        </div>
      </div>
    </div>
  );
}

export default App;
