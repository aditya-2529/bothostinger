import { Heart, Target, Users } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-slate-400">
            Making bot hosting accessible for everyone
          </p>
        </div>

        <div className="bg-slate-900 rounded-xl p-8 border border-violet-600/30 mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Target className="w-12 h-12 text-violet-400" />
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">
            BotHostinger was created to solve a simple problem: hosting Discord
            bots shouldn't be complicated or expensive. We believe that every
            developer, regardless of their experience level, should have access
            to reliable, affordable bot hosting.
          </p>
          <p className="text-slate-400 leading-relaxed">
            Our platform eliminates the technical barriers of deployment,
            allowing you to focus on what matters most – building amazing bots
            for your community.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <ValueCard
            icon={<Heart className="w-8 h-8" />}
            title="Community First"
            description="Built by developers, for developers. We listen to our community."
          />
          <ValueCard
            icon={<Target className="w-8 h-8" />}
            title="Simplicity"
            description="Complex infrastructure made simple. Deploy with one click."
          />
          <ValueCard
            icon={<Users className="w-8 h-8" />}
            title="Reliability"
            description="99.9% uptime guarantee. Your bots stay online, always."
          />
        </div>

        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-6">
            Meet the Developer
          </h2>
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-violet-400 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
              BH
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                Development Team
              </h3>
              <p className="text-slate-400 leading-relaxed">
                A passionate team of developers dedicated to making bot hosting
                accessible and affordable. With years of experience in cloud
                infrastructure and Discord bot development, we understand the
                challenges developers face and built BotHostinger to solve them.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
      <div className="text-violet-400 flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}
