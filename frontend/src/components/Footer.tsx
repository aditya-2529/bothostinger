import { Github, Twitter, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-violet-600/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-violet-400 font-bold text-lg mb-4 font-mono">
              BotHostinger
            </h3>
            <p className="text-slate-400 text-sm">
              24/7 bot hosting made simple. Deploy your Discord bots with zero
              configuration.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('about')}
                className="block text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className="block text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => onNavigate('support')}
                className="block text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                Support
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-700 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 BotHostinger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
