import hashlib
import os
import re
import random
import json
from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .gemini_utils import generate_text, generate_react_app, generate_image
from .models import AIHistory, GeneratedProject, ProjectData


def choose_project_theme(seed_text=None):
    themes = [
        {
            "slug": "midnight-glow",
            "name": "Midnight Glow",
            "title": "Midnight Glow",
            "subtitle": "A bold, neon-infused interface with layered contrast.",
            "body_bg": "radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 20%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.18), transparent 18%), #080c14",
            "text_color": "#f0f9ff",
            "surface": "rgba(13, 19, 33, 0.95)",
            "surface_border": "rgba(56, 189, 248, 0.25)",
            "shadow": "0 28px 90px rgba(0,0,0,0.7), 0 0 20px rgba(56, 189, 248, 0.1)",
            "accent": "#38bdf8",
            "accent_alt": "#818cf8",
            "button_bg": "linear-gradient(135deg, #38bdf8, #818cf8)",
            "button_text": "#ffffff",
            "panel_bg": "rgba(15, 23, 42, 0.6)",
            "input_bg": "rgba(30, 41, 59, 0.5)",
            "font_family": "'Inter', sans-serif",
            "border_radius": "24px"
        },
        {
            "slug": "cyber-punk",
            "name": "Cyber Neon",
            "title": "Neon Genesis",
            "subtitle": "High-octane aesthetic with vibrant glowing elements.",
            "body_bg": "linear-gradient(45deg, #0f0c29, #302b63, #24243e)",
            "text_color": "#00ffcc",
            "surface": "rgba(10, 10, 15, 0.9)",
            "surface_border": "#ff00ff",
            "shadow": "0 0 30px rgba(255, 0, 255, 0.4), 10px 10px 0px rgba(0, 255, 204, 0.2)",
            "accent": "#ff00ff",
            "accent_alt": "#00ffff",
            "button_bg": "#ff00ff",
            "button_text": "#000000",
            "panel_bg": "rgba(0,0,0,0.8)",
            "input_bg": "#1a1a1a",
            "font_family": "'Space Grotesk', sans-serif",
            "border_radius": "4px"
        },
        {
            "slug": "royal-gold",
            "name": "Royal Gold",
            "title": "Imperial Essence",
            "subtitle": "Sophisticated cream and gold for a premium, timeless feel.",
            "body_bg": "#faf9f6",
            "text_color": "#1a1a1a",
            "surface": "#ffffff",
            "surface_border": "#d4af37",
            "shadow": "0 20px 50px rgba(0,0,0,0.08)",
            "accent": "#d4af37",
            "accent_alt": "#f1e5ac",
            "button_bg": "#1a1a1a",
            "button_text": "#d4af37",
            "panel_bg": "#fdfcf0",
            "input_bg": "#ffffff",
            "font_family": "'Playfair Display', serif",
            "border_radius": "0px"
        },
        {
            "slug": "deep-forest",
            "name": "Deep Forest",
            "title": "Woodland Serenity",
            "subtitle": "Grounded and organic with deep greenery and soft moss tones.",
            "body_bg": "linear-gradient(180deg, #064e3b 0%, #022c22 100%)",
            "text_color": "#ecfdf5",
            "surface": "rgba(6, 78, 59, 0.4)",
            "surface_border": "rgba(16, 185, 129, 0.3)",
            "shadow": "0 30px 60px rgba(0,0,0,0.5)",
            "accent": "#10b981",
            "accent_alt": "#34d399",
            "button_bg": "#059669",
            "button_text": "#ffffff",
            "panel_bg": "rgba(2, 44, 34, 0.8)",
            "input_bg": "rgba(255,255,255,0.05)",
            "font_family": "'Outfit', sans-serif",
            "border_radius": "32px"
        },
        {
            "slug": "glass-frost",
            "name": "Glass Frost",
            "title": "Arctic Glass",
            "subtitle": "Minimalist frosted glass aesthetic with subtle transparency.",
            "body_bg": "fixed linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "text_color": "#ffffff",
            "surface": "rgba(255, 255, 255, 0.1)",
            "surface_border": "rgba(255, 255, 255, 0.2)",
            "shadow": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            "accent": "#ffffff",
            "accent_alt": "rgba(255,255,255,0.5)",
            "button_bg": "rgba(255, 255, 255, 0.2)",
            "button_text": "#ffffff",
            "panel_bg": "rgba(255, 255, 255, 0.15)",
            "input_bg": "rgba(255, 255, 255, 0.05)",
            "font_family": "'Plus Jakarta Sans', sans-serif",
            "border_radius": "16px"
        }
    ]
    if seed_text:
        seed_text = seed_text.strip() or str(random.random())
        digest = hashlib.sha256(seed_text.encode("utf-8")).hexdigest()
        index = int(digest, 16) % len(themes)
        chosen = themes[index]
        return chosen
    return random.choice(themes)


def build_preview_html(theme, react_code, project_id=None):
    save_data_js = ""
    if project_id:
        save_data_js = f"""
        window.saveData = async (payload) => {{
            try {{
                const response = await fetch('/api/save_project_data/{project_id}/', {{
                    method: 'POST',
                    headers: {{ 'Content-Type': 'application/json' }},
                    body: JSON.stringify(payload)
                }});
                return await response.json();
            }} catch (err) {{
                console.error('Failed to save data:', err);
                return {{ status: 'error', message: err.message }};
            }}
        }};

        window.loadData = async () => {{
            try {{
                const response = await fetch('/api/get_project_data/{project_id}/');
                return await response.json();
            }} catch (err) {{
                console.error('Failed to load data:', err);
                return [];
            }}
        }};
        """
    return (
        "<!DOCTYPE html>\n"
        "<html lang=\"en\">\n"
        "<head>\n"
        "  <meta charset=\"utf-8\"> \n"
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
        "  <title>" + theme["name"] + " React Preview</title>\n"
        "  <style>\n"
        "    body {\n"
        "      margin: 0;\n"
        "      min-height: 100vh;\n"
        "      font-family: " + theme["font_family"] + ";\n"
        "      background: " + theme["body_bg"] + ";\n"
        "      color: " + theme["text_color"] + ";\n"
        "      " + ("backdrop-filter: blur(10px);" if theme["slug"] == "glass-frost" else "") + "\n"
        "    }\n"
        "    .preview-shell {\n"
        "      min-height: 100vh;\n"
        "      display: flex;\n"
        "      align-items: center;\n"
        "      justify-content: center;\n"
        "      padding: clamp(16px, 5vw, 48px);\n"
        "    }\n"
        "    .preview-card {\n"
        "      width: min(1100px, 100%);\n"
        "      padding: clamp(24px, 4vw, 48px);\n"
        "      border-radius: " + theme.get("border_radius", "28px") + ";\n"
        "      background: " + theme["surface"] + ";\n"
        "      box-shadow: " + theme["shadow"] + ";\n"
        "      border: 1px solid " + theme["surface_border"] + ";\n"
        "      " + ("backdrop-filter: blur(20px);" if theme["slug"] == "glass-frost" else "") + "\n"
        "      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);\n"
        "    }\n"
        "    .preview-card:hover {\n"
        "        transform: scale(1.01);\n"
        "    }\n"
        "    .preview-title {\n"
        "      margin: 0 0 10px;\n"
        "      font-size: clamp(1.8rem, 2.4vw, 2.8rem);\n"
        "      color: " + theme["text_color"] + ";\n"
        "    }\n"
        "    .preview-subtitle {\n"
        "      margin: 0 0 26px;\n"
        "      color: rgba(226, 232, 240, 0.82);\n"
        "      line-height: 1.7;\n"
        "      max-width: 820px;\n"
        "    }\n"
        "  </style>\n"
        "</head>\n"
        "<body>\n"
        "  <div class=\"preview-shell\">\n"
        "    <div class=\"preview-card\">\n"
        "      <h2 class=\"preview-title\">" + theme["title"] + "</h2>\n"
        "      <p class=\"preview-subtitle\">" + theme["subtitle"] + "</p>\n"
        "      <div id=\"root\"></div>\n"
        "    </div>\n"
        "  </div>\n\n"
        "  <script src=\"https://unpkg.com/react@18/umd/react.development.js\"></script>\n"
        "  <script src=\"https://unpkg.com/react-dom@18/umd/react-dom.development.js\"></script>\n"
        "  <script src=\"https://unpkg.com/@babel/standalone/babel.min.js\"></script>\n"
        "  <script type=\"text/babel\">\n"
        "const { useState, useEffect } = React;\n"
        + save_data_js + "\n"
        "try {\n" + react_code + "\n\n"
        + "const root = ReactDOM.createRoot(document.getElementById('root'));\n"
        + "root.render(<App />);\n"
        + "} catch (error) {\n"
        + "  console.error(error);\n"
        + "  function App() {\n"
        + "    return (\n"
        + "      <div>\n"
        + "        <h3 style={{ color: 'red' }}>❌ React Error</h3>\n"
        + "        <pre>{String(error)}</pre>\n"
        + "      </div>\n"
        + "    );\n"
        + "  }\n"
        + "  const root = ReactDOM.createRoot(document.getElementById('root'));\n"
        + "  root.render(<App />);\n"
        + "}\n"
        + "  </script>\n"
        + "</body>\n"
        + "</html>"
    )

def build_react_module_code(react_code, theme):
    cleaned_code = re.sub(r"\bexport\s+default\s+function\s+App\b", "function GeneratedApp", react_code, count=1)
    cleaned_code = re.sub(r"\bexport\s+default\s+App\s*;?", "", cleaned_code)
    cleaned_code = re.sub(r"\bfunction\s+App\b", "function GeneratedApp", cleaned_code, count=1)
    cleaned_code = re.sub(r"\bconst\s+App\s*=", "const GeneratedApp =", cleaned_code, count=1)
    cleaned_code = re.sub(r"\blet\s+App\s*=", "let GeneratedApp =", cleaned_code, count=1)
    imports = ['import "./App.css";']
    if re.search(r"\bReact\.(useState|useEffect|useMemo|useCallback|useRef|useContext|useLayoutEffect)\b", cleaned_code):
        imports.insert(0, 'import React from "react";')
    named_hooks = []
    for hook in ["useState", "useEffect", "useMemo", "useCallback", "useRef", "useContext", "useLayoutEffect"]:
        if re.search(rf"\b{hook}\b", cleaned_code) and not re.search(rf"React\.{hook}\b", cleaned_code):
            named_hooks.append(hook)
    if named_hooks:
        imports.insert(1, 'import { ' + ", ".join(sorted(set(named_hooks))) + ' } from "react";')
    module_code = "\n".join(imports) + "\n\n" + cleaned_code.strip() + "\n\n"
    module_code += "function App() {\n"
    module_code += "  return (\n"
    module_code += "    <div className=\"project-shell theme-" + theme['slug'] + "\">\n"
    module_code += "      <div className=\"project-card\">\n"
    module_code += "        <div className=\"project-hero\">\n"
    module_code += "          <span className=\"project-badge\">" + theme["name"] + "</span>\n"
    module_code += "          <h1>" + theme["title"] + "</h1>\n"
    module_code += "          <p>" + theme["subtitle"] + "</p>\n"
    module_code += "        </div>\n"
    module_code += "        <div className=\"project-content\">\n"
    module_code += "          <GeneratedApp />\n"
    module_code += "        </div>\n"
    module_code += "      </div>\n"
    module_code += "    </div>\n"
    module_code += "  );\n"
    module_code += "}\n\nexport default App;\n"
    return module_code

def build_app_css(theme):
    return (
        ":root {\n"
        "  color-scheme: dark;\n"
        "  color: " + theme["text_color"] + ";\n"
        "  background: " + theme["body_bg"] + ";\n"
        "  font-family: " + theme["font_family"] + ";\n"
        "}\n\n"
        "body {\n"
        "  margin: 0;\n"
        "  min-height: 100vh;\n"
        "  background: " + theme["body_bg"] + ";\n"
        "  color: " + theme["text_color"] + ";\n"
        "}\n\n"
        "#root {\n"
        "  min-height: 100vh;\n"
        "}\n\n"
        ".project-shell {\n"
        "  min-height: 100vh;\n"
        "  padding: 40px 24px;\n"
        "  display: flex;\n"
        "  justify-content: center;\n"
        "  background: " + theme["body_bg"] + ";\n"
        "}\n\n"
        ".project-card {\n"
        "  width: min(1080px, 100%);\n"
        "  background: " + theme["surface"] + ";\n"
        "  border: 1px solid " + theme["surface_border"] + ";\n"
        "  border-radius: " + theme.get("border_radius", "32px") + ";\n"
        "  box-shadow: " + theme["shadow"] + ";\n"
        "  overflow: hidden;\n"
        "  transition: all 0.3s ease;\n"
        "}\n\n"
        ".project-card:hover {\n"
        "  transform: translateY(-5px);\n"
        "  box-shadow: " + theme["shadow"].replace("0 28px 90px", "0 40px 100px") + ";\n"
        "}\n\n"
        ".project-hero {\n"
        "  padding: 34px;\n"
        "  background: " + theme["panel_bg"] + ";\n"
        "  border-bottom: 1px solid " + theme["surface_border"] + ";\n"
        "}\n\n"
        ".project-badge {\n"
        "  display: inline-flex;\n"
        "  align-items: center;\n"
        "  padding: 9px 18px;\n"
        "  border-radius: 999px;\n"
        "  background: " + theme["accent"] + ";\n"
        "  color: " + theme["button_text"] + ";\n"
        "  font-weight: 700;\n"
        "  letter-spacing: 0.08em;\n"
        "  text-transform: uppercase;\n"
        "  font-size: 0.78rem;\n"
        "  margin-bottom: 18px;\n"
        "}\n\n"
        ".project-hero h1 {\n"
        "  margin: 0 0 10px;\n"
        "  font-size: clamp(2rem, 2.4vw, 3rem);\n"
        "  line-height: 1.05;\n"
        "  color: " + theme["text_color"] + ";\n"
        "}\n\n"
        ".project-hero p {\n"
        "  margin: 0;\n"
        "  color: rgba(255, 255, 255, 0.78);\n"
        "  max-width: 760px;\n"
        "  line-height: 1.65;\n"
        "}\n\n"
        ".project-content {\n"
        "  padding: 32px;\n"
        "}\n\n"
        ".project-content h2 {\n"
        "  margin-top: 0;\n"
        "  color: " + theme["accent_alt"] + ";\n"
        "}\n\n"
        "button, input, textarea, select {\n"
        "  font: inherit;\n"
        "}\n\n"
        "button {\n"
        "  background: " + theme["button_bg"] + ";\n"
        "  color: " + theme["button_text"] + ";\n"
        "  border: none;\n"
        "  border-radius: 14px;\n"
        "  padding: 0.95rem 1.4rem;\n"
        "  cursor: pointer;\n"
        "  transition: transform 0.2s ease, opacity 0.2s ease;\n"
        "}\n\n"
        "button:hover {\n"
        "  opacity: 0.95;\n"
        "  transform: translateY(-1px);\n"
        "}\n\n"
        "input, textarea, select {\n"
        "  background: " + theme["input_bg"] + ";\n"
        "  border: 1px solid " + theme["surface_border"] + ";\n"
        "  border-radius: 14px;\n"
        "  color: " + theme["text_color"] + ";\n"
        "  padding: 0.95rem 1rem;\n"
        "  width: 100%;\n"
        "}\n"
    )

def home(request):
    return render(request, "mainapp/index.html")

def process(request):
    if request.method == "POST":
        prompt = request.POST.get("prompt")
        output_type = request.POST.get("type")
        folder_name = request.POST.get("folder", "project").replace(" ", "_")
        result = None
        view_url = None
        files_data = []
        base_dir = os.path.join(settings.BASE_DIR, "generated_projects")
        os.makedirs(base_dir, exist_ok=True)
        if output_type == "text":
            result = generate_text(prompt)
            AIHistory.objects.create(prompt=prompt, response=str(result))
        elif output_type == "react":
            raw_code = generate_react_app(prompt)
            react_code = clean_react_code(raw_code)
            theme = choose_project_theme(prompt + folder_name)
            
            # Database storage for project
            project = GeneratedProject.objects.create(
                name=folder_name,
                prompt=prompt,
                theme_slug=theme['slug'],
                react_code=react_code,
                css_code=build_app_css(theme)
            )

            module_code = build_react_module_code(react_code, theme)
            app_css = project.css_code
            preview_html = build_preview_html(theme, react_code, project_id=project.id)

            user_folder = os.path.join(base_dir, folder_name)
            os.makedirs(os.path.join(user_folder, "src"), exist_ok=True)
            with open(os.path.join(user_folder, "src", "App.jsx"), "w", encoding="utf-8") as f: f.write(module_code)
            with open(os.path.join(user_folder, "src", "App.css"), "w", encoding="utf-8") as f: f.write(app_css)
            with open(os.path.join(user_folder, "index.html"), "w", encoding="utf-8") as f: f.write(preview_html)
            
            view_url = f"/generated_projects/{folder_name}/index.html"
            result = react_code
            files_data = [
                {"name": "src/App.jsx", "content": module_code, "path": f"/generated_projects/{folder_name}/src/App.jsx"},
                {"name": "src/App.css", "content": app_css, "path": f"/generated_projects/{folder_name}/src/App.css"},
                {"name": "index.html", "content": preview_html, "path": view_url}
            ]

        return render(request, "mainapp/result.html", {
            "result": result,
            "view_url": view_url,
            "files": files_data
        })

@csrf_exempt
def save_project_data(request, project_id):
    if request.method == "POST":
        project = get_object_or_404(GeneratedProject, id=project_id)
        try:
            payload = json.loads(request.body)
            ProjectData.objects.create(project=project, payload=payload)
            return JsonResponse({"status": "success"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error"}, status=405)

@csrf_exempt
def get_project_data(request, project_id):
    project = get_object_or_404(GeneratedProject, id=project_id)
    # Return data entries for this project
    data_list = list(project.data_entries.all().order_by("-created_at").values("payload", "created_at"))
    return JsonResponse(data_list, safe=False)

def history(request):
    data = AIHistory.objects.all().order_by("-id")
    return render(request, "mainapp/history.html", {"data": data})

def clean_react_code(code):
    code = re.sub(r'^\s*```(?:jsx|js|javascript)?\s*$\n?', '', code, flags=re.MULTILINE)
    code = re.sub(r'^\s*(?:jsx|js|javascript)\s*$\n?', '', code, flags=re.MULTILINE)
    code = code.replace("export default App;", "")
    return code.strip()