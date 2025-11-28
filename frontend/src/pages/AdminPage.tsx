import { useState, useEffect } from 'react';
import { Check, X, Shield, RefreshCw, Clock } from 'lucide-react';
import { API_URL } from '../lib/mongoapi';

interface Transaction {
  _id: string;
  amount: number;
  utr: string;
  status: string;
  createdAt: string;
  user: {
    username: string;
    email: string;
  };
}

export function AdminPage() {
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check localStorage for saved secret on load
  useEffect(() => {
    const savedSecret = localStorage.getItem('adminSecret');
    if (savedSecret) {
      setSecret(savedSecret);
      fetchTransactions(savedSecret);
    }
  }, []);

  const fetchTransactions = async (adminKey: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/admin/transactions?secret=${adminKey}`);
      if (res.status === 403) throw new Error("Invalid Admin Secret");
      
      const data = await res.json();
      setTransactions(data.transactions || []);
      setIsAuthenticated(true);
      localStorage.setItem('adminSecret', adminKey); // Save login
    } catch (err: any) {
      setError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTransactions(secret);
  };

  const handleApprove = async (txId: string) => {
    if (!confirm("Confirm that you received this money in your bank?")) return;

    try {
      const res = await fetch(`${API_URL}/admin/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txId, secret }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Approved! Balance added to user.");
        fetchTransactions(secret); // Refresh list
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      alert("Failed to approve");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-xl p-8 border border-slate-800">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-red-500/10 rounded-full">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter Admin Secret"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-red-500 outline-none"
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 font-bold"
            >
              {loading ? 'Checking...' : 'Access Panel'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Payment Approvals</h1>
            <p className="text-slate-400">Verify UPI Transactions manually</p>
          </div>
          <button 
            onClick={() => fetchTransactions(secret)}
            className="p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-12 text-center border border-slate-800">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">All Caught Up!</h3>
            <p className="text-slate-400">No pending transactions to verify.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {transactions.map((tx) => (
              <div key={tx._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-xs font-bold uppercase">
                      {tx.status}
                    </span>
                    <span className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(tx.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg">₹{tx.amount}</h3>
                  <p className="text-slate-400 text-sm">
                    UTR: <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded">{tx.utr}</span>
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    User: {tx.user?.username} ({tx.user?.email})
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => handleApprove(tx._id)}
                    className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  {/* Reject button could be added here later */}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}