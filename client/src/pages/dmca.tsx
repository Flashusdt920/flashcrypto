import { Copyright, Mail, FileText, AlertTriangle } from 'lucide-react';

export default function DMCANotice() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Copyright className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold">DMCA Notice</h1>
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-blue-300 font-semibold mb-1">Copyright Protection</p>
              <p className="text-gray-300 text-sm">
                Bolt Crypto Flasher respects intellectual property rights and complies with the 
                Digital Millennium Copyright Act (DMCA).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Notice and Takedown Procedure</h2>
            <p className="text-gray-300 mb-4">
              If you believe that content on our platform infringes your copyright, please provide 
              our designated DMCA agent with the following information:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-300">
              <li>A physical or electronic signature of the copyright owner or authorized representative</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Identification of the material that is claimed to be infringing, including its location on our platform</li>
              <li>Your contact information (address, telephone number, and email address)</li>
              <li>A statement that you have a good faith belief that the disputed use is not authorized</li>
              <li>A statement that the information in the notification is accurate, under penalty of perjury</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Designated DMCA Agent</h2>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white font-semibold">Legal Department - DMCA Agent</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Organization</p>
                  <p className="text-white font-semibold">Bolt Crypto Flasher</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-400" />
                    dmca@boltflasher.live
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address</p>
                  <p className="text-white font-semibold">
                    123 Blockchain Avenue<br />
                    Crypto Valley, CV 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Counter-Notification Procedure</h2>
            <p className="text-gray-300 mb-4">
              If you believe your content was removed in error, you may submit a counter-notification 
              containing:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 text-gray-300">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that was removed and its location before removal</li>
              <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
              <li>Your name, address, telephone number, and email address</li>
              <li>A statement consenting to jurisdiction in your federal district court</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Repeat Infringer Policy</h2>
            <p className="text-gray-300">
              In accordance with the DMCA and other applicable laws, we have adopted a policy of 
              terminating, in appropriate circumstances, users who are deemed to be repeat infringers. 
              We may also, at our sole discretion, limit access to the platform and/or terminate the 
              accounts of users who infringe any intellectual property rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Fair Use</h2>
            <p className="text-gray-300">
              We respect fair use provisions under copyright law. However, determination of fair use 
              is complex and fact-specific. Users are responsible for ensuring their use of copyrighted 
              material complies with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">False Claims</h2>
            <p className="text-gray-300">
              Please note that under Section 512(f) of the DMCA, any person who knowingly materially 
              misrepresents that material is infringing, or that material was removed by mistake or 
              misidentification, may be liable for damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Modifications</h2>
            <p className="text-gray-300">
              We reserve the right to modify this DMCA Notice at any time. Changes will be effective 
              immediately upon posting to the platform.
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-6 h-6 text-purple-400" />
            <h3 className="text-lg font-semibold">Document Information</h3>
          </div>
          <p className="text-gray-400">Last Updated: January 8, 2025</p>
          <p className="text-gray-400">Effective Date: January 1, 2025</p>
        </div>
      </div>
    </div>
  );
}