import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Bitcoin,
  DollarSign,
  Coins,
  Wallet,
  RefreshCw,
  BarChart3,
  Star,
  Award,
  Clock,
  Rocket
} from 'lucide-react';
import Footer from '@/components/Footer';
import { SEOHelper } from '@/components/SEOHelper';
import { FeatureComparison } from '../components/FeatureComparison';

export default function Homepage() {
  return (
    <>
      <SEOHelper
        title="Flash USDT BTC ETH Software 2025 | #1 Flash Crypto Platform - Bolt Flasher"
        description="Professional flash USDT software, flash BTC tool, flash ETH sender. Instant crypto flash transactions on Bitcoin, Ethereum, USDT TRC20/ERC20/BEP20 networks. Download the best crypto flasher 2025."
        keywords="flash usdt, flash btc, flash eth, flash crypto software, crypto flasher, usdt flasher, btc flasher, temporary crypto, flash loan tools"
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        {/* Navigation Header */}
        <nav className="bg-gray-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-yellow-500/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link href="/home">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">Bolt Flasher</span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <Link href="#features" className="text-gray-300 hover:text-yellow-500 transition">Features</Link>
                <Link href="#how-it-works" className="text-gray-300 hover:text-yellow-500 transition">How It Works</Link>
                <Link href="#pricing" className="text-gray-300 hover:text-yellow-500 transition">Pricing</Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-yellow-500 transition">Reviews</Link>
                <Link href="/login">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 dark:text-black font-semibold">
                    Login
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950 dark:hover:text-black">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
              #1 Flash Crypto Platform 2025
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Flash USDT, BTC & ETH
              <span className="text-yellow-500 block">Instantly</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Professional flash crypto software for instant USDT TRC20/ERC20/BEP20, Bitcoin, and Ethereum transactions. 
              The most advanced crypto flasher tool trusted by 10,000+ users worldwide.
            </p>
            <div className="flex gap-4 justify-center mb-12">
              <Link href="/login">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 dark:text-black font-bold text-lg px-8 py-6">
                  Start Flashing Crypto <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950 dark:hover:text-black text-lg px-8 py-6">
                  View Pricing
                </Button>
              </Link>
            </div>
            <div className="flex justify-center gap-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Instant Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>Multi-Network Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="bg-gray-800/50 py-12 border-y border-gray-700">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-500">10,847+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">$2.5M+</div>
                <div className="text-gray-400">Daily Volume</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-500">4.9/5</div>
                <div className="text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Cryptocurrencies */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Flash Any Cryptocurrency</h2>
            <p className="text-gray-400 text-lg">Support for all major networks and tokens</p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition">
              <CardHeader className="text-center">
                <Bitcoin className="h-12 w-12 text-orange-500 mx-auto mb-2" />
                <CardTitle className="text-white">Bitcoin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm">Flash BTC on mainnet</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <CardTitle className="text-white">USDT</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm">TRC20, ERC20, BEP20</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition">
              <CardHeader className="text-center">
                <Coins className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <CardTitle className="text-white">Ethereum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm">Flash ETH & ERC tokens</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition">
              <CardHeader className="text-center">
                <Wallet className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                <CardTitle className="text-white">BNB</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm">Binance Smart Chain</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition">
              <CardHeader className="text-center">
                <RefreshCw className="h-12 w-12 text-red-500 mx-auto mb-2" />
                <CardTitle className="text-white">TRON</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-center text-sm">TRX & TRC tokens</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-800/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Powerful Flash Crypto Features</h2>
              <p className="text-gray-400 text-lg">Everything you need to flash cryptocurrencies professionally</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <Zap className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">Instant Flash Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Flash USDT, BTC, ETH instantly with our advanced blockchain technology. Transactions appear on-chain immediately.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <Globe className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">Multi-Network Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Support for Bitcoin, Ethereum, BSC, TRON, and all major blockchain networks. Flash on any chain.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <Shield className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">Enterprise Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">2FA authentication, encrypted connections, and advanced security protocols to protect your operations.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">Real-time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Track all your flash transactions with detailed analytics, charts, and comprehensive reporting tools.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <Users className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">Bulk Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Flash multiple transactions simultaneously. Import CSV files for bulk processing and automation.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/70 border-gray-700 hover:border-yellow-500 transition">
                <CardHeader>
                  <Clock className="h-10 w-10 text-yellow-500 mb-3" />
                  <CardTitle className="text-white">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Get instant help from our expert support team via Telegram. We're here to help you succeed.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">How Flash Crypto Works</h2>
            <p className="text-gray-400 text-lg">Start flashing cryptocurrencies in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-yellow-500 text-yellow-950 dark:text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Create Account</h3>
              <p className="text-gray-400">Register and get instant access to the flash crypto platform</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-yellow-950 dark:text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select Network</h3>
              <p className="text-gray-400">Choose Bitcoin, USDT, Ethereum or any supported network</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-yellow-950 dark:text-black rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Flash Instantly</h3>
              <p className="text-gray-400">Enter amount and address to flash crypto immediately</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
          <section className="py-20 bg-gray-800/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Trusted by Crypto Professionals</h2>
                <p className="text-gray-400 text-lg">Real results from real users</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"This platform revolutionized my crypto operations. Fast, secure, and incredibly professional."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">MJ</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Michael Johnson</p>
                        <p className="text-gray-500 text-sm">Crypto Trader</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"The security features and 2FA implementation are top-notch. I trust this platform completely."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">SW</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Sarah Wilson</p>
                        <p className="text-gray-500 text-sm">Financial Analyst</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"Support is excellent and the platform handles high-volume transactions flawlessly."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">DL</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">David Lee</p>
                        <p className="text-gray-500 text-sm">Blockchain Developer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

        {/* Testimonials Section */}
          <section className="py-20 bg-gray-800/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Trusted by Crypto Professionals</h2>
                <p className="text-gray-400 text-lg">Real results from real users</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"This platform revolutionized my crypto operations. Fast, secure, and incredibly professional."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">MJ</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Michael Johnson</p>
                        <p className="text-gray-500 text-sm">Crypto Trader</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"The security features and 2FA implementation are top-notch. I trust this platform completely."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">SW</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Sarah Wilson</p>
                        <p className="text-gray-500 text-sm">Financial Analyst</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"Support is excellent and the platform handles high-volume transactions flawlessly."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">DL</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">David Lee</p>
                        <p className="text-gray-500 text-sm">Blockchain Developer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

        {/* Testimonials Section */}
          <section className="py-20 bg-gray-800/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">Trusted by Crypto Professionals</h2>
                <p className="text-gray-400 text-lg">Real results from real users</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"This platform revolutionized my crypto operations. Fast, secure, and incredibly professional."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">MJ</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Michael Johnson</p>
                        <p className="text-gray-500 text-sm">Crypto Trader</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"The security features and 2FA implementation are top-notch. I trust this platform completely."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">SW</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Sarah Wilson</p>
                        <p className="text-gray-500 text-sm">Financial Analyst</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {'★'.repeat(5)}
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">"Support is excellent and the platform handles high-volume transactions flawlessly."</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-semibold">DL</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold">David Lee</p>
                        <p className="text-gray-500 text-sm">Blockchain Developer</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

        {/* Pricing CTA */}
        <section id="pricing" className="container mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Flashing Crypto?</h2>
            <p className="text-gray-900 text-lg mb-8 max-w-2xl mx-auto">
              Join 10,000+ users who trust Bolt Flasher for their crypto flash transactions. 
              Get instant access to all premium features.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-black hover:bg-gray-900 text-yellow-500 font-bold text-lg px-8 py-6">
                  View Premium Plan
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-200 hover:text-yellow-500 dark:hover:text-yellow-600 text-lg px-8 py-6">
                  Create Account
                </Button>
              </Link>
            </div>
            <p className="text-gray-900 mt-6 text-sm">
              <Award className="inline h-4 w-4 mr-1" />
              Premium Plan: $7,500 - Lifetime Access
            </p>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="bg-gray-800/30 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-lg">Quick answers about flash crypto software</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">How to flash USDT with this software?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Simply login, select USDT network (TRC20/ERC20/BEP20), enter the amount and recipient address. The flash transaction appears on blockchain instantly.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Can I flash Bitcoin BTC?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Yes! Our flash BTC tool supports Bitcoin mainnet with instant transaction broadcasting and advanced features.</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Is this the best flash crypto software 2025?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Bolt Flasher is the #1 rated flash crypto platform in 2025 with support for all major cryptocurrencies and networks.</p>
                </CardContent>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Link href="/faq">
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-yellow-950 dark:hover:text-black">
                  View All FAQs <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center">
            <Rocket className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Start Flashing Crypto Today</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Don't miss out on the most advanced flash crypto platform. Join thousands of successful users worldwide.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 dark:text-black font-bold text-lg px-12 py-6">
                Get Started Now - Flash USDT, BTC, ETH
              </Button>
            </Link>
            <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                No Credit Card Required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Instant Access
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                24/7 Support
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}