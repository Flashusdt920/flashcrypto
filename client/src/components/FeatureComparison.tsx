
import { Check, X, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FeatureComparison() {
  const features = [
    { name: "Multi-Chain Support", basic: true, competitor: false },
    { name: "Real-Time Transactions", basic: true, competitor: true },
    { name: "Advanced Security", basic: true, competitor: false },
    { name: "24/7 Support", basic: true, competitor: false },
    { name: "API Access", basic: true, competitor: false },
    { name: "Bulk Processing", basic: true, competitor: false },
    { name: "Analytics Dashboard", basic: true, competitor: true },
    { name: "Mobile App", basic: true, competitor: false },
  ];

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Why Choose Bolt Crypto Flasher?</h2>
          <p className="text-gray-400 text-lg">Compare our features with the competition</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div></div>
            <Card className="bg-gradient-to-b from-yellow-600/20 to-yellow-800/20 border-yellow-500/30">
              <CardHeader className="text-center">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <CardTitle className="text-white">Bolt Flasher</CardTitle>
                <Badge className="bg-yellow-500/20 text-yellow-400">Best Choice</Badge>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-gray-400">Competitors</CardTitle>
              </CardHeader>
            </Card>
          </div>
          
          {features.map((feature, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-white font-medium">{feature.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex items-center justify-center">
                {feature.competitor ? 
                  <Check className="w-6 h-6 text-gray-500" /> : 
                  <X className="w-6 h-6 text-red-500" />
                }
              </div>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
