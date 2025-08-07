import { Twitter, Facebook, Linkedin, Instagram, Youtube, Send, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function SocialMediaButtons() {
  const { toast } = useToast();

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = 'Check out Bolt Crypto Flasher - The most advanced flash transaction platform!';
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "Share link has been copied to clipboard",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('twitter')}
        className="text-gray-400 hover:text-[#1DA1F2] hover:bg-[#1DA1F2]/10"
      >
        <Twitter className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('facebook')}
        className="text-gray-400 hover:text-[#1877F2] hover:bg-[#1877F2]/10"
      >
        <Facebook className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('linkedin')}
        className="text-gray-400 hover:text-[#0A66C2] hover:bg-[#0A66C2]/10"
      >
        <Linkedin className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('telegram')}
        className="text-gray-400 hover:text-[#0088CC] hover:bg-[#0088CC]/10"
      >
        <Send className="w-5 h-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleShare('copy')}
        className="text-gray-400 hover:text-purple-400 hover:bg-purple-400/10"
      >
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  );
}

export function SocialMediaFollow() {
  return (
    <div className="space-y-3">
      <h4 className="text-white font-semibold">Follow Us</h4>
      <div className="flex gap-3">
        <a
          href="https://twitter.com/boltflasher"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1DA1F2] transition-colors"
        >
          <Twitter className="w-5 h-5 text-white" />
        </a>
        
        <a
          href="https://facebook.com/boltflasher"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#1877F2] transition-colors"
        >
          <Facebook className="w-5 h-5 text-white" />
        </a>
        
        <a
          href="https://instagram.com/boltflasher"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-r hover:from-[#833AB4] hover:to-[#FD1D1D] transition-colors"
        >
          <Instagram className="w-5 h-5 text-white" />
        </a>
        
        <a
          href="https://youtube.com/@boltflasher"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#FF0000] transition-colors"
        >
          <Youtube className="w-5 h-5 text-white" />
        </a>
        
        <a
          href="https://t.me/boltflasher"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#0088CC] transition-colors"
        >
          <Send className="w-5 h-5 text-white" />
        </a>
      </div>
    </div>
  );
}