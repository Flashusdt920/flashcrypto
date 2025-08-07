import { Shield, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function AMLKYCPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold">AML/KYC Policy</h1>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-yellow-300 font-semibold mb-1">Compliance Notice</p>
              <p className="text-gray-300 text-sm">
                Bolt Crypto Flasher complies with international Anti-Money Laundering (AML) and 
                Know Your Customer (KYC) regulations to ensure a secure trading environment.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              Bolt Crypto Flasher ("we," "our," or "the Platform") is committed to preventing money laundering, 
              terrorist financing, and other illicit activities. This AML/KYC Policy outlines our procedures 
              for customer identification, verification, and ongoing monitoring.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">2. Customer Identification Program (CIP)</h2>
            <div className="space-y-3 text-gray-300">
              <p>All users must provide the following information during registration:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Full legal name</li>
                <li>Date of birth</li>
                <li>Residential address</li>
                <li>Email address and phone number</li>
                <li>Government-issued identification (passport, driver's license, or national ID)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">3. Verification Levels</h2>
            <div className="space-y-4">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Level 1: Basic Verification</h3>
                </div>
                <ul className="text-gray-300 text-sm space-y-1 ml-7">
                  <li>• Email verification</li>
                  <li>• Phone number verification</li>
                  <li>• Daily limit: $1,000</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Level 2: Intermediate Verification</h3>
                </div>
                <ul className="text-gray-300 text-sm space-y-1 ml-7">
                  <li>• Government ID verification</li>
                  <li>• Selfie verification</li>
                  <li>• Daily limit: $10,000</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Level 3: Full Verification</h3>
                </div>
                <ul className="text-gray-300 text-sm space-y-1 ml-7">
                  <li>• Proof of address</li>
                  <li>• Source of funds documentation</li>
                  <li>• Enhanced due diligence</li>
                  <li>• No daily limits</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">4. Transaction Monitoring</h2>
            <p className="text-gray-300 mb-4">
              We employ sophisticated monitoring systems to detect suspicious activities, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
              <li>Unusual transaction patterns or volumes</li>
              <li>Transactions involving high-risk jurisdictions</li>
              <li>Rapid movement of funds</li>
              <li>Structuring or layering attempts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">5. Reporting Obligations</h2>
            <p className="text-gray-300 mb-4">
              We are required to report suspicious activities to relevant authorities, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
              <li>Suspicious Activity Reports (SARs)</li>
              <li>Currency Transaction Reports (CTRs) for transactions over $10,000</li>
              <li>International wire transfer reports</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">6. Prohibited Activities</h2>
            <p className="text-gray-300 mb-4">The following activities are strictly prohibited:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
              <li>Money laundering or terrorist financing</li>
              <li>Fraudulent activities or scams</li>
              <li>Trading on behalf of sanctioned individuals or entities</li>
              <li>Circumventing KYC procedures</li>
              <li>Using the platform for illegal gambling or darknet purchases</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">7. Record Keeping</h2>
            <p className="text-gray-300">
              We maintain records of all customer identification documents, transaction history, 
              and correspondence for a minimum of five years after account closure, in compliance 
              with regulatory requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">8. Compliance Officer</h2>
            <p className="text-gray-300">
              Our designated AML/KYC Compliance Officer oversees the implementation of this policy 
              and ensures ongoing compliance with all applicable regulations. For compliance-related 
              inquiries, please contact: compliance@boltflasher.live
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">9. Updates to This Policy</h2>
            <p className="text-gray-300">
              This policy may be updated periodically to reflect changes in regulations or our 
              internal procedures. Users will be notified of significant changes via email.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold">Last Updated</h3>
          </div>
          <p className="text-gray-400">Effective Date: January 1, 2025</p>
          <p className="text-gray-400">Version: 2.0</p>
        </div>
      </div>
    </div>
  );
}