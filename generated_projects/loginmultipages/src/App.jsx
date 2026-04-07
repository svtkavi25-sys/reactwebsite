import React from "react";
import "./App.css";

### FRONTEND (React App.js)
function GeneratedApp() {
  const [currentPage, setCurrentPage] = React.useState('login');
  const [user, setUser] = React.useState(null);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [notes, setNotes] = React.useState([]);
  const [message, setMessage] = React.useState('');

  // Check for session on mount
  React.useEffect(() => {
    const loggedInUser = localStorage.getItem('notes_user');
    if (loggedInUser) {
      setUser(loggedInUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        localStorage.setItem('notes_user', username);
        setUser(username);
        setCurrentPage('dashboard');
        window.saveData({ action: 'login', user: username, timestamp: Date.now() });
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setMessage('Account created! Please login.');
        setCurrentPage('login');
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/add-data/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: noteContent }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        window.saveData({ action: 'add_note', content: noteContent });
        setNoteContent('');
        alert('Note added successfully!');
      }
    } catch (err) {
      alert('Error adding note');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/get-data/?username=${user}`);
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Error fetching notes');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('notes_user');
    setUser(null);
    setUsername('');
    setPassword('');
    setCurrentPage('login');
  };

  // UI Components
  const styles = {
    container: { fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' },
    nav: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' },
    button: { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' },
    input: { display: 'block', width: '90%', padding: '10px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' },
    noteItem: { backgroundColor: 'white', padding: '10px', margin: '10px 0', borderLeft: '5px solid #007bff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center' }}>NoteManager Pro</h1>
      
      {user && (
        <div style={styles.nav}>
          <button style={styles.button} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
          <button style={styles.button} onClick={() => setCurrentPage('addNotes')}>Add Notes</button>
          <button style={styles.button} onClick={() => { setCurrentPage('viewNotes'); fetchNotes(); }}>View Notes</button>
          <button style={{ ...styles.button, backgroundColor: '#dc3545' }} onClick={handleLogout}>Logout</button>
        </div>
      )}

      {currentPage === 'login' && !user && (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input style={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button style={styles.button} type="submit">Login</button>
          </form>
          <p>{message}</p>
          <p onClick={() => setCurrentPage('signup')} style={{ cursor: 'pointer', color: 'blue' }}>Don't have an account? Signup</p>
        </div>
      )}

      {currentPage === 'signup' && (
        <div>
          <h2>Signup</h2>
          <form onSubmit={handleSignup}>
            <input style={styles.input} type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button style={styles.button} type="submit">Register</button>
          </form>
          <p>{message}</p>
          <p onClick={() => setCurrentPage('login')} style={{ cursor: 'pointer', color: 'blue' }}>Already have an account? Login</p>
        </div>
      )}

      {currentPage === 'dashboard' && user && (
        <div>
          <h2>Welcome, {user}!</h2>
          <p>This is your personal secure space for managing thoughts and notes.</p>
          <div style={{ padding: '20px', background: '#e9ecef', borderRadius: '5px' }}>
            <h4>Quick Stats:</h4>
            <ul>
              <li>Status: Online</li>
              <li>Logged in as: {user}</li>
            </ul>
          </div>
        </div>
      )}

      {currentPage === 'addNotes' && user && (
        <div>
          <h2>Add New Note</h2>
          <textarea 
            style={{ ...styles.input, height: '100px' }} 
            placeholder="Write your note here..." 
            value={noteContent} 
            onChange={(e) => setNoteContent(e.target.value)} 
          />
          <button style={styles.button} onClick={handleAddNote}>Save Note</button>
        </div>
      )}

      {currentPage === 'viewNotes' && user && (
        <div>
          <h2>Your Notes</h2>
          {notes.length === 0 ? <p>No notes found.</p> : notes.map((n, i) => (
            <div key={i} style={styles.noteItem}>
              {n.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
---

### BACKEND (Django)

**models.py**
```python
from django.db import models

class UserProfile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username

class Note(models.Model):
    username = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.username}"
**views.py**
```python
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import UserProfile, Note

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if UserProfile.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'User already exists'})
        
        user = UserProfile(username=username, password=password)
        user.save()
        return JsonResponse({'status': 'success', 'message': 'User created'})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = UserProfile.objects.get(username=username, password=password)
            return JsonResponse({'status': 'success', 'username': user.username})
        except UserProfile.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'})

@csrf_exempt
def add_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        content = data.get('content')
        
        note = Note(username=username, content=content)
        note.save()
        return JsonResponse({'status': 'success'})

def get_data(request):
    username = request.GET.get('username')
    notes = Note.objects.filter(username=username).values('content', 'created_at').order_by('-created_at')
    return JsonResponse({'status': 'success', 'notes': list(notes)})
**urls.py**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('add-data/', views.add_data, name='add_data'),
    path('get-data/', views.get_data, name='get_data'),
]
### DATABASE SETUP
1. Ensure `corsheaders` is added to `INSTALLED_APPS` and `MIDDLEWARE` in `settings.py` to allow React to communicate with Django if they are on different ports.
2. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate

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
