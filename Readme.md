# BotHost AI: Autonomous DevOps Agent 🤖

**Kaggle AI Agents Intensive Capstone Project**

BotHost is a Platform-as-a-Service (PaaS) that uses a **Google ADK Agent** to act as an autonomous Site Reliability Engineer (SRE). Instead of managing servers manually, users can chat with the AI to debug errors, check logs, and restart containers.

<!-- ![Dashboard Screenshot] -->

## 🚀 Key Features
- **Auto-Diagnosis:** The agent reads Docker logs via custom tools to find root causes of crashes.
- **Natural Language Ops:** "Restart my music bot" works instantly.
- **Hybrid Architecture:** React Frontend + Python AI Microservice (FastAPI) + Node.js Orchestrator.

## 🛠️ Tech Stack
- **AI Agent:** Google ADK, Gemini 2.5 Flash Lite
- **Backend:** Node.js, Express, Docker Engine
- **Database:** MongoDB
- **Frontend:** React, Tailwind CSS

## 📦 How to Run Locally

### 1. Prerequisites
- Docker Desktop installed & running
- Python 3.10+
- Node.js 18+

### 2. Installation
```bash
# Clone the repo
git clone [https://github.com/YOUR_USERNAME/your-repo.git](https://github.com/YOUR_USERNAME/your-repo.git)

# Install Backend
cd server
npm install
node server.js

# Install AI Agent (In a new terminal)
cd ../ai_agent
pip install -r requirements.txt
python server.py

# Install Frontend (In a new terminal)
cd ../client
npm install
npm run dev