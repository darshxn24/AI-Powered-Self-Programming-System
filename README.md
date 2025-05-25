Project Overview:

This is my final year project which focuses on building an AI-powered tool that helps programmers write better Python code. The system allows users to input Query related to Python code and receive generated, debugged, optimized, or explained responses from the GPT-4o model provided by OpenAI.

The tool is fully interactive with a clean frontend and a secure backend. It includes user login/signup functionality, feedback logging, and a feature to track and view code history.


What’s Included:


The project is structured into these main parts:

- backend/ – Python FastAPI server, database models, API routes
- frontend/ – React.js interface for users
- report/ – The written project report, ERD diagram, meeting notes, and references
- README.txt – This file


Technologies Used:


- Python 3.11
- FastAPI
- PostgreSQL
- SQLAlchemy
- React.js
- OpenAI GPT-4o API
- CSS, Syntax Highlighter
- pgAdmin & Draw.io for diagrams


How to Set It Up:


1. Backend Setup:
   - Navigate to the backend folder.
   - Create a virtual environment and activate it.
   - Run: pip install -r requirements.txt
   - Make sure your database credentials are set up in database.py
   - Set your OpenAI API Key as an environment variable.

2. Frontend Setup:
   - Navigate to the frontend folder.
   - Run: npm install
   - Start the frontend with: npm start

3. Database:
   - PostgreSQL must be installed and running.
   - Create a database called: ai_self_programming
   - You can view data using pgAdmin.

4. Running the App:
   - Run backend with: uvicorn main:app --reload
   - Visit http://localhost:3000 to open the frontend.


Authentication:


Users can register and log in with their name, email, and password.
All credentials are stored securely in PostgreSQL with hashed passwords using bcrypt.


Extra Notes:


- I’ve tested the system on MacOS and Windows.
- All screenshots, diagrams are in the report.
- The system has been designed for academic use so this is a base model, we can expand it to deploy for commercial use.
