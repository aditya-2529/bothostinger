// bots.ts
import { API_URL, handleResponse, Bot } from './mongoapi';

export const botService = {
  
  // GET /bots?userId=...
  async getBots(userId: string): Promise<Bot[]> {
    const response = await fetch(`${API_URL}/bots?userId=${userId}`);
    const data = await handleResponse(response);
    return data.bots || [];
  },

  async getBotLogs(deploymentId: string): Promise<string> {
    const response = await fetch(`${API_URL}/logs/${deploymentId}`);
    const data = await handleResponse(response);
    return data.logs || '';
  },
  // POST /deploy
  async deployBot(userId: string, repoUrl: string): Promise<{ deploymentId: string }> {
    const response = await fetch(`${API_URL}/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, repoUrl }),
    });

    return handleResponse(response);
  },

  // GET /status/:id (Used for polling)
  async getBotStatus(deploymentId: string): Promise<Bot | null> {
    const response = await fetch(`${API_URL}/status/${deploymentId}`);
    // If 404, return null
    if (response.status === 404) return null;
    return handleResponse(response);
  },

  // POST /start
  async startBot(deploymentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deploymentId }),
    });
    await handleResponse(response);
  },

  // POST /stop
  async stopBot(deploymentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/stop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deploymentId }),
    });
    await handleResponse(response);
  },

  // POST /delete
  async deleteBot(deploymentId: string): Promise<void> {
    const response = await fetch(`${API_URL}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deploymentId }),
    });
    await handleResponse(response);
  },
};