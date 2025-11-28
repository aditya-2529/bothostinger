import os
from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.tools import FunctionTool
from google.genai import types
from tools import get_my_bots, get_bot_logs, restart_bot

# Configure Retry (From Day 1/2 of Course)
retry_config = types.HttpRetryOptions(
    attempts=3, 
    exp_base=2, 
    initial_delay=1, 
    http_status_codes=[429, 500, 503]
)

# Define the DevOps Agent
devops_agent = LlmAgent(
    name="BotHost_SRE",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    description="An autonomous DevOps engineer that manages user deployments.",
    instruction="""
    You are the AI Site Reliability Engineer (SRE) for BotHost.
    Your goal is to help users manage their deployed applications.

    YOUR WORKFLOW:
    1. If a user says "my bot is broken", ALWAYS list their bots first to identify the ID.
    2. Once you have the ID, use `get_bot_logs` to analyze the error.
    3. Explain the error in simple terms to the user.
    4. If the error looks transient (like a timeout), offer to `restart_bot`.
    
    Do not hallunicate. Only use the tools provided.
    """,
    tools=[
        FunctionTool(get_my_bots),
        FunctionTool(get_bot_logs),
        FunctionTool(restart_bot)
    ]
)