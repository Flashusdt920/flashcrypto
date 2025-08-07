import { Link } from 'wouter';
import { Shield, Mail, MessageCircle, FileText, HelpCircle, RefreshCw, Lock } from 'lucide-react';
import { TrustBadges } from './TrustSignals';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/60 backdrop-blur-sm border-t border-purple-500/20 mt-20">
      {/* Trust Badges Section */}
      <div className="border-b border-purple-500/10">
        <TrustBadges />
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BF</span>
              </div>
              <span className="text-xl font-bold text-white">Bolt Flasher</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Professional cryptocurrency flash transaction platform trusted by thousands worldwide.
            </p>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure & Encrypted</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <a className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/refund">
                  <a className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Refund Policy
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq">
                  <a className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <a href="mailto:DS3183452@gmail.com" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Support
                </a>
              </li>
              <li>
                <a href="https://t.me/PRIMASOFTWARES" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Telegram Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Email: DS3183452@gmail.com</p>
              <p>Telegram: PRIMASOFTWARES</p>
              <p>Response Time: 24/7 Support</p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Available in 147+ countries
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-purple-500/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Bolt Flasher. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Platform Version: 2.5.0</span>
              <span>•</span>
              <span>SSL Secured</span>
              <span>•</span>
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}