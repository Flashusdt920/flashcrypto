
import { useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggleDemo = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate demo progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
    }
  };

  const resetDemo = () => {
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">See It In Action</h2>
          <p className="text-gray-400 text-lg">Interactive demo of flash transaction process</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Flash USDT Transaction Demo</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-black rounded-lg p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">From Wallet</h4>
                    <p className="text-gray-400 font-mono text-sm">TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y</p>
                    <p className="text-white text-lg mt-2">Balance: 50,000 USDT</p>
                  </div>
                  <div>
                    <h4 className="text-blue-400 font-semibold mb-2">To Wallet</h4>
                    <p className="text-gray-400 font-mono text-sm">TXn4h7W8JKhKjZvXoMpJ6PqLfYvWn2X9Az</p>
                    <p className="text-white text-lg mt-2">Amount: 10,000 USDT</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Progress value={progress} className="h-2" />
                  <p className="text-center text-gray-400 mt-2">
                    {progress === 0 && "Ready to flash"}
                    {progress > 0 && progress < 50 && "Initiating flash transaction..."}
                    {progress >= 50 && progress < 100 && "Broadcasting to network..."}
                    {progress === 100 && "Flash transaction complete! ✅"}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleDemo}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={progress > 0 && progress < 100}
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Pause Demo' : 'Start Demo'}
                </Button>
                <Button onClick={resetDemo} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                This is a simulation for demonstration purposes only
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
