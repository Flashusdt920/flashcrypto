import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy - Bolt Flasher";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </Link>

        <div className="bg-black/50 backdrop-blur-sm rounded-lg border border-purple-500/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">1. Information We Collect</h2>
              <p className="text-gray-300">We collect the following types of information:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li><strong>Account Information:</strong> Username, email address, password (encrypted)</li>
                <li><strong>Transaction Data:</strong> Cryptocurrency addresses, transaction amounts, timestamps</li>
                <li><strong>Usage Data:</strong> IP addresses, browser type, device information, access times</li>
                <li><strong>Payment Information:</strong> Cryptocurrency wallet addresses, transaction hashes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-300">We use collected information to:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Provide and maintain our Service</li>
                <li>Process transactions and subscriptions</li>
                <li>Send important service notifications</li>
                <li>Improve and optimize our platform</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">3. Data Security</h2>
              <p className="text-gray-300">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Encrypted password storage using bcrypt</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal information</li>
                <li>Secure data centers with 24/7 monitoring</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">4. Data Sharing</h2>
              <p className="text-gray-300">
                We do not sell, trade, or rent your personal information. We may share data only:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers under strict confidentiality agreements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">5. Cookies and Tracking</h2>
              <p className="text-gray-300">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Maintain user sessions</li>
                <li>Remember user preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve user experience</li>
              </ul>
              <p className="text-gray-300 mt-2">
                You can control cookies through your browser settings, but disabling them may limit functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">6. Your Rights</h2>
              <p className="text-gray-300">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request data deletion (subject to legal requirements)</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Lodge a complaint with supervisory authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">7. Data Retention</h2>
              <p className="text-gray-300">
                We retain personal information for as long as necessary to provide our services and comply 
                with legal obligations. Transaction records are kept for 7 years for regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">8. International Transfers</h2>
              <p className="text-gray-300">
                Your data may be transferred to and processed in countries other than your own. We ensure 
                appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-300">
                Our Service is not intended for users under 18 years of age. We do not knowingly collect 
                information from minors.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">10. Updates to This Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy periodically. We will notify you of significant changes 
                via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">11. Contact Us</h2>
              <p className="text-gray-300">
                For privacy-related questions or concerns:
                <br />Email: privacy@boltflasher.live
                <br />Telegram: @boltflasher
                <br />Response time: Within 48 hours
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Last updated: January 8, 2025
                <br />Effective date: January 1, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}