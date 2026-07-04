# Project Memory

## Stack
* Python (version 3.11.14)
* LangChain Core (v0.3.70+)
* LangChain Community (v0.3.27+)
* LangChain Groq (v1.1.3+)
* LangGraph (v0.6.0+)
* Tavily Python SDK (v0.7.9+)
* BeautifulSoup4 (v4.13.4+)
* Requests (v2.32.3+)
* Groq Cloud API (Llama-3.3-70b-versatile model)

## Architecture
* **Search Agent**: Searches the web for information using the Tavily search tool.
* **Research Agent**: Scrapes deep content from a selected URL using custom scraper tool.
* **Writer Agent (Chain)**: Compiles search results and scraped content into a formatted report.
* **Critic Agent (Chain)**: Scores and reviews the report, producing feedback and a verdict.
* **Sequential Orchestration**: Runs step-by-step from Search -> Scrape -> Write -> Critic.

## File Map
* `agent.py`: Configures LLM client, prompts, agents, and LCEL chains for writer/critic.
* `tools.py`: Implements `web_search` (Tavily) and `scrape_url` (requests/BeautifulSoup) tools.
* `pipeline.py`: Orchestrates agent execution steps and stores state sequentially.
* `main.py`: Entry point script displaying a welcome message.
* `pyproject.toml`: Configuration specifying project details, python version, and base dependencies.
* `requirements.txt`: Pinpoints dependencies for core libraries, APIs, testing, and formatting.
* `README.md`: Empty project documentation file.
* `.env`: Secret keys (Groq & Tavily) for API access.
* `.python-version`: Specifies Python version 3.11.14.

## Key Functions & Classes
* `build_search_agent()` (`agent.py`): Builds the LangChain agent for web search.
* `recearch_agent()` (`agent.py`): Builds the LangChain agent for url scraping.
* `writer_chain` (`agent.py`): LCEL chain using LLM to draft research reports.
* `critic_chain` (`agent.py`): LCEL chain using LLM to score and critique reports.
* `web_search(query)` (`tools.py`): Tavily-based search tool returning snippets and URLs.
* `scrape_url(url)` (`tools.py`): Scrapes and parses text content from a web page.
* `run_recearch_pipeline(topic)` (`pipeline.py`): Sequences and prints the output of all agents/chains.

## Current Entry Point
* CLI command: `python pipeline.py` to run the interactive research pipeline.
* CLI command: `python main.py` for default greeting message.

## Open Questions / Gaps
* **Import issue**: `from langchain.agents import create_agent` in `agent.py` is not a standard helper in modern LangChain.
* **Typo in naming conventions**: Typo in `recearch_agent` and `run_recearch_pipeline` ("recearch").
* **Truncated content**: Web scraping is capped at 1000 characters which may miss significant details.
* **Single page search fallback**: Scraper picks search results up to 700 characters and reads only one URL.
* **Main entry point integration**: `main.py` is not currently integrated with the agent orchestration pipeline.

## Next Steps We Discussed
