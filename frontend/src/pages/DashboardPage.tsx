import { useState, useEffect } from 'react';
import {
  Wallet,
  Activity,
  Server,
  Plus,
  RefreshCw, Clock, CheckCircle, XCircle, PlusCircle, Coins, Play
} from 'lucide-react';
import { botService } from '../lib/bots';
import { Bot } from '../lib/mongoapi';
import { BotCard } from '../components/BotCard';
import { DeployModal } from '../components/DeployModal';
import { authService } from '../lib/auth';
import { LogModal } from '../components/LogModal';
import { AddFundsModal } from '../components/AddFundsModals';
import { EarnModal } from '../components/EarnModal';
import { AgentChat } from '../components/AgentChat';

const getPlanLimits = (plan: string) => {
    if (plan === 'enterprise') return { max: '∞', ram: '1GB' };
    if (plan === 'pro') return { max: 5, ram: '512MB' };
    return { max: 1, ram: '128MB' };
};
interface DashboardPageProps {
  userId: string;
  username: string;
}
interface Transaction {
  _id: string;
  amount: number;
  status: string;
  utr: string;
  createdAt: string;
}

export function DashboardPage({ userId, username }: DashboardPageProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logViewer, setLogViewer] = useState<{id: string, name: string} | null>(null);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [coins, setCoins] = useState(0);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [userPlan, setUserPlan] = useState('free');

  const loadData = async () => {
    try {
      const [botsData, userData , txData ] = await Promise.all([
        botService.getBots(userId),
        authService.getCurrentUser(), // This now fetches fresh balance
        authService.getTransactions(userId)
      ]);
      setBots(botsData);
      if (userData) {
        setBalance(userData.balance);
        setTransactions(txData);
        setBalance(userData.balance);
        setCoins(userData.coins || 0);
        setUserPlan(userData.plan);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const limits = getPlanLimits(userPlan);

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
  };
  const getTxColor = (status: string) => {
    if (status === 'APPROVED') return 'text-green-400';
    if (status === 'PENDING') return 'text-yellow-400';
    return 'text-red-400';
  };
  const handleStart = async (deploymentId: string) => {
    try {
      await botService.startBot(deploymentId);
      await loadData();
    } catch (error) {
      console.error('Error starting bot:', error);
    }
  };

  const handleStop = async (deploymentId: string) => {
    try {
      await botService.stopBot(deploymentId);
      await loadData();
    } catch (error) {
      console.error('Error stopping bot:', error);
    }
  };

  const handleDelete = async (deploymentId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this bot? This action cannot be undone.'
      )
    )
      return;
    try {
      await botService.deleteBot(deploymentId);
      await loadData();
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  const activeBots = bots.filter((bot) => bot.status === 'RUNNING').length;
  const totalRam = bots.length * 128;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-400">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hello, <span className="text-violet-400">{username}</span>
          </h1>
          <span className="px-3 py-1 bg-violet-600 rounded-full text-xs font-bold text-white uppercase tracking-wider">
              {userPlan} Plan
          </span>

          <p className="text-slate-400">Manage your bot deployments</p>
          <p className="text-slate-400">
              Usage: {bots.length} / {limits.max} Bots • {limits.ram} RAM each
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
            <div className={`inline-flex p-3 rounded-lg text-violet-400 bg-violet-400/10 mb-4`}>
              {<Wallet className="w-6 h-6" />}
            </div>
            <p className="text-slate-400 text-sm mb-1">{"Balance"}</p>
            <p className="text-3xl font-bold text-white">{`$${balance.toFixed(2)}`}</p>
            <div className="flex items-center justify-between">
                      <button 
                          onClick={() => setShowFundsModal(true)}
                          className="flex items-center gap-1 bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                          <PlusCircle className="w-4 h-4" /> Add Funds
                      </button>
                  </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 relative overflow-hidden">
              <div className="inline-flex p-3 rounded-lg text-yellow-400 bg-yellow-400/10 mb-4">
                  <Coins className="w-6 h-6" />
              </div>
              <p className="text-slate-400 text-sm mb-1">BotCoins</p>
              <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-white">{coins}</p>
                  <button 
                      onClick={() => setShowEarnModal(true)}
                      className="flex items-center gap-1 bg-yellow-600 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                  >
                      <Play className="w-3 h-3 fill-black" /> Earn Free
                  </button>
              </div>
          </div>
            
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Active Bots"
            value={activeBots.toString()}
            color="green"
          />
          <StatCard
            icon={<Server className="w-6 h-6" />}
            label="Total RAM"
            value={`${totalRam}MB`}
            color="blue"
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Bots</h2>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-slate-800 text-violet-400 rounded-lg hover:bg-slate-700 transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowDeployModal(true)}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Deploy Bot</span>
            </button>
          </div>
        </div>

        {bots.length === 0 ? (
          <div className="bg-slate-900 rounded-xl p-12 border border-slate-800 text-center">
            <Server className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              No bots deployed yet
            </h3>
            <p className="text-slate-400 mb-6">
              Deploy your first bot to get started
            </p>
            <button
              onClick={() => setShowDeployModal(true)}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-semibold"
            >
              Deploy Your First Bot
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bots.map((bot) => (
              <BotCard
                key={bot._id}
                bot={bot}
                onStart={handleStart}
                onStop={handleStop}
                onDelete={handleDelete}
                onViewLogs={() => setLogViewer({ 
                id: bot.deploymentId,
                name: bot.repoUrl.split('/').pop() || 'unknown-bot' 
            })}
              />
            ))}
          </div>
        )}
      </div>
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-white mb-6">Billing History</h2>
        
        {transactions.length === 0 ? (
          <p className="text-slate-500">No transactions yet.</p>
        ) : (
          <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-400 text-sm font-mono uppercase">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">UTR Ref</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-white">₹{tx.amount}</td>
                    <td className="p-4 font-mono text-xs text-slate-500">{tx.utr}</td>
                    <td className="p-4">
                      <div className={`flex items-center gap-2 font-bold text-xs ${getTxColor(tx.status)}`}>
                        {tx.status === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
                        {tx.status === 'PENDING' && <Clock className="w-4 h-4" />}
                        {tx.status === 'REJECTED' && <XCircle className="w-4 h-4" />}
                        {tx.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AgentChat userId={userId} />
      </div>


        {showEarnModal && userId && (
          <EarnModal 
              userId={userId}
              onClose={() => setShowEarnModal(false)}
          />
        )}
      {showFundsModal && (
        <AddFundsModal
          userId={userId}
          onClose={() => setShowFundsModal(false)}
          onSuccess={() => {
             alert("Deposit submitted! Wait for admin approval.");
             loadData(); // Refresh balance check
          }}
        />
      )}

      {showDeployModal && (
        <DeployModal
          userId={userId}
          onClose={() => setShowDeployModal(false)}
          onDeploy={loadData}
        />
      )}

      {/* NEW LOG MODAL LOGIC */}
      {logViewer && (
        <LogModal
          deploymentId={logViewer.id}
          repoName={logViewer.name}
          onClose={() => setLogViewer(null)}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'violet' | 'green' | 'blue';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    violet: 'text-violet-400 bg-violet-400/10',
    green: 'text-green-400 bg-green-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
