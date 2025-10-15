# README for Backend Flask Application

This is the backend part of the full-stack application built using Flask. The backend is responsible for handling API requests, managing data, and serving static files.

## Project Structure

- `app.py`: The main entry point for the Flask application. This file sets up the Flask app, defines routes, and handles incoming requests.
- `requirements.txt`: A list of Python packages required for the Flask application. Use this file to install dependencies with pip.
- `static/`: This directory contains static files such as CSS, JavaScript, and images that can be served by the Flask application.
- `templates/`: This directory holds HTML templates used by Flask to render dynamic content.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd my-fullstack-app/backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```
   python app.py
   ```

The Flask application will start running on `http://127.0.0.1:5000/` by default.

## API Endpoints

- Document the available API endpoints here.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.