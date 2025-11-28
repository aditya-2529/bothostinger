import { API_URL, handleResponse} from './mongoapi';

export const authService = {
  async register(username: string, email: string, password: string, termsAccepted: boolean) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password , termsAccepted}),
    });

    const data = await handleResponse(response);
    
    // Auto-login (save to localStorage) after register if your flow supports it,
    // otherwise the user will just redirect to login.
    return data;
  },
  async getCurrentUser() {
    const userId = localStorage.getItem('userId');
    if (!userId) return null;

    try {
      // FIX: Fetch fresh data from server
      const res = await fetch(`${API_URL}/user/${userId}`);
      const userData = await handleResponse(res);
      // console.log(userData)
      return {
        _id: userData._id,
        username: userData.username,
        email: userData.email,
        balance: userData.balance,
        coins: userData.coins,
        plan: userData.plan,
      };
    } catch (err) {
      return null;
    }
  },
  
  // NEW: Helper to get transactions
  async getTransactions(userId: string) {
    const res = await fetch(`${API_URL}/transactions/${userId}`);
    const data = await handleResponse(res);
    return data.transactions || [];
  },
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    // Save session to LocalStorage
    if (data.success) {
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
    }

    return {
      _id: data.userId,
      username: data.username,
      email: email,
      balance: 0
    };
  },
  async purchasePlan(userId: string, planName: string, price: number) {
    const res = await fetch(`${API_URL}/purchase-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planName, price }),
    });
    return handleResponse(res);
  },

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    // Optional: Redirect to login page here if you have access to router
    window.location.href = '/login';
  }
};