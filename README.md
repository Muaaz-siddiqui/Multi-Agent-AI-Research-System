# Multi-Agent AI Research System

<div align="center">
![Project Banner](./assets/thumbnail.png)

**Autonomous AI pipeline where 4 specialized agents collaborate to research any topic end-to-end.**

[![Python](https://img.shields.io/badge/Python-3.11-blue?style=flat-square&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![LangGraph](https://img.shields.io/badge/LangGraph-0.6-purple?style=flat-square)](https://langchain-ai.github.io/langgraph)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat-square&logo=postgresql)](https://postgresql.org)


</div>

---

## Overview

The Multi-Agent AI Research System is a full-stack AI engineering project that orchestrates a sequential pipeline of 4 autonomous AI agents. A user submits any research topic and the system automatically searches the web, scrapes deep content, writes a structured report, and critiques it — all without manual intervention.

Built with LangGraph for agent orchestration, FastAPI for the REST API backend, PostgreSQL for persistent storage, and a React + Tailwind CSS dashboard for the frontend.

---

## UI Preview

### Home - Research Input
![Home Page](./assets/home.png)

### Results - Research Report & Critic Feedback
![Results Page](./assets/results.png)

### History - Past Research Runs
![History Page](./assets/history.png)

### Live Agent Pipeline
![Agent Pipeline](./assets/pipeline.png)

---

## Agent Pipeline

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│ Search Agent │────▶│ Research Agent   │────▶│ Writer Agent │────▶│ Critic Agent │
│              │     │                  │     │              │     │              │
│ Searches web │     │ Scrapes deep     │     │ Compiles a   │     │ Scores and   │
│ for relevant │     │ content from the │     │ structured   │     │ critiques    │
│ sources via  │     │ most relevant    │     │ research     │     │ the final    │
│ Tavily API   │     │ URL              │     │ report       │     │ report       │
└──────────────┘     └──────────────────┘     └──────────────┘     └──────────────┘
```

| Agent | Role | Tool Used |
|-------|------|-----------|
| **Search Agent** | Finds recent, reliable sources for the topic | Tavily Search API |
| **Research Agent** | Picks the best URL and scrapes deep content | BeautifulSoup + Requests |
| **Writer Agent** | Combines search + scraped data into a report | OpenAI GPT-4o (LCEL Chain) |
| **Critic Agent** | Reviews the report and provides score + feedback | OpenAI GPT-4o (LCEL Chain) |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Agent Orchestration** | LangGraph, LangChain |
| **LLM** | groq (Llama 3.370b) |
| **Web Search** | Tavily Search API |
| **Web Scraping** | BeautifulSoup4, Requests |
| **Backend API** | FastAPI, Uvicorn |
| **Database** | PostgreSQL, SQLAlchemy |
| **Frontend** | React, Vite, Tailwind CSS, React Router |
| **Language** | Python 3.11 |

---

## Features

- **4-Agent Sequential Pipeline** — Search → Research → Write → Critique, fully automated
- **REST API** — FastAPI backend with documented endpoints (`/docs` Swagger UI)
- **Persistent Storage** — Every research run saved to PostgreSQL with full report, feedback, and score
- **Full-Stack Dashboard** — React frontend with Home, Results, and History pages
- **Research History** — Browse and revisit all past research runs from the UI
- **Tabbed Results View** — Switch between Research Report, Critic Feedback, and Raw Data
- **Auto-generated API Docs** — FastAPI Swagger UI at `/docs`

---

## Project Structure

```
multi-agent-systems/
│
├── agent.py            # LLM config, agent builders, writer & critic chains
├── tools.py            # web_search (Tavily) and scrape_url (BeautifulSoup)
├── pipeline.py         # Orchestrates all 4 agents sequentially, returns dict
├── database.py         # SQLAlchemy models, DB session, init_db()
├── api.py              # FastAPI app with /research endpoints
├── main.py             # CLI entry point
│
├── frontend/           # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Results.jsx
│   │   │   └── History.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .env                # API keys (not committed)
├── requirements.txt    # Python dependencies
└── README.md
```

---

## Frontend Pages

The React app currently exposes these pages:

- `/` - Home page for starting a new research run
- `/results/:id` - Results page for viewing a completed or processing run
- `/history` - History page for browsing previous research runs

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL installed and running
- OpenAI API key
- Tavily API key

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/multi-agent-research-system.git
cd multi-agent-research-system
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/research_db
```

### 5. Create the Database

Open pgAdmin or psql and run:

```sql
CREATE DATABASE research_db;
```

The tables are created automatically when the server starts.

### 6. Start the Backend

```bash
uvicorn api:app --reload --port 8000
```

The API will be live at `http://127.0.0.1:8000`
Swagger docs at `http://127.0.0.1:8000/docs`

### 7. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The dashboard will be live at `http://localhost:5173`

---

## API Reference

### Run a Research Pipeline

```http
POST /research
Content-Type: application/json

{
  "topic": "The Future of Quantum Computing in Cryptography"
}
```

**Response:**
```json
{
  "id": 1,
  "topic": "The Future of Quantum Computing in Cryptography",
  "report": "## Executive Summary\n...",
  "critic_feedback": "The report is well-structured...",
  "critic_score": "8/10"
}
```

### Get All Research Runs

```http
GET /research
```

### Get a Specific Run

```http
GET /research/{id}
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_KEY` | OpenAI API key for GPT-4o | ✅ |
| `TAVILY_API_KEY` | Tavily API key for web search | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |

---

## Roadmap

- [ ] Streaming agent logs via WebSocket
- [ ] PDF export of research reports
- [ ] Voice input for research topics
- [ ] Multi-topic batch research mode
- [ ] Agent memory across sessions

---

## Author

**Muaaz**
AI Automation Engineer | LangChain • LangGraph • FastAPI • RAG Pipelines


[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat-square&logo=github)](https://github.com/Muaaz-siddiqui)

---

## License

This project is licensed under the MIT License.
