from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

# Configure static files
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching for development

@app.route('/')
def home():
    """Home page with navigation options."""
    return render_template('home.html')

@app.route('/submit')
def submit():
    """Tax submission form page."""
    return render_template('submit.html')

@app.route('/history')
def history():
    """Submission history page."""
    return render_template('history.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS)."""
    return send_from_directory('static', filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("\n" + "="*50)
    print("Tax Submission System - Frontend")
    print("="*50)
    print(f"Server starting at: http://localhost:{port}")
    print("Pages:")
    print("  / - Home page")
    print("  /submit - Submit tax form")
    print("  /history - View submission history")
    print("\nNote: Make sure the backend API is running on port 8080")
    print("Press Ctrl+C to stop the server")
    print("="*50 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=port)

# Made with Bob
