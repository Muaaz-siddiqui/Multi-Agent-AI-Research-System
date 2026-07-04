import re
from typing import List
from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, init_db, ResearchRun, SessionLocal
from schemas import ResearchRequest, ResearchResponse
from pipeline import run_recearch_pipeline

app = FastAPI(title="Research API pipeline")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event('startup')
def startup():
    init_db()

def execute_research_pipeline(run_id: int, topic: str):
    db = SessionLocal()
    try:
        result = run_recearch_pipeline(topic)
        
        # Parse critic score from feedback (e.g., "Score: 8/10" or "Score: 8")
        feedback = result.get("feedback", "")
        critic_score = None
        if feedback:
            match = re.search(r"Score:\s*(\d+(?:/\d+)?)", feedback, re.IGNORECASE)
            if match:
                critic_score = match.group(1)
        
        run = db.query(ResearchRun).filter(ResearchRun.id == run_id).first()
        if run:
            run.search_result = result.get("search_result")
            run.scraped_result = result.get("scraped_result")
            run.report = result.get("report")
            run.feedback = feedback
            run.critic_score = critic_score
            run.status = "completed"
            db.commit()
    except Exception as e:
        db.rollback()
        run = db.query(ResearchRun).filter(ResearchRun.id == run_id).first()
        if run:
            run.status = "failed"
            run.feedback = f"Error occurred during execution: {str(e)}"
            db.commit()
    finally:
        db.close()

@app.post('/research', response_model=ResearchResponse)
def run_research(request: ResearchRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    run = ResearchRun(
        topic=request.topic,
        status="processing"
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    
    background_tasks.add_task(execute_research_pipeline, run.id, request.topic)
    return run

@app.get('/research/{run_id}', response_model=ResearchResponse)
def get_research(run_id: int, db: Session = Depends(get_db)):
    run = db.query(ResearchRun).filter(ResearchRun.id == run_id).first()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run

@app.get("/research", response_model=List[ResearchResponse])
def list_research(db: Session = Depends(get_db)):
    runs = db.query(ResearchRun).order_by(ResearchRun.created_at.desc()).limit(20).all()
    return runs