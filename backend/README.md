# Kososumi AI Backend (MVP)

Production-style backend starter for a multi-agent workflow automation platform.

## Architecture

- **API Layer (Express)**: auth, workflows, execution, webhook endpoints.
- **Workflow Engine**: node graph traversal (`nodes` + `edges`), step-by-step execution.
- **Node Executors**:
  - `webhook`
  - `http_request`
  - `ai_agent`
  - `delay`
  - `condition`
- **AI Agent Layer**: OpenAI Responses API with tool calling (`http_get`) + execution memory.
- **Queue Layer (BullMQ + Redis)**: each workflow run is a queued job.
- **Worker Layer**: async execution, retries, failure capture.
- **Persistence (MongoDB + Mongoose)**: users, workflows, executions, logs.

## Folder Structure

```txt
backend/
 ├── src/
 │   ├── controllers/
 │   ├── services/
 │   ├── models/
 │   ├── routes/
 │   ├── agents/
 │   ├── workflows/
 │   ├── queue/
 │   ├── utils/
 │   ├── middleware/
 │   └── config/
 ├── .env
 ├── .env.example
 ├── sample-workflow.json
 └── package.json
```

## Data Models

- `users`: account + password hash
- `workflows`: graph definition (`nodes`, `edges`)
- `executions`: run state, input/output, memory, status, attempts
- `logs`: per-node execution logs

## API Endpoints

### Auth
- `POST /auth/signup`
- `POST /auth/login`

### Workflow
- `POST /workflows`
- `GET /workflows`
- `GET /workflows/:id`
- `PUT /workflows/:id`
- `DELETE /workflows/:id`

### Execution
- `POST /execute/:workflowId`
- `GET /executions/:id`
- `GET /logs/:executionId`

### Webhook
- `POST /webhook/:workflowId`

## Local Run

### 1) Start infrastructure

Make sure MongoDB and Redis are running locally:

- MongoDB: `mongodb://localhost:27017`
- Redis: `127.0.0.1:6379`

### 2) Configure environment

Copy and edit variables:

```bash
cp .env.example .env
```

Set:
- `JWT_SECRET` (required)
- `OPENAI_API_KEY` (optional for real LLM calls; if empty, AI node uses mock output)

### 3) Install + run

```bash
npm install
npm run dev
```

In another terminal:

```bash
npm run worker
```

## Sample Workflow

Use `sample-workflow.json` with `POST /workflows`.

Flow:

`Webhook -> AI Agent -> HTTP Request -> Condition -> Delay`

## Notes

- Retry behavior is configured via `WORKFLOW_MAX_RETRIES`.
- The condition node routes based on edge labels (`true`/`false`).
- The AI node stores output snapshots in execution memory.
