import { Terminal, Zap, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-violet-600/20 border border-violet-600/30 rounded-full">
              <span className="text-violet-400 text-sm font-mono">
                ► Beta Access Available
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Host your Discord Bot
              <span className="block text-violet-400">in 1 Click</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              24/7 Uptime. No config. Just push code.
              <br />
              Deploy in seconds, not hours.
            </p>
            <button
              onClick={() => onNavigate('register')}
              className="px-8 py-4 bg-violet-600 text-white text-lg font-semibold rounded-lg hover:bg-violet-500 transition-all transform hover:scale-105 shadow-lg shadow-violet-600/50"
            >
              Start Hosting for Free →
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="w-10 h-10" />}
            title="Zero Config"
            description="Auto-detects Node.js and Python. No complex setup or configuration required."
          />
          <FeatureCard
            icon={<Clock className="w-10 h-10" />}
            title="Always On"
            description="We handle automatic restarts and keep your bots running 24/7 without interruption."
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10" />}
            title="DDoS Protection"
            description="Enterprise-grade security with safe IPs and built-in attack prevention."
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-slate-900 rounded-2xl p-12 border border-violet-600/30 text-center">
          <Terminal className="w-16 h-16 text-violet-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Deploy in Under 30 Seconds
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Just paste your GitHub repository URL and we'll handle the rest.
            Automatic builds, deployment, and monitoring included.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-500 transition-colors"
          >
            Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 hover:border-violet-600/50 transition-all">
      <div className="text-violet-400 mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
