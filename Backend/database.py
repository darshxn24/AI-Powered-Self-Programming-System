from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

#  PostgreSQL connection string
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://darshandhebariya@localhost/ai_self_programming"
)
#  Create SQLAlchemy Engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

#  Base Model for Tables
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)


class CodeHistory(Base):
    __tablename__ = "code_history"

    id = Column(Integer, primary_key=True, index=True)
    user_code = Column(Text)
    generated_code = Column(Text, nullable=True)
    debugged_code = Column(Text, nullable=True)
    optimized_code = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    user_email = Column(String, nullable=False)


class FeedbackLog(Base):
    __tablename__ = "feedback_log"

    id = Column(Integer, primary_key=True, index=True)
    code_id = Column(Integer)  # Link to CodeHistory.id
    feedback_type = Column(String)  # e.g. 'generate', 'debug', etc.
    score = Column(Integer)  # e.g. 1 = useful, 0 = neutral, -1 = rejected
    user_email = Column(String)


#  Create all the table in the database
Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
