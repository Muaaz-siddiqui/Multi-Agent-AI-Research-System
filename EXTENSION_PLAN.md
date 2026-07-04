# Extension Plan

## FastAPI — Inference API
### Purpose
* Exposes HTTP endpoints to trigger the multi-agent research pipeline and fetch generated reports.

### Endpoints
* `POST /research` — Starts a new research task for a given topic.
* `GET /research/{task_id}` — Retrieves the status, report, and feedback of a research task.

### Request/Response Shape
* `POST /research`
  * Request: `{"topic": "string"}`
  * Response: `{"task_id": "string", "status": "processing"}`
* `GET /research/{task_id}`
  * Response: `{"task_id": "string", "topic": "string", "status": "completed", "report": "string", "feedback": "string"}`

### How It Connects to Existing Agents
* `POST /research` invokes the pipeline function `run_recearch_pipeline` in a background worker.

### Files to Create
* `api.py`: FastAPI server setup, route handlers, and Pydantic models for validation.

## PostgreSQL — Database Layer
### Purpose
* Persists research task state, search results, scraped content, final reports, and critic feedback.

### Tables
* `research_tasks`
  * `id`: UUID Primary Key
  * `topic`: TEXT
  * `search_result`: TEXT
  * `scraped_result`: TEXT
  * `report`: TEXT
  * `feedback`: TEXT
  * `status`: VARCHAR(50)
  * `created_at`: TIMESTAMP

### When Data Gets Written
* A row is created with `status = 'processing'` when `POST /research` is received.
* The row is updated with intermediate search/scraped data and final report/feedback at the end of the pipeline execution.

### Files to Create
* `database.py`: Connection lifecycle, database session setup, and SQL queries/schemas.

## Implementation Order
1. Install FastAPI, Uvicorn, and PostgreSQL drivers (e.g. `psycopg` or `asyncpg`).
2. Implement schema creation and database CRUD queries in `database.py`.
3. Integrate database operations into the multi-agent workflow in `pipeline.py`.
4. Build HTTP endpoints in `api.py` utilizing background tasks for pipeline orchestration.
5. Add test/health verification routes to check DB and FastAPI integration.

## What We Are NOT Changing
* Agent definitions, models, and prompts in `agent.py`.
* Search and scraping tools in `tools.py`.
