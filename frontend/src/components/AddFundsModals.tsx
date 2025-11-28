import { X, QrCode, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from '../lib/mongoapi'; // Your API config

interface AddFundsModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFundsModal({ userId, onClose, onSuccess }: AddFundsModalProps) {
  const [amount, setAmount] = useState('250'); // Default ₹250
  const [utr, setUtr] = useState('');
  const [step, setStep] = useState<'input' | 'success'>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // YOUR PERSONAL UPI ID HERE
  const myUpiId = "ranjan@upi"; 
  const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${myUpiId}&pn=BotHost&am=${amount}&cu=INR`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount: Number(amount), utr }),
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setStep('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-900 w-full max-w-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h3 className="text-white font-bold text-lg">Add Funds (UPI)</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="p-6">
          {step === 'input' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Amount Selector */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">Amount (INR)</label>
                <div className="grid grid-cols-3 gap-3">
                  {['100', '250', '500'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 rounded-lg text-sm font-medium transition-all ${
                        amount === val 
                        ? 'bg-violet-600 text-white ring-2 ring-violet-400' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code Display */}
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl">
                <img src={qrLink} alt="Scan to Pay" className="w-48 h-48" />
                <p className="text-slate-900 text-xs font-bold mt-2">Scan with GPay / PhonePe</p>
              </div>

              {/* UTR Input */}
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Transaction ID / UTR Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 328401849201"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-violet-500 outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter the 12-digit UTR number from your payment app.
                </p>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 font-bold disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'I have Paid'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Payment Submitted!</h4>
              <p className="text-slate-400 text-sm">
                We are verifying your transaction. Your balance will update within 1-2 hours.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}