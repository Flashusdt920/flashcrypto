import { useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service - Bolt Flasher";
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
          <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using Bolt Flasher ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">2. Description of Service</h2>
              <p className="text-gray-300">
                Bolt Flasher provides cryptocurrency flash transaction services for testing and demonstration purposes. 
                The Service allows users to create temporary blockchain transactions that appear in wallets but are not 
                permanently recorded on the blockchain.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">3. User Responsibilities</h2>
              <p className="text-gray-300">Users must:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Provide accurate and complete information</li>
                <li>Maintain the confidentiality of account credentials</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to manipulate or exploit the Service</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">4. Prohibited Uses</h2>
              <p className="text-gray-300">You may not use the Service to:</p>
              <ul className="list-disc list-inside text-gray-300 ml-4 space-y-2">
                <li>Engage in fraudulent or deceptive activities</li>
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malicious code or viruses</li>
                <li>Attempt unauthorized access to our systems</li>
                <li>Harass, abuse, or harm other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">5. Payment Terms</h2>
              <p className="text-gray-300">
                All subscription payments are processed in cryptocurrency (USDT TRC-20). Payments are non-refundable 
                except as required by law. Users must verify transaction details before submitting payment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">6. Disclaimer of Warranties</h2>
              <p className="text-gray-300">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-300">
                IN NO EVENT SHALL BOLT FLASHER BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL 
                DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">8. Indemnification</h2>
              <p className="text-gray-300">
                You agree to indemnify and hold harmless Bolt Flasher from any claims, damages, or expenses 
                arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">9. Termination</h2>
              <p className="text-gray-300">
                We reserve the right to terminate or suspend your account at any time for violation of these 
                Terms or for any other reason at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">10. Changes to Terms</h2>
              <p className="text-gray-300">
                We may update these Terms at any time. Continued use of the Service after changes constitutes 
                acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-purple-400 mb-3">11. Contact Information</h2>
              <p className="text-gray-300">
                For questions about these Terms, contact us at:
                <br />Email: support@boltflasher.live
                <br />Telegram: @boltflasher
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                Last updated: January 8, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}