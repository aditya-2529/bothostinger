import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';
import { SupportPage } from './pages/SupportPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { authService } from './lib/auth';
import { AdminPage } from './pages/AdminPage';
import { CookieBanner } from './components/CookieBanner';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';

type Page =
  | 'home'
  | 'about'
  | 'pricing'
  | 'support'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'admin'
  | 'terms' 
  | 'privacy';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setCurrentPage('admin');
    }
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsAuthenticated(true);
          setUserId(user._id);
          setUsername(user.username);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('username', user.username);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleNavigate = (page: any) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (id: string, name: string) => {
    setIsAuthenticated(true);
    setUserId(id);
    setUsername(name);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-violet-400 font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        username={username}
      />
      {currentPage === 'admin' && <AdminPage />}
      {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'pricing' && <PricingPage />}
      {currentPage === 'support' && <SupportPage />}
      {currentPage === 'terms' && <TermsPage />}
      {currentPage === 'privacy' && <PrivacyPage />}
      {currentPage === 'login' && (
        <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}
      {currentPage === 'register' && (
        <RegisterPage onNavigate={handleNavigate} onLogin={handleLogin} />
      )}
      {currentPage === 'dashboard' && isAuthenticated && (
        <DashboardPage userId={userId} username={username} />
      )}

      {currentPage !== 'login' && currentPage !== 'register' && (
        <Footer onNavigate={handleNavigate} />
      )}
      <CookieBanner/>
    </div>
  );
}

export default App;
