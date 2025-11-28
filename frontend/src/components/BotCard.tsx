import { Play, Square, Trash2, Clock, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Bot } from '../lib/mongoapi';
import { Terminal } from 'lucide-react';

interface BotCardProps {
  bot: Bot;
  onStart: (deploymentId: string) => void;
  onStop: (deploymentId: string) => void;
  onDelete: (deploymentId: string) => void;
  onViewLogs: (deploymentId: string) => void;
}

export function BotCard({ bot, onStart, onStop, onDelete, onViewLogs }: BotCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'text-green-400 bg-green-400/10 border-green-400/50';
      case 'STOPPED':
        return 'text-red-400 bg-red-400/10 border-red-400/50';
      case 'BUILDING':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/50';
      case 'QUEUED':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/50';
      case 'FAILED':
        return 'text-red-400 bg-red-400/10 border-red-400/50';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <CheckCircle className="w-4 h-4" />;
      case 'STOPPED':
        return <XCircle className="w-4 h-4" />;
      case 'BUILDING':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'QUEUED':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const extractRepoName = (url: string) => {
    const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
    return match ? match[1].replace('.git', '') : url;
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 hover:border-violet-600/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            {extractRepoName(bot.repoUrl)}
          </h3>
          <p className="text-slate-400 text-sm font-mono truncate">
            ID: {bot.deploymentId}
          </p>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(
            bot.status
          )}`}
        >
          {getStatusIcon(bot.status)}
          <span className="text-sm font-medium">{bot.status}</span>
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-800 rounded-lg">
        <p className="text-slate-400 text-xs mb-1">Repository</p>
        <p className="text-violet-400 text-sm font-mono truncate">
          {bot.repoUrl}
        </p>
      </div>

      <div className="flex space-x-2">
        {bot.status === 'STOPPED' && (
          <button
            onClick={() => onStart(bot.deploymentId)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>Start</span>
          </button>
        )}
        {bot.status === 'RUNNING' && (
          <button
            onClick={() => onStop(bot.deploymentId)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors"
          >
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </button>
        )}
        <button
          onClick={() => onDelete(bot.deploymentId)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onViewLogs(bot.deploymentId)}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          title="View Logs"
        >
          <Terminal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
