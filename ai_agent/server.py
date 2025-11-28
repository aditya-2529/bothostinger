from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agent import devops_agent
import uvicorn
import os

app = FastAPI()

# Enable CORS so React can talk to this
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    os.environ["GOOGLE_API_KEY"] = ''
    print("✅ Setup and authentication complete.")
except Exception as e:
    print(
        f"🔑 Authentication Error: Please make sure you have added 'GOOGLE_API_KEY' to your Kaggle secrets. Details: {e}"
    )

# Session Service (Concept 3: Memory/State)
session_service = InMemorySessionService()
# Pass app_name="bothost" to match your session creation logic
runner = Runner(agent=devops_agent, session_service=session_service, app_name="bothost")

class ChatRequest(BaseModel):
    userId: str
    message: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    session_id = f"session_{req.userId}"
    
    # 1. Initialize Session (Create if not exists)
    try:
        await session_service.create_session(
            app_name="bothost", user_id=req.userId, session_id=session_id
        )
    except Exception:
        pass

    # 2. THE FIX: Inject the ID into the prompt hiddenly
    # We tell the AI: "This is the user's ID. If you need to call a tool, use THIS id."
    context_prompt = (
        f"SYSTEM CONTEXT: The current user's ID is '{req.userId}'. "
        f"If you need to call tools like `get_my_bots`, use this ID: '{req.userId}'. "
        f"Do NOT ask the user for their ID.\n\n"
        f"USER MESSAGE: {req.message}"
    )

    user_msg = types.Content(role="user", parts=[types.Part(text=context_prompt)])
    
    final_response = "I'm thinking..."
    
    try:
        async for event in runner.run_async(
            user_id=req.userId, session_id=session_id, new_message=user_msg
        ):
            if event.is_final_response() and event.content:
                final_response = event.content.parts[0].text
    except Exception as e:
        print(f"Error running agent: {str(e)}")
        final_response = "I encountered an error processing your request."

    return {"reply": final_response}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)