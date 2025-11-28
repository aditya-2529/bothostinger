import requests
import os

# Your Node.js Backend URL
NODE_API_URL = "http://localhost:3000"

def get_my_bots(user_id: str) -> str:
    """Fetches the list of bots owned by the user."""
    try:
        response = requests.get(f"{NODE_API_URL}/bots?userId={user_id}")
        return str(response.json())
    except Exception as e:
        return f"Error fetching bots: {str(e)}"

def get_bot_logs(deployment_id: str) -> str:
    """Fetches the console logs for a specific bot to diagnose errors."""
    try:
        response = requests.get(f"{NODE_API_URL}/logs/{deployment_id}")
        data = response.json()
        # Limit logs to last 1000 chars to save tokens
        return data.get("logs", "No logs found")[-1000:]
    except Exception as e:
        return f"Error getting logs: {str(e)}"

def restart_bot(deployment_id: str) -> str:
    """Restarts a specific bot container."""
    try:
        requests.post(f"{NODE_API_URL}/stop", json={"deploymentId": deployment_id})
        requests.post(f"{NODE_API_URL}/start", json={"deploymentId": deployment_id})
        return "Bot restarted successfully."
    except Exception as e:
        return f"Error restarting bot: {str(e)}"