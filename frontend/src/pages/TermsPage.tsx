export function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-800 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        <p className="mb-4 text-sm text-slate-500">Last Updated: November 2025</p>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using BotHost ("the Service"), you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">2. Description of Service</h2>
          <p>BotHost provides a Platform-as-a-Service (PaaS) for hosting Discord bots and other applications. We provide the infrastructure (Docker containers), but you are solely responsible for the code you deploy.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">3. Virtual Currency ("Coins")</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>"Coins" are a virtual utility token used solely within BotHost to redeem hosting time or upgrades.</li>
            <li>Coins have <strong>no real-world monetary value</strong> and cannot be exchanged for cash, INR, USD, or any other currency.</li>
            <li>We reserve the right to modify the Coin cost of plans or the amount earned from ads at any time without notice.</li>
            <li>If your account is terminated for violating terms, all Coins are forfeited.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">4. User Conduct & Prohibited Use</h2>
          <p>You agree NOT to deploy:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Crypto miners, DDoS scripts, or malware.</li>
            <li>Phishing sites or scam bots.</li>
            <li>Content that violates Discord's Terms of Service or Indian Laws (IT Act, 2000).</li>
          </ul>
          <p className="mt-2 text-red-400">Violation of this section will result in immediate account termination without refund.</p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">5. Limitation of Liability</h2>
          <p>The Service is provided "AS IS" and "AS AVAILABLE". We do not guarantee 100% uptime. We are not liable for any data loss, bot downtime, or lost profits resulting from the use of our Service.</p>
        </section>
      </div>
    </div>
  );
}