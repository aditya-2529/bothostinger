import { X, RefreshCw, Terminal, Copy } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { botService } from '../lib/bots';

interface LogModalProps {
  deploymentId: string;
  repoName: string;
  onClose: () => void;
}

export function LogModal({ deploymentId, repoName, onClose }: LogModalProps) {
  const [logs, setLogs] = useState<string>('Loading logs...');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const logData = await botService.getBotLogs(deploymentId);
      setLogs(logData || 'No output yet...');
    } catch (error) {
      setLogs('Error fetching logs. The container might be stopped.');
    }
  };

  useEffect(() => {
    fetchLogs();
    // Poll every 2 seconds for "Live" feel
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [deploymentId]);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-950 w-full max-w-4xl rounded-xl border border-slate-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Terminal className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-white font-mono font-bold text-sm">root@bothost:~/{repoName}</h3>
              <p className="text-slate-500 text-xs font-mono">ID: {deploymentId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Terminal Window */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-[#0c0c0c] p-6 overflow-y-auto font-mono text-sm leading-relaxed"
        >
          <pre className="whitespace-pre-wrap text-green-500/90 font-medium font-mono text-[13px]">
            {logs}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span>Live Connection</span>
          </div>
          <div>Auto-refreshing (2s)</div>
        </div>
      </div>
    </div>
  );
}