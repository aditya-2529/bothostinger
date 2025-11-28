// supabase.ts (Recommendation: Rename this file to 'api.ts')

// Point to your local Node.js server
export const API_URL = 'http://localhost:3000';

// Helper to handle API responses
export const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.message || 'API request failed');
  }
  return response.json();
};

export interface User {
  _id: string; // MongoDB uses _id
  username: string;
  email: string;
  balance: number;
  createdAt: string;
}

export interface Bot {
  _id: string;
  deploymentId: string; // camelCase matching your MongoDB schema
  user: string;         // The User ID
  repoUrl: string;
  status: 'QUEUED' | 'BUILDING' | 'RUNNING' | 'STOPPED' | 'FAILED';
  containerId?: string;
  createdAt: string;
}