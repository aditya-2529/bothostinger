import { Terminal, LogOut } from 'lucide-react';
import { authService } from '../lib/auth';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  username?: string;
}

export function Navbar({
  currentPage,
  onNavigate,
  isAuthenticated,
  username,
}: NavbarProps) {
  const handleLogout = async () => {
    await authService.logout();
    localStorage.clear();
    onNavigate('home');
  };

  return (
    <nav className="bg-slate-900 border-b border-violet-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 text-violet-400 hover:text-violet-300 transition-colors"
            >
              <Terminal className="w-6 h-6" />
              <span className="font-bold text-xl font-mono">BotHostinger</span>
            </button>
            <div className="hidden md:flex space-x-6">
              <NavLink
                onClick={() => onNavigate('about')}
                active={currentPage === 'about'}
              >
                About
              </NavLink>
              <NavLink
                onClick={() => onNavigate('pricing')}
                active={currentPage === 'pricing'}
              >
                Pricing
              </NavLink>
              <NavLink
                onClick={() => onNavigate('support')}
                active={currentPage === 'support'}
              >
                Support
              </NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium"
                >
                  Dashboard
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-400 font-mono text-sm">
                    {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-violet-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-violet-400 hover:text-violet-300 transition-colors font-medium"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        active
          ? 'text-violet-400'
          : 'text-slate-400 hover:text-violet-400'
      }`}
    >
      {children}
    </button>
  );
}
