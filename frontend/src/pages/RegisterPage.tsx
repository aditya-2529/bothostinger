import { Terminal } from 'lucide-react';
import { useState } from 'react';
import { authService } from '../lib/auth';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
  // onLogin: (userId: string, username: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreed) {
        setError("Please accept the Terms of Service");
        return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const data = await authService.register(username, email, password , true);
      // localStorage.setItem('userId', user.id);
      // localStorage.setItem('username', user.username);
      // onLogin(user.id, user.username);
      if (data.requireVerification) {
        setUserId(data.userId);
        setShowOtp(true); // Show OTP Modal instead of navigating
      }
      else onNavigate('login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Terminal className="w-12 h-12 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-slate-400">Create your account</p>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 border border-violet-600/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                placeholder="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-start space-x-3 pt-2">
                <input 
                    type="checkbox" 
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 select-none cursor-pointer">
                    I agree to the <button type="button" onClick={() => onNavigate('terms')} className="text-violet-400 hover:underline">Terms of Service</button> and <button type="button" onClick={() => onNavigate('privacy')} className="text-violet-400 hover:underline">Privacy Policy</button>.
                </label>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>

      {showOtp && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 p-8 rounded-xl border border-violet-500/30 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Check your Email</h2>
                <p className="text-slate-400 mb-6">We sent a 6-digit code to your email.</p>
                
                <input 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-slate-800 text-white text-2xl tracking-widest text-center w-full py-3 rounded-lg mb-4 border border-slate-700 focus:border-violet-500 outline-none"
                    placeholder="000000"
                    maxLength={6}
                />
                
                <button 
                    onClick={async () => {
                        const res = await fetch('http://localhost:3000/verify-email', {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({ userId, otp })
                        });
                        const data = await res.json();
                        if(data.success) {
                            alert("Verified!");
                            onNavigate('dashboard'); // Now go to dashboard
                        } else {
                            alert(data.error);
                        }
                    }}
                    className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 rounded-lg"
                >
                    Verify & Continue
                </button>
            </div>
        </div>
      )}
    </div>

    
  );
}
