import { useState } from 'react';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TelegramSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const telegramUsername = "primasoftwares"; // Replace with your actual Telegram username
  const telegramUrl = `https://t.me/${telegramUsername}`;

  const handleQuickMessage = () => {
    const fullMessage = `🔥 Bolt Crypto Flasher Inquiry

👤 Name: ${name || 'Not provided'}
📧 Email: ${email || 'Not provided'}

💬 Message:
${message}

🚀 I'm interested in learning more about your flash transaction platform and need assistance.`;
    
    const encodedMessage = encodeURIComponent(fullMessage);
    const telegramDeepLink = `https://t.me/${telegramUsername}?text=${encodedMessage}`;
    window.open(telegramDeepLink, '_blank');
    setIsOpen(false);
    setMessage('');
    setName('');
    setEmail('');
  };

  const handleDirectContact = () => {
    window.open(telegramUrl, '_blank');
  };

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Support Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
            <CardHeader className="relative">
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Contact Support
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Get instant help via Telegram
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Contact Button */}
              <div className="text-center py-4">
                <Button
                  onClick={handleDirectContact}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Contact @{telegramUsername}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Click to open Telegram directly
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">or send a message</span>
                </div>
              </div>

              {/* Message Form */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="support-name" className="text-sm">Name (Optional)</Label>
                  <Input
                    id="support-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="support-email" className="text-sm">Email (Optional)</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="support-message" className="text-sm">Message</Label>
                  <Textarea
                    id="support-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about pricing, flash fees, supported networks, or any questions..."
                    className="mt-1 min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleQuickMessage}
                  disabled={!message.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send to Telegram
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                ⚡ Fast response • 🔒 Secure • 💬 Direct contact
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}