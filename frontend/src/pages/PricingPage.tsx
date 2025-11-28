import { Check, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AddFundsModal } from '../components/AddFundsModals';
import { authService } from '../lib/auth';

export function PricingPage() {
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);
  const [purchasing, setPurchasing] = useState('');

  // Check if user is logged in when page loads
  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    setUserId(storedId);
    const fetchUserData = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setUserId(user._id);
        setBalance(user.balance);
      }
    };
    fetchUserData();
  }, []);

  const handleBuyClick = async (planName: string, price: number) => {
    if (!userId) {
      // If not logged in, redirect to login
      window.location.href = '/login';
      return;
    }
    if (balance < price) {
        // Not enough money, open add funds modal
        alert(`Insufficient balance (₹${balance}). Please add ₹${price - balance} more.`);
        setShowFundsModal(true);
        return;
    }

    if (!confirm(`Are you sure you want to buy the ${planName} plan for ₹${price}?`)) return;

    setPurchasing(planName);
    try {
      const data = await authService.purchasePlan(userId, planName, price);
      alert(data.message);
      window.location.href = '/dashboard'; // Redirect to dashboard on success
    } catch (error: any) {
      alert(error.message);
    } finally {
      setPurchasing('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-400">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FREE PLAN */}
          <PricingCard
            name="Hobby"
            price="Free"
            description="Perfect for testing and small projects"
            features={[
              '1 Bot',
              '128MB RAM',
              'Spins down after 15 minutes',
              'Community support',
              'Basic monitoring',
            ]}
            onClick={() => (window.location.href = '/dashboard')} // Free users just register
            buttonText={userId ? "Go to Dashboard" : "Get Started"}
          />

          {/* PRO PLAN */}
          <PricingCard
            name="Pro"
            price="₹250" // Updated to INR since we use UPI
            period="/month"
            description="Best for serious developers"
            features={[
              '5 Bots',
              '512MB RAM per bot',
              'Always On',
              'Priority support',
              'Advanced monitoring',
              'Custom domains',
            ]}
            onClick={() => handleBuyClick('Pro', 250)} // Open Modal
            buttonText="Buy Pro"
            highlighted
            loading={purchasing === 'Pro'}
          />

          {/* ENTERPRISE PLAN */}
          <PricingCard
            name="Enterprise"
            price="₹1000"
            period="/month"
            description="For teams and power users"
            features={[
              'Unlimited Bots',
              '1GB RAM per bot',
              'Always On',
              'Dedicated support',
              'Advanced analytics',
              'SLA guarantee',
              'Custom integrations',
            ]}
            onClick={() => handleBuyClick('Enterprise', 1000)} // Call handler
          buttonText="Buy Enterprise"
          loading={purchasing === 'Enterprise'}
          />
        </div>
      </div>

      {/* SHOW ADD FUNDS MODAL IF LOGGED IN */}
      {showFundsModal && userId && (
         <AddFundsModal 
           userId={userId}
           onClose={() => setShowFundsModal(false)}
           onSuccess={() => window.location.reload()} // Reload to get new balance
         />
      )}

    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  onClick: () => void;
  buttonText: string;
  highlighted?: boolean;
  loading?: boolean;
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  onClick,
  buttonText,
  highlighted,
  loading,
}: PricingCardProps) {
  return (
    <div
      className={`bg-slate-900 rounded-xl p-8 border ${
        highlighted
          ? 'border-violet-600 ring-2 ring-violet-600/50 shadow-lg shadow-violet-600/20'
          : 'border-slate-800'
      } relative transition-transform hover:scale-105 duration-300`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-600 text-white text-sm font-bold rounded-full">
          POPULAR
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-4xl font-bold text-white">{price}</span>
          {period && <span className="text-slate-400 ml-2">{period}</span>}
        </div>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        disabled={loading} // Disable while loading
        className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
          highlighted
            ? 'bg-violet-600 text-white hover:bg-violet-500'
            : 'bg-slate-800 text-violet-400 hover:bg-slate-700'
        } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : buttonText}
      </button>
    </div>
  );
}