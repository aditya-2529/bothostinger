import { X, ShieldCheck } from 'lucide-react';

interface EarnModalProps {
  userId: string;
  onClose: () => void;
}

export function EarnModal({ userId, onClose }: EarnModalProps) {
  // 1. You will get this ID when you sign up at lootably.com
  // For now, use 'demo' or leave blank to see how it looks
  const PLACEMENT_ID = "YOUR_LOOTABLY_PLACEMENT_ID"; 
  
  // 2. We pass the 'userId' as 'sid' (Sub ID). 
  // Lootably will send this back to our server so we know who to credit.
  const offerWallUrl = `https://wall.lootably.com/?placementID=${PLACEMENT_ID}&sid=${userId}`;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-xl relative overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <h3 className="font-bold text-lg">Task Wall</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* The Offer Wall Iframe */}
        <div className="flex-1 bg-slate-50 relative">
          <iframe 
            src={offerWallUrl}
            className="w-full h-full border-0 absolute inset-0"
            title="Offer Wall"
            allow="camera; microphone; geolocation" // Some offers need these
          />
        </div>
        
        {/* Footer Hint */}
        <div className="bg-slate-900 p-3 text-center border-t border-slate-800">
          <p className="text-xs text-slate-400">
            <span className="text-yellow-400 font-bold">Note:</span> Coins appear automatically after the advertiser verifies your task. This can take 5 minutes to 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}