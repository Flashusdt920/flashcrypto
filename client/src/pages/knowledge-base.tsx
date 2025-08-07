import { Book, Search, ChevronRight, HelpCircle, FileText, Video, Download } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: string;
  title: string;
  category: string;
  type: 'article' | 'video' | 'download';
  readTime?: string;
  views: number;
  helpful: number;
  updated: string;
}

const categories = [
  {
    name: 'Getting Started',
    icon: '🚀',
    articles: [
      { id: '1', title: 'Creating Your First Account', type: 'article' as const, readTime: '3 min', views: 12453, helpful: 98, updated: '2025-01-05' },
      { id: '2', title: 'Understanding Flash Transactions', type: 'video' as const, views: 8932, helpful: 95, updated: '2025-01-03' },
      { id: '3', title: 'Setting Up 2FA Security', type: 'article' as const, readTime: '5 min', views: 6721, helpful: 99, updated: '2024-12-28' },
      { id: '4', title: 'Quick Start Guide PDF', type: 'download' as const, views: 4523, helpful: 92, updated: '2024-12-20' }
    ]
  },
  {
    name: 'Transactions',
    icon: '💸',
    articles: [
      { id: '5', title: 'How to Send Flash Transactions', type: 'article' as const, readTime: '7 min', views: 15234, helpful: 97, updated: '2025-01-07' },
      { id: '6', title: 'Understanding Flash Fees', type: 'article' as const, readTime: '4 min', views: 9876, helpful: 94, updated: '2025-01-06' },
      { id: '7', title: 'Transaction Status Guide', type: 'article' as const, readTime: '6 min', views: 7654, helpful: 96, updated: '2025-01-04' },
      { id: '8', title: 'Troubleshooting Failed Transactions', type: 'video' as const, views: 5432, helpful: 93, updated: '2025-01-02' }
    ]
  },
  {
    name: 'Security',
    icon: '🔒',
    articles: [
      { id: '9', title: 'Best Security Practices', type: 'article' as const, readTime: '8 min', views: 11234, helpful: 99, updated: '2025-01-08' },
      { id: '10', title: 'IP Whitelisting Setup', type: 'article' as const, readTime: '5 min', views: 8765, helpful: 97, updated: '2025-01-05' },
      { id: '11', title: 'Anti-Phishing Protection', type: 'video' as const, views: 6543, helpful: 98, updated: '2025-01-03' },
      { id: '12', title: 'Security Checklist PDF', type: 'download' as const, views: 4321, helpful: 95, updated: '2024-12-30' }
    ]
  },
  {
    name: 'Account Management',
    icon: '👤',
    articles: [
      { id: '13', title: 'Managing Your Profile', type: 'article' as const, readTime: '4 min', views: 9876, helpful: 92, updated: '2025-01-06' },
      { id: '14', title: 'Subscription Plans Explained', type: 'article' as const, readTime: '6 min', views: 7654, helpful: 94, updated: '2025-01-04' },
      { id: '15', title: 'Referral Program Guide', type: 'article' as const, readTime: '5 min', views: 5432, helpful: 91, updated: '2025-01-02' }
    ]
  },
  {
    name: 'API & Integration',
    icon: '⚙️',
    articles: [
      { id: '16', title: 'API Documentation', type: 'article' as const, readTime: '15 min', views: 4567, helpful: 96, updated: '2025-01-07' },
      { id: '17', title: 'Webhook Configuration', type: 'article' as const, readTime: '8 min', views: 3456, helpful: 93, updated: '2025-01-05' },
      { id: '18', title: 'SDK Installation Guide', type: 'video' as const, views: 2345, helpful: 95, updated: '2025-01-03' }
    ]
  }
];

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'download': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Book className="w-16 h-16 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
          <p className="text-gray-400 text-lg mb-6">
            Find answers to your questions and learn how to use Bolt Crypto Flasher
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for articles, videos, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-purple-900/20 border-purple-500/30 p-4 text-center hover:bg-purple-900/30 cursor-pointer transition-all">
            <HelpCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-semibold">FAQs</p>
          </Card>
          <Card className="bg-purple-900/20 border-purple-500/30 p-4 text-center hover:bg-purple-900/30 cursor-pointer transition-all">
            <Video className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Video Tutorials</p>
          </Card>
          <Card className="bg-purple-900/20 border-purple-500/30 p-4 text-center hover:bg-purple-900/30 cursor-pointer transition-all">
            <Download className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-semibold">Downloads</p>
          </Card>
          <Card className="bg-purple-900/20 border-purple-500/30 p-4 text-center hover:bg-purple-900/30 cursor-pointer transition-all">
            <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-white font-semibold">API Docs</p>
          </Card>
        </div>

        {/* Categories and Articles */}
        <div className="space-y-6">
          {categories.map((category) => (
            <Card key={category.name} className="bg-black/50 border-gray-700 overflow-hidden">
              <button
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.articles.length} articles</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                  selectedCategory === category.name ? 'rotate-90' : ''
                }`} />
              </button>
              
              {(selectedCategory === category.name || !selectedCategory) && (
                <div className="border-t border-gray-700">
                  {category.articles.map((article) => (
                    <div
                      key={article.id}
                      className="p-4 hover:bg-gray-900/30 transition-colors cursor-pointer border-b border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getTypeColor(article.type)}>
                              {getTypeIcon(article.type)}
                              <span className="ml-1 capitalize">{article.type}</span>
                            </Badge>
                            {article.readTime && (
                              <span className="text-xs text-gray-500">{article.readTime}</span>
                            )}
                          </div>
                          <h4 className="text-white font-medium mb-1">{article.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{article.views.toLocaleString()} views</span>
                            <span>{article.helpful}% found helpful</span>
                            <span>Updated {new Date(article.updated).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="bg-purple-900/20 border-purple-500/30 mt-8 p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-gray-400 mb-4">Our support team is here to help you 24/7</p>
          <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
            Contact Support
          </button>
        </Card>
      </div>
    </div>
  );
}