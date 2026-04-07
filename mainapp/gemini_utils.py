import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY_HERE")

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_text(prompt):
    return model.generate_content(prompt).text

def generate_react_app(prompt):
    base_prompt = """
Create a React component named App.

STRICT RULES:
- Must use: function App()
- Must return JSX
- No import
- No export
- No ReactDOM.render
- Use React.useState if needed
- Keep it simple and valid

DATABASE SYNC FEATURE:
- You have access to global functions: `window.saveData(payload)` and `window.loadData()`. 
- `payload` should be a JSON object. Calls to `window.saveData` will persist data to the Django database for this project.
- `window.loadData()` returns a Promise that resolves to an array of objects [ {payload: {...}, created_at: "..."} ] from the database.
- Use `useEffect` to call `window.loadData()` on mount if your app needs to display historical data.
- Example: `onClick={() => window.saveData({ "action": "click", "time": Date.now() })}`
- Example: `useEffect(() => { window.loadData().then(data => setHistory(data)); }, [])`

App Objective:
"""
    return generate_text(base_prompt + prompt)

def generate_image(prompt):
    return "Image generation not implemented"