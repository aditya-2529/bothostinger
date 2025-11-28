import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { useState } from 'react';

export function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      question: 'How do I deploy my bot?',
      answer:
        'Simply sign up, go to your dashboard, click "Deploy Bot", and paste your GitHub repository URL. We handle the rest automatically!',
    },
    {
      question: 'What languages are supported?',
      answer:
        'We currently support Node.js and Python bots. The platform auto-detects your bot type and installs dependencies automatically.',
    },
    {
      question: 'How much does it cost?',
      answer:
        'We offer a free tier with 1 bot and 128MB RAM. Pro plans start at $5/month with more resources and always-on hosting.',
    },
    {
      question: 'Can I use my own domain?',
      answer:
        'Custom domains are available on Pro and Enterprise plans. You can configure them in your dashboard settings.',
    },
    {
      question: 'What is the uptime guarantee?',
      answer:
        'We guarantee 99.9% uptime on all paid plans. Free tier bots may spin down after 15 minutes of inactivity.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = Math.floor(1000 + Math.random() * 9000);
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Support Center
          </h1>
          <p className="text-xl text-slate-400">
            We're here to help you succeed
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-white font-semibold">
                    {faq.question}
                  </span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-violet-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-violet-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-slate-800 bg-slate-800/30">
                    <p className="text-slate-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 border border-violet-600/30">
          <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? Send us a message and we'll get
            back to you within 24 hours.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-600 resize-none"
                placeholder="Describe your issue or question..."
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-500 transition-colors font-semibold flex items-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
          {submitted && (
            <div className="mt-4 p-4 bg-violet-600/20 border border-violet-600/50 rounded-lg">
              <p className="text-violet-400 font-mono text-sm">
                ✓ Ticket #{Math.floor(1000 + Math.random() * 9000)} sent to
                support team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
