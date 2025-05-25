from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI
import os
from fastapi import Query
from openai import OpenAIError
from fastapi import Depends
from auth import router as auth_router

#  Import DB setup and model
from database import SessionLocal, CodeHistory, FeedbackLog

#  Load API Key from Environment Variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set OPENAI_API_KEY as an environment variable.")

app = FastAPI(
    title="AI Self-Programming System",
    description="API for AI-generated, debugged, and optimized code",
    version="1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)
app.include_router(auth_router)
#  CORS Configuration - Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Request Model
class CodeRequest(BaseModel):
    user_code: str
    user_email: str

#  DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#  Input Validation
def validate_input(code: str):
    if not code.strip():
        raise HTTPException(status_code=400, detail="Code input is empty.")
    return code

@app.get("/")
def read_root():
    return {"message": "AI Self-Programming System API is running!"}

# Generate Code
@app.post("/generate_code/")
def generate_code(request: CodeRequest, db: SessionLocal = Depends(get_db)):
    try:
        safe_code = validate_input(request.user_code)
        user_email = request.user_email

        client = OpenAI(api_key=OPENAI_API_KEY)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": f"Generate only the Python code without explanations:\n{safe_code}"}]
        )
        generated_code = response.choices[0].message.content.strip()

        history = CodeHistory(
            user_code=safe_code,
            generated_code=generated_code,
            user_email=request.user_email
        )
        db.add(history)
        db.commit()
        return {"generated_code": f"```python\n{generated_code}\n```"}

    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")

#  Debug Code
@app.post("/debug_code/")
def debug_code(request: CodeRequest, db: SessionLocal = Depends(get_db)):
    try:
        print("=== DEBUG_CODE REQUEST RECEIVED ===")
        print("User Code:", request.user_code)
        print("User Email:", request.user_email)

        safe_code = validate_input(request.user_code)
        user_email = request.user_email

        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": f"Fix errors in this Python code:\n{safe_code}"
                }
            ]
        )
        fixed_code = response.choices[0].message.content.strip()

        history = CodeHistory(
            user_code=safe_code,
            debugged_code=fixed_code,
            user_email=request.user_email
        )

        db.add(history)
        db.commit()

        return {
            "debugged_code": f"```python\n{fixed_code}\n```"
        }

    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")

#  Optimize Code
@app.post("/optimize_code/")
def optimize_code(request: CodeRequest, db: SessionLocal = Depends(get_db)):
    try:
        safe_code = validate_input(request.user_code)
        user_email = request.user_email

        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": f"Optimize this Python code for efficiency:\n{safe_code}"
                }
            ]
        )

        optimized_code = response.choices[0].message.content.strip()

        history = CodeHistory(
            user_code=safe_code,
            optimized_code=optimized_code,
            user_email=request.user_email
        )
        db.add(history)
        db.commit()

        return {
            "optimized_code": f"```python\n{optimized_code}\n```"
        }

    except OpenAIError as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected Error: {str(e)}")


#  Read Code History
@app.get("/code_history/")
def read_code_history(email: str = Query(...), db: SessionLocal = Depends(get_db)):
    try:
        records = db.query(CodeHistory).filter(CodeHistory.user_email == email).all()
        return [
            {
                "id": r.id,
                "user_code": r.user_code,
                "generated_code": r.generated_code,
                "debugged_code": r.debugged_code,
                "optimized_code": r.optimized_code,
                "explanation": r.explanation
            } for r in records
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve code history: {str(e)}")

#  Delete Code Entry by ID
@app.delete("/code_history/{entry_id}")
def delete_code_entry(entry_id: int, db: SessionLocal = Depends(get_db)):
    try:
        record = db.query(CodeHistory).filter(CodeHistory.id == entry_id).first()
        if not record:
            raise HTTPException(status_code=404, detail="Code history entry not found")
        db.delete(record)
        db.commit()
        return {"message": f"Entry with ID {entry_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete entry: {str(e)}")

@app.post("/explain_code/")
def explain_code(request: CodeRequest, db: SessionLocal = Depends(get_db)):
    try:
        safe_code = validate_input(request.user_code)
        user_email = request.user_email

        client = OpenAI(api_key=OPENAI_API_KEY)

        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": f"Explain what this Python code does, line by line:\n{safe_code}"
                }
            ]
        )

        explanation = response.choices[0].message.content.strip()

        #  Save to database with user-specific email
        history = CodeHistory(
            user_code=safe_code,
            explanation=explanation,
            user_email=request.user_email
        )
        db.add(history)
        db.commit()

        return {"explanation": explanation}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error explaining code: {str(e)}")
class FeedbackRequest(BaseModel):
    code_id: int
    feedback_type: str
    score: int
    user_email: str

class FeedbackRequest(BaseModel):
    code_id: int
    feedback_type: str
    score: int
    user_email: str

@app.post("/feedback/")
def submit_feedback(request: FeedbackRequest, db: SessionLocal = Depends(get_db)):
    log = FeedbackLog(
        code_id=request.code_id,
        feedback_type=request.feedback_type,
        score=request.score,
        user_email=request.user_email
    )
    db.add(log)
    db.commit()
    return {"message": "Feedback saved"}
