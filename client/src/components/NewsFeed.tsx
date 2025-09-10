import { useState, useEffect } from 'react';
import { Newspaper, TrendingUp, AlertCircle, Clock, ExternalLink, Bookmark, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  timestamp: Date;
  url: string;
  impact: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'negative' | 'neutral';
  isBookmarked?: boolean;
  image?: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin Reaches New All-Time High of $75,000',
    summary: 'Bitcoin surges to unprecedented levels as institutional adoption accelerates and ETF approvals drive mainstream investment.',
    source: 'CryptoNews',
    category: 'Market',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    url: '#',
    impact: 'high',
    sentiment: 'positive',
    image: '📈',
  },
  {
    id: '2',
    title: 'Ethereum 2.0 Staking Hits Record 25 Million ETH',
    summary: 'The Ethereum network sees record participation in staking as validators secure the proof-of-stake blockchain.',
    source: 'ETH Daily',
    category: 'Technology',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    url: '#',
    impact: 'medium',
    sentiment: 'positive',
    image: '⚡',
  },
  {
    id: '3',
    title: 'SEC Announces New Crypto Regulatory Framework',
    summary: 'Securities and Exchange Commission releases comprehensive guidelines for cryptocurrency compliance and operations.',
    source: 'Reuters',
    category: 'Regulation',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    url: '#',
    impact: 'high',
    sentiment: 'neutral',
    image: '⚖️',
  },
  {
    id: '4',
    title: 'Major Exchange Suffers Security Breach',
    summary: 'Leading cryptocurrency exchange reports unauthorized access to hot wallets, user funds remain safe.',
    source: 'Security Today',
    category: 'Security',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    url: '#',
    impact: 'high',
    sentiment: 'negative',
    image: '🚨',
  },
  {
    id: '5',
    title: 'DeFi Protocol Launches Revolutionary Yield Farming',
    summary: 'New decentralized finance platform offers unprecedented APY rates with innovative liquidity mechanisms.',
    source: 'DeFi Pulse',
    category: 'DeFi',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    url: '#',
    impact: 'medium',
    sentiment: 'positive',
    image: '🌾',
  },
];

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);

  const categories = ['All', 'Market', 'Technology', 'Regulation', 'Security', 'DeFi'];

  const filteredNews = news.filter(item => {
    if (bookmarkedOnly && !item.isBookmarked) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    return true;
  });

  const toggleBookmark = (id: string) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'neutral': return '➡️';
      default: return '❓';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  // Auto-refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, fetch new news here
      console.log('Refreshing news feed...');
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="w-7 h-7 text-purple-400" />
            Crypto News Feed
          </h2>
          <p className="text-gray-400 mt-1">Stay updated with latest market news</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={bookmarkedOnly ? 'default' : 'outline'}
            onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            className={bookmarkedOnly ? 'bg-purple-600' : ''}
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Bookmarked
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-purple-600' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Breaking News Alert */}
      {filteredNews.some(n => n.impact === 'high' && (new Date().getTime() - n.timestamp.getTime()) < 3600000) && (
        <Card className="bg-red-900/20 border-red-500/30 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold">Breaking News</p>
              <p className="text-gray-300 text-sm">High-impact events detected in the last hour</p>
            </div>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {filteredNews.filter(n => n.impact === 'high' && (new Date().getTime() - n.timestamp.getTime()) < 3600000).length} Alert{filteredNews.filter(n => n.impact === 'high' && (new Date().getTime() - n.timestamp.getTime()) < 3600000).length > 1 ? 's' : ''}
            </Badge>
          </div>
        </Card>
      )}

      {/* News List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-black/50 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Image/Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold line-clamp-2 mb-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getImpactColor(item.impact)}>
                              {item.impact.toUpperCase()}
                            </Badge>
                            <Badge className="bg-gray-700/50 text-gray-400 border-gray-600">
                              {item.category}
                            </Badge>
                            <span className="text-xl">{getSentimentIcon(item.sentiment)}</span>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleBookmark(item.id)}
                          className={item.isBookmarked ? 'text-yellow-400' : 'text-gray-400'}
                        >
                          <Bookmark className={`w-4 h-4 ${item.isBookmarked ? 'fill-current' : ''}`} />
                        </Button>
                      </div>

                      <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                        {item.summary}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(item.url, '_blank')}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredNews.length === 0 && (
        <Card className="bg-black/50 border-purple-500/20">
          <div className="p-12 text-center">
            <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No News Found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later</p>
          </div>
        </Card>
      )}

      {/* Live Update Indicator */}
      <div className="flex items-center justify-center">
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2" />
          Live Updates Active
        </Badge>
      </div>
    </div>
  );
}