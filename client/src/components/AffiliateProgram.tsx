import { useState } from 'react';
import { Users, DollarSign, Link2, Copy, TrendingUp, Award, Gift, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierProgress: number;
}

interface Referral {
  id: string;
  username: string;
  joinedDate: Date;
  status: 'active' | 'pending' | 'inactive';
  earnings: number;
  plan: string;
}

export function AffiliateProgram() {
  const [affiliateCode] = useState('BOLT-' + Math.random().toString(36).substring(2, 8).toUpperCase());
  const [customLink, setCustomLink] = useState('');
  const { toast } = useToast();

  const stats: AffiliateStats = {
    totalReferrals: 47,
    activeReferrals: 31,
    totalEarnings: 3847.50,
    pendingEarnings: 245.00,
    conversionRate: 65.9,
    tier: 'silver',
    nextTierProgress: 73,
  };

  const referrals: Referral[] = [
    {
      id: '1',
      username: 'john_doe',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      status: 'active',
      earnings: 150,
      plan: 'Pro',
    },
    {
      id: '2',
      username: 'alice_smith',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      status: 'active',
      earnings: 250,
      plan: 'Full',
    },
    {
      id: '3',
      username: 'bob_trader',
      joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      status: 'pending',
      earnings: 0,
      plan: 'Basic',
    },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-orange-400';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-400';
      case 'platinum': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'silver': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'platinum': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const generateCustomLink = () => {
    const baseUrl = 'https://boltflasher.live/ref/';
    const link = `${baseUrl}${affiliateCode}${customLink ? '?utm=' + customLink : ''}`;
    copyToClipboard(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-400" />
            Affiliate Program
          </h2>
          <p className="text-gray-400 mt-1">Earn up to 30% commission on referrals</p>
        </div>
        <Badge className={getTierBadge(stats.tier)}>
          <Award className="w-4 h-4 mr-1" />
          {stats.tier.toUpperCase()} TIER
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-xs text-green-400">+12%</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
          <p className="text-xs text-gray-400">Total Referrals</p>
        </Card>

        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400">{stats.conversionRate}%</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeReferrals}</p>
          <p className="text-xs text-gray-400">Active Users</p>
        </Card>

        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
            <span className="text-xs text-green-400">+$847</span>
          </div>
          <p className="text-2xl font-bold text-white">${stats.totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Total Earnings</p>
        </Card>

        <Card className="bg-black/50 border-purple-500/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <Gift className="w-5 h-5 text-orange-400" />
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
              Pending
            </Badge>
          </div>
          <p className="text-2xl font-bold text-white">${stats.pendingEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-400">Available to Withdraw</p>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Tier Progress</h3>
            <p className="text-sm text-gray-400">
              {100 - stats.nextTierProgress} more referrals to GOLD tier
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Commission Rate</p>
            <p className="text-xl font-bold text-purple-400">20%</p>
          </div>
        </div>
        <Progress value={stats.nextTierProgress} className="h-3" />
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center">
            <div className={`text-xs font-medium ${stats.tier === 'bronze' ? 'text-orange-400' : 'text-gray-500'}`}>
              BRONZE
            </div>
            <div className="text-xs text-gray-500">10%</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-medium ${stats.tier === 'silver' ? 'text-gray-400' : 'text-gray-500'}`}>
              SILVER
            </div>
            <div className="text-xs text-gray-500">20%</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-medium ${stats.tier === 'gold' ? 'text-yellow-400' : 'text-gray-500'}`}>
              GOLD
            </div>
            <div className="text-xs text-gray-500">25%</div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-medium ${stats.tier === 'platinum' ? 'text-purple-400' : 'text-gray-500'}`}>
              PLATINUM
            </div>
            <div className="text-xs text-gray-500">30%</div>
          </div>
        </div>
      </Card>

      {/* Referral Link */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Referral Link</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Your unique affiliate code:</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-900 rounded-lg px-4 py-3 font-mono text-purple-400">
                {affiliateCode}
              </div>
              <Button
                onClick={() => copyToClipboard(affiliateCode)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Generate custom tracking link:</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Campaign name (optional)"
                value={customLink}
                onChange={(e) => setCustomLink(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button
                onClick={generateCustomLink}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium text-sm mb-2">Marketing Resources</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="text-left text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                Download Banners
              </button>
              <button className="text-left text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                Email Templates
              </button>
              <button className="text-left text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                Social Media Kit
              </button>
              <button className="text-left text-xs text-gray-400 hover:text-purple-400 flex items-center gap-1">
                <ChevronRight className="w-3 h-3" />
                Landing Pages
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Referrals */}
      <Card className="bg-black/50 border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Referrals</h3>
        <div className="space-y-3">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{referral.username}</p>
                  <p className="text-xs text-gray-400">
                    Joined {referral.joinedDate.toLocaleDateString()} • {referral.plan} Plan
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-medium">+${referral.earnings.toFixed(2)}</p>
                <Badge className={`text-xs ${
                  referral.status === 'active' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                }`}>
                  {referral.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          View All Referrals
        </Button>
      </Card>
    </div>
  );
}