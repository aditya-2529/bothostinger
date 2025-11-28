export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-slate-900 rounded-xl p-8 border border-slate-800 text-slate-300">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Data:</strong> Username, Email address, and Password (encrypted).</li>
            <li><strong>Usage Data:</strong> IP logs, Docker container logs, and deployment history.</li>
            <li><strong>Payment Data:</strong> We store Transaction IDs (UTR) for UPI verification. We do NOT store bank account numbers or UPI PINs.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">2. How We Use Your Data</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide and maintain the hosting service.</li>
            <li>Verify payments and credit "Coins" to your account.</li>
            <li>Prevent abuse (e.g., banning IPs that deploy malware).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">3. Third-Party Services (Lootably)</h2>
          <p>We use third-party services like Lootably to provide "Offer Walls" for earning free Coins.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
             <li>When you use the Offer Wall, we share your unique User ID with Lootably so they can credit your reward.</li>
             <li>Lootably may collect its own data (device ID, location) to serve relevant offers. Please review <a href="https://lootably.com/privacy" className="text-violet-400 hover:underline" target="_blank">Lootably's Privacy Policy</a>.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">4. Data Security</h2>
          <p>We use industry-standard encryption for passwords (bcrypt) and secure connections (SSL/TLS) for all data transfer.</p>
        </section>
      </div>
    </div>
  );
}