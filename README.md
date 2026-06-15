# Chat Agent

A full-stack chat application with OpenAI-compatible LLM support, streaming responses, and skill templates.

## Features

- Multi-turn conversations with streaming output
- Switch between OpenAI-compatible models (DeepSeek, Moonshot, Ollama, etc.)
- Pre-built skill templates (Code, Translation, Writing, etc.)
- Conversation history with anonymous sessions
- Stop generation mid-response

## Tech Stack

**Frontend:** Vue 3, Vite, Element Plus, fetch-event-source, marked
**Backend:** Hono, PostgreSQL
**LLM:** OpenAI-compatible API (OpenAI, DeepSeek, Moonshot, Ollama, vLLM)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL

### Setup

```bash
# Clone and install
git clone <repo-url>
cd chat-agent

# Backend
cd server
cp .env.example .env  # Edit with your DB and API keys
npm install
npm run dev

# Frontend (new terminal)
cd web
npm install
npm run dev
```

### Database

```bash
psql -U your_user -d chatagent -f server/src/db/schema.sql
```

Open http://localhost:5173

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Server port (default: 3000) |
| `OPENAI_API_KEY` | API key for LLM service |
| `OPENAI_BASE_URL` | API base URL (see examples below) |

### Supported LLM Services

| Service | OPENAI_BASE_URL |
|---------|-----------------|
| OpenAI | `https://api.openai.com/v1` |
| DeepSeek | `https://api.deepseek.com/v1` |
| Moonshot | `https://api.moonshot.cn/v1` |
| Ollama (local) | `http://localhost:11434/v1` |
| vLLM (local) | `http://localhost:8000/v1` |

## Project Structure

```
chat-agent/
├── server/          # Hono backend
│   ├── src/
│   │   ├── routes/  # API routes
│   │   ├── llm/     # LLM providers
│   │   ├── db/      # Database
│   │   └── skills/  # Skill templates
├── web/             # Vue 3 frontend
│   └── src/
│       ├── components/
│       ├── composables/
│       └── api/
└── README.md
```
