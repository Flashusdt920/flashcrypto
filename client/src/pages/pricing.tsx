import { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { SEOHelper } from '@/components/SEOHelper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Copy, Check, Star, Quote, LogOut, Home } from 'lucide-react';
import QRCode from 'qrcode';

interface PricingProps {
  user: any;
  onSubscriptionComplete: () => Promise<boolean>;
  onLogout?: () => void;
  onBackToHome?: () => void;
}

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Michael Rodriguez",
    role: "Professional Trader",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    text: "Bolt Crypto Flasher has revolutionized my trading operations. The flash transaction system is incredibly reliable and the multi-chain support is exactly what I needed.",
    rating: 5,
    plan: "Full"
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Crypto Investor",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    text: "The professional interface and instant processing make this platform outstanding. I've processed over $500k in transactions without any issues.",
    rating: 5,
    plan: "Pro"
  },
  {
    id: 3,
    name: "David Thompson",
    role: "DeFi Specialist",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    text: "Best flash transaction platform I've used. The Tron integration is seamless and the customer support is exceptional. Highly recommended!",
    rating: 5,
    plan: "Full"
  },
  {
    id: 4,
    name: "Anna Petrov",
    role: "Blockchain Developer",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    text: "The technical implementation is flawless. Clean interface, fast transactions, and excellent security measures. Worth every penny.",
    rating: 5,
    plan: "Pro"
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Financial Advisor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face",
    text: "I recommend Bolt Crypto Flasher to all my clients. The platform is professional, secure, and delivers exactly what it promises.",
    rating: 5,
    plan: "Basic"
  },
  {
    id: 6,
    name: "Lisa Zhang",
    role: "Portfolio Manager",
    avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face",
    text: "Outstanding platform with excellent ROI. The flash fee system is transparent and the multi-network support has saved me countless hours.",
    rating: 5,
    plan: "Full"
  },
  {
    id: 7,
    name: "Roberto Silva",
    role: "Cryptocurrency Analyst",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=64&h=64&fit=crop&crop=face",
    text: "After testing multiple flash platforms, Bolt stands out for its reliability and speed. The 0.019 ETH flash fee is completely worth it for the quality of service.",
    rating: 5,
    plan: "Pro"
  },
  {
    id: 8,
    name: "Emma Foster",
    role: "Digital Asset Manager",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face",
    text: "The multi-network compatibility is incredible. I can handle BTC, ETH, USDT, and BNB all from one platform. Customer service responds within minutes!",
    rating: 5,
    plan: "Full"
  },
  {
    id: 9,
    name: "Alexander Kim",
    role: "Fintech Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=64&h=64&fit=crop&crop=face",
    text: "I've integrated Bolt into my business operations. The uptime is exceptional and the transaction processing is lightning fast. Highly professional platform.",
    rating: 5,
    plan: "Full"
  },
  {
    id: 10,
    name: "Rachel Martinez",
    role: "Investment Consultant",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=64&h=64&fit=crop&crop=face",
    text: "The security features give me complete confidence. I've processed millions through this platform and never had a single issue. Worth every dollar!",
    rating: 5,
    plan: "Pro"
  },
  {
    id: 11,
    name: "Marcus Johnson",
    role: "Hedge Fund Manager",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
    text: "Bolt Crypto Flasher has become essential to our trading strategy. The flash transaction capabilities and network support are unmatched in the industry.",
    rating: 5,
    plan: "Full"
  },
  {
    id: 12,
    name: "Sophia Williams",
    role: "Crypto Trading Specialist",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=64&h=64&fit=crop&crop=face",
    text: "The interface is intuitive and the transaction speeds are incredible. I switched from three different platforms to just using Bolt for everything.",
    rating: 5,
    plan: "Basic"
  }
];

export default function Pricing({ user, onSubscriptionComplete, onLogout, onBackToHome }: PricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentTxHash, setPaymentTxHash] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const usdtAddress = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";

  // Subscription plans
  const plans = [
    {
      id: 'standard',
      name: 'Standard Access',
      price: '2500',
      features: [
        'Flash Transactions (500 per month)',
        'Basic Networks (BTC, ETH, USDT)',
        'Standard Support',
        'Basic Security Features',
        'Single Transaction Processing',
        'Basic Templates',
        'Dashboard Access',
        'Email Notifications',
        'Monthly Updates'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Access',
      price: '7500',
      features: [
        'Unlimited Flash Transactions',
        'All Networks Supported (BTC, ETH, USDT, BNB, TRX)',
        'Priority 24/7 Support',
        'Advanced Security Features',
        'Bulk Transaction Processing',
        'Transaction Templates',
        'Portfolio Tracker',
        'Price Alerts & Notifications',
        'API Access',
        'Affiliate Program Access',
        'Custom Integration Support',
        'Lifetime Updates'
      ]
    }
  ];

  // Generate QR code for USDT address
  useEffect(() => {
    QRCode.toDataURL(usdtAddress, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })
    .then(url => setQrCodeUrl(url))
    .catch(err => console.error('QR code generation failed:', err));
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Create subscription mutation
  const createSubscription = useMutation({
    mutationFn: async (data: { userId: string; planId: string; paymentTxHash: string }) => {
      return await apiRequest('POST', '/api/subscriptions', data);
    },
    onSuccess: async () => {
      toast({
        title: "Payment Submitted",
        description: "Your payment has been submitted and is pending approval. You'll be notified once it's approved.",
      });
      setShowPayment(false);
      setPaymentTxHash("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to activate subscription",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "USDT address copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePaymentConfirm = () => {
    if (!paymentTxHash.trim()) {
      toast({
        title: "Transaction Hash Required",
        description: "Please enter the transaction hash from your payment",
        variant: "destructive",
      });
      return;
    }

    createSubscription.mutate({
      userId: user.id,
      planId: selectedPlan.id,
      paymentTxHash: paymentTxHash.trim(),
    });
  };

  if (showPayment && selectedPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-3 sm:p-4">
        <Card className="w-full max-w-md bg-black bg-opacity-50 border border-purple-500 shadow-2xl">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">Complete Payment</CardTitle>
            <p className="text-gray-300 text-sm sm:text-base">{selectedPlan.name} Plan - ${selectedPlan.price} USDT</p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white text-sm">USDT Payment Address:</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(usdtAddress)}
                  className="text-xs h-8 px-2 text-purple-400 hover:text-purple-300"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="font-mono text-sm break-all bg-gray-900 rounded p-2 text-gray-300 mb-3">
                {usdtAddress}
              </p>
              
              {qrCodeUrl && (
                <div className="flex justify-center p-3 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="USDT Address QR Code" className="w-32 h-32 sm:w-48 sm:h-48" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="txHash" className="text-white">Transaction Hash</Label>
              <Input
                id="txHash"
                type="text"
                value={paymentTxHash}
                onChange={(e) => setPaymentTxHash(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-purple-500"
                placeholder="Enter transaction hash after payment"
              />
              <p className="text-xs text-gray-400">
                Send exactly ${selectedPlan.price} USDT to the address above, then enter the transaction hash
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowPayment(false)}
                variant="ghost"
                className="flex-1 text-gray-300 hover:text-white"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentConfirm}
                disabled={createSubscription.isPending || !paymentTxHash.trim()}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {createSubscription.isPending ? 'Confirming...' : 'Confirm Payment'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title="💎 Premium Access - Bolt Crypto Flasher"
        description="Get full access to Bolt Crypto Flasher premium platform. $7500 lifetime access with unlimited flash transactions, all networks supported, and advanced features."
        canonical="/pricing"
        ogImage="/pricing-preview.png"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-2 sm:p-3 lg:p-4">
      <div className="w-full max-w-6xl px-2 sm:px-4">
        {/* Header with Navigation Buttons */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex gap-3">
            <Button
              onClick={onBackToHome || (() => window.location.href = '/')}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-800/50 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={onLogout || (() => {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
                window.location.reload();
              })}
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-2">Premium Access Required</h1>
          <p className="text-gray-300 text-xs sm:text-sm lg:text-base px-2">Welcome {user.username}! Unlock full platform access with our premium plan</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={plan.id}
              className={`bg-black bg-opacity-50 border ${
                plan.id === 'premium' 
                  ? 'border-purple-500 shadow-2xl hover:shadow-purple-500/20 transform scale-105' 
                  : 'border-gray-600 shadow-xl hover:shadow-gray-500/20'
              } transition-all`}
            >
              <CardHeader className="text-center p-4 sm:p-6 lg:p-8">
                {plan.id === 'premium' && (
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full mb-3 sm:mb-4 inline-block">
                    MOST POPULAR
                  </div>
                )}
                {plan.id === 'standard' && (
                  <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs sm:text-sm font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded-full mb-3 sm:mb-4 inline-block">
                    STARTER
                  </div>
                )}
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-400">${plan.price}</div>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">One-time USDT Payment</p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-300 text-sm sm:text-base">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full text-base sm:text-lg ${
                    plan.id === 'premium'
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700'
                      : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                  } text-white py-4 sm:py-5`}
                >
                  Get {plan.name}
                </Button>
                <p className="text-center text-gray-400 text-xs sm:text-sm mt-3">
                  ⚡ Instant activation after payment
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">What Our Users Say</h2>
            <p className="text-gray-300">Join thousands of satisfied professionals worldwide</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-purple-400">5,000+</div>
              <div className="text-sm text-gray-300">Active Users</div>
            </div>
            <div className="text-center bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-green-400">$2.5M+</div>
              <div className="text-sm text-gray-300">Processed</div>
            </div>
            <div className="text-center bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-blue-400">99.9%</div>
              <div className="text-sm text-gray-300">Uptime</div>
            </div>
            <div className="text-center bg-black bg-opacity-30 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-yellow-400">4.9/5</div>
              <div className="text-sm text-gray-300">Rating</div>
            </div>
          </div>

          {/* Animated Testimonial Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-xl bg-black bg-opacity-40 border border-gray-600 p-6 sm:p-8">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                    <div className="max-w-4xl mx-auto">
                      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-purple-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=7c3aed&color=fff&size=80`;
                            }}
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <div className="flex justify-center md:justify-start mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <Quote className="w-8 h-8 text-purple-400 mb-3 mx-auto md:mx-0" />
                          <blockquote className="text-lg sm:text-xl text-gray-200 mb-4 italic">
                            "{testimonial.text}"
                          </blockquote>
                          <div className="space-y-1">
                            <div className="font-semibold text-white text-lg">{testimonial.name}</div>
                            <div className="text-purple-400 text-sm">{testimonial.role}</div>
                            <div className="inline-block bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                              {testimonial.plan} Plan User
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Navigation Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-purple-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
              <div className="text-sm text-gray-400">Trusted by professionals worldwide</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}