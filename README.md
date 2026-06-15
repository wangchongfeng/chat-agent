# Chat Agent

A full-stack chat application with multi-provider LLM support, streaming responses, and skill templates.

## Features

- Multi-turn conversations with streaming output
- Switch between OpenAI and Anthropic models
- Pre-built skill templates (Code, Translation, Writing, etc.)
- Conversation history with anonymous sessions
- Stop generation mid-response

## Tech Stack

**Frontend:** Vue 3, Vite, Element Plus, fetch-event-source, marked
**Backend:** Hono, PostgreSQL
**LLM:** OpenAI, Anthropic (extensible)

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
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_BASE_URL` | OpenAI API base URL |
| `ANTHROPIC_API_KEY` | Anthropic API key |

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
