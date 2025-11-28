import { X, Terminal, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { botService } from '../lib/bots';

interface DeployModalProps {
  userId: string;
  onClose: () => void;
  onDeploy: () => void;
}

export function DeployModal({ userId, onClose, onDeploy }: DeployModalProps) {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!deploymentId) return;

    const interval = setInterval(async () => {
      const bot = await botService.getBotStatus(deploymentId);
      if (bot) {
        setStatus(bot.status);
        if (bot.status === 'RUNNING') {
          setLogs((prev) => [...prev, '✓ Bot is now running!']);
          setTimeout(() => {
            onDeploy();
            onClose();
          }, 1500);
          clearInterval(interval);
        } else if (bot.status === 'FAILED') {
          setLogs((prev) => [...prev, '✗ Deployment failed']);
          clearInterval(interval);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [deploymentId, onDeploy, onClose]);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLogs([
      '► Initializing deployment...',
      '► Cloning repository...',
      '► Installing dependencies...',
    ]);

    try {
      const bot = await botService.deployBot(userId, repoUrl);
      setDeploymentId(bot.deploymentId);
      setLogs((prev) => [
        ...prev,
        '► Building container...',
        '► Starting bot...',
      ]);
    } catch (error) {
      setLogs((prev) => [...prev, '✗ Error: ${error.message}']);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full border border-violet-600/30 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <Terminal className="w-6 h-6 text-violet-400" />
            <h2 className="text-2xl font-bold text-white">Deploy New Bot</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {!loading && !deploymentId ? (
            <form onSubmit={handleDeploy} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600 font-mono text-sm"
                  placeholder="https://github.com/username/bot-repo"
                />
                <p className="text-slate-500 text-xs mt-2">
                  Paste your GitHub repository URL. We'll automatically detect
                  Node.js or Python.
                </p>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-semibold"
              >
                Deploy Bot
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <div className="flex items-center space-x-2 mb-3">
                  <Loader className="w-5 h-5 text-violet-400 animate-spin" />
                  <span className="text-violet-400 font-mono text-sm">
                    {status || 'Deploying...'}
                  </span>
                </div>
                <div className="space-y-1 font-mono text-sm">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className={`${
                        log.startsWith('✓')
                          ? 'text-green-400'
                          : log.startsWith('✗')
                          ? 'text-red-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                  {loading && status !== 'RUNNING' && status !== 'FAILED' && (
                    <div className="text-violet-400 animate-pulse">
                      <span className="inline-block w-2 h-4 bg-violet-400 animate-pulse"></span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
