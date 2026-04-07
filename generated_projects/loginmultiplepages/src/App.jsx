import React from "react";
import "./App.css";

This is a complete implementation of a Personal Notes Manager using React (frontend) and Django (backend).

### 1. FRONTEND (React)
function GeneratedApp() {
  // State Management
  const [currentPage, setCurrentPage] = React.useState('login');
  const [user, setUser] = React.useState(localStorage.getItem('username') || null);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [noteContent, setNoteContent] = React.useState('');
  const [notes, setNotes] = React.useState([]);
  const [message, setMessage] = React.useState('');

  const API_BASE = 'http://127.0.0.1:8000/api';

  // Session Check
  React.useEffect(() => {
    if (user) {
      setCurrentPage('dashboard');
    }
  }, []);

  // Helper: API Calls
  const handleAuth = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.status === 'success') {
        if (endpoint === 'login') {
          localStorage.setItem('username', username);
          setUser(username);
          setCurrentPage('dashboard');
          window.saveData({ action: "login", user: username, timestamp: Date.now() });
        } else {
          setMessage('Signup successful! Please login.');
          setCurrentPage('login');
        }
      } else {
        setMessage(data.message || 'Error occurred');
      }
    } catch (err) {
      setMessage('Server error. Ensure Django is running.');
    }
  };

  const addNote = async () => {
    try {
      const response = await fetch(`${API_BASE}/add-data/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, content: noteContent }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setNoteContent('');
        setMessage('Note added!');
        window.saveData({ action: "add_note", user: user, content: noteContent });
      }
    } catch (err) {
      setMessage('Failed to add note');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE}/get-data/?username=${user}`);
      const data = await response.json();
      setNotes(data.notes || []);
      setCurrentPage('view-notes');
    } catch (err) {
      setMessage('Failed to fetch notes');
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    setUser(null);
    setCurrentPage('login');
    setUsername('');
    setPassword('');
    window.saveData({ action: "logout", timestamp: Date.now() });
  };

  // Styles
  const styles = {
    container: { fontFamily: 'Segoe UI, sans-serif', maxWidth: '600px', margin: '50px auto', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', backgroundColor: '#fff' },
    nav: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    btn: { padding: '8px 15px', cursor: 'pointer', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: 'white' },
    input: { display: 'block', width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ddd' },
    card: { padding: '10px', border: '1px solid #eee', margin: '10px 0', borderRadius: '8px', backgroundColor: '#f9f9f9' }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>📝 NoteManager Pro</h2>
      
      {/* Navigation */}
      <div style={styles.nav}>
        {!user ? (
          <>
            <button style={styles.btn} onClick={() => setCurrentPage('login')}>Login</button>
            <button style={styles.btn} onClick={() => setCurrentPage('signup')}>Signup</button>
          </>
        ) : (
          <>
            <button style={styles.btn} onClick={() => setCurrentPage('dashboard')}>Dashboard</button>
            <button style={styles.btn} onClick={() => setCurrentPage('add-notes')}>Add Note</button>
            <button style={styles.btn} onClick={fetchNotes}>View Notes</button>
            <button style={{ ...styles.btn, backgroundColor: '#dc3545' }} onClick={logout}>Logout</button>
          </>
        )}
      </div>

      {message && <p style={{ color: 'orange', textAlign: 'center' }}>{message}</p>}

      {/* Pages */}
      {currentPage === 'login' && (
        <div>
          <h3>Login</h3>
          <input style={styles.input} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button style={{ ...styles.btn, width: '100%' }} onClick={() => handleAuth('login')}>Enter Dashboard</button>
        </div>
      )}

      {currentPage === 'signup' && (
        <div>
          <h3>Create Account</h3>
          <input style={styles.input} placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button style={{ ...styles.btn, width: '100%' }} onClick={() => handleAuth('signup')}>Register</button>
        </div>
      )}

      {currentPage === 'dashboard' && (
        <div style={{ textAlign: 'center' }}>
          <h3>Welcome, {user}!</h3>
          <p>This is your personal notes space. Use the menu above to manage your data.</p>
        </div>
      )}

      {currentPage === 'add-notes' && (
        <div>
          <h3>Add New Note</h3>
          <textarea 
            style={{ ...styles.input, height: '100px' }} 
            placeholder="Write your note here..." 
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)} 
          />
          <button style={{ ...styles.btn, width: '100%' }} onClick={addNote}>Save Note</button>
        </div>
      )}

      {currentPage === 'view-notes' && (
        <div>
          <h3>Your Notes</h3>
          {notes.length === 0 ? <p>No notes found.</p> : notes.map((n, i) => (
            <div key={i} style={styles.card}>{n.content}</div>
          ))}
        </div>
      )}
    </div>
  );
}
---

### 2. BACKEND (Django)

#### **models.py**
```python
from django.db import models

class User(models.Model):
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
#### **views.py**
```python
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Note
import json

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'message': 'User already exists'}, status=400)
        
        User.objects.create(username=username, password=password)
        return JsonResponse({'status': 'success'})

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        try:
            user = User.objects.get(username=username, password=password)
            return JsonResponse({'status': 'success', 'username': user.username})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=401)

@csrf_exempt
def add_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        content = data.get('content')
        
        Note.objects.create(username=username, content=content)
        return JsonResponse({'status': 'success'})

def get_data(request):
    username = request.GET.get('username')
    notes = Note.objects.filter(username=username).values('content', 'created_at').order_by('-created_at')
    return JsonResponse({'status': 'success', 'notes': list(notes)})
#### **urls.py**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('api/signup/', views.signup),
    path('api/login/', views.login),
    path('api/add-data/', views.add_data),
    path('api/get-data/', views.get_data),
]
### 3. DATABASE SETUP (CLI)
To run the project, apply these commands in your Django project root:
```bash
python manage.py makemigrations
python manage.py migrate
*Note: Ensure you have `django-cors-headers` installed and added to your `INSTALLED_APPS` and `MIDDLEWARE` in `settings.py` to allow the React frontend to communicate with the Django backend.*

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
