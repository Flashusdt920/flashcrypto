import { Calendar, User, ArrowRight, TrendingUp, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  trending?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Flash Transactions in 2025',
    excerpt: 'A comprehensive guide to flash transactions, how they work, and why they are revolutionizing the crypto space.',
    author: 'Michael Chen',
    date: '2025-01-05',
    readTime: '5 min read',
    category: 'Education',
    image: '📊',
    trending: true
  },
  {
    id: '2',
    title: 'Top 10 Crypto Networks for Flash Trading',
    excerpt: 'Discover which blockchain networks offer the best performance and lowest fees for flash transactions.',
    author: 'Sarah Williams',
    date: '2025-01-03',
    readTime: '8 min read',
    category: 'Analysis',
    image: '🔥'
  },
  {
    id: '3',
    title: 'Security Best Practices for Crypto Traders',
    excerpt: 'Essential security tips to protect your crypto assets and maintain safe trading practices.',
    author: 'David Rodriguez',
    date: '2024-12-28',
    readTime: '6 min read',
    category: 'Security',
    image: '🔒'
  },
  {
    id: '4',
    title: 'Flash Fee Optimization Strategies',
    excerpt: 'Learn how to minimize flash fees while maximizing transaction success rates.',
    author: 'Emma Johnson',
    date: '2024-12-25',
    readTime: '7 min read',
    category: 'Strategy',
    image: '💡',
    trending: true
  },
  {
    id: '5',
    title: 'Market Analysis: Crypto Trends 2025',
    excerpt: 'In-depth analysis of cryptocurrency market trends and predictions for the coming year.',
    author: 'Alex Thompson',
    date: '2024-12-20',
    readTime: '10 min read',
    category: 'Market',
    image: '📈'
  },
  {
    id: '6',
    title: 'Beginner Guide to Flash Transactions',
    excerpt: 'Everything you need to know to get started with flash transactions on Bolt Flasher.',
    author: 'Lisa Park',
    date: '2024-12-18',
    readTime: '4 min read',
    category: 'Tutorial',
    image: '🎓'
  }
];

const categories = [
  { name: 'All', count: blogPosts.length },
  { name: 'Education', count: 2 },
  { name: 'Analysis', count: 1 },
  { name: 'Security', count: 1 },
  { name: 'Strategy', count: 1 },
  { name: 'Market', count: 1 },
  { name: 'Tutorial', count: 1 }
];

export default function Blog() {
  const [, setLocation] = useLocation();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Education': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Analysis': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Security': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Strategy': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Market': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Tutorial': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Crypto Insights Blog</h1>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest trends, strategies, and insights in cryptocurrency and flash trading
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              className={`px-4 py-2 rounded-lg transition-all ${
                cat.name === 'All' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <Card className="bg-gradient-to-r from-purple-900/50 to-black/50 border-purple-500/30 mb-8 p-6">
          <div className="flex items-start gap-2 mb-3">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              Featured
            </Badge>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
          </div>
          <h2 className="text-3xl font-bold mb-3">{blogPosts[0].title}</h2>
          <p className="text-gray-300 text-lg mb-4">{blogPosts[0].excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {blogPosts[0].author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(blogPosts[0].date).toLocaleDateString()}
              </span>
              <span>{blogPosts[0].readTime}</span>
            </div>
            <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300">
              Read More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <Card
              key={post.id}
              className="bg-black/50 border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
              onClick={() => setLocation(`/blog/${post.id}`)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{post.image}</span>
                  {post.trending && (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Hot
                    </Badge>
                  )}
                </div>
                
                <Badge className={`${getCategoryColor(post.category)} mb-3`}>
                  <Tag className="w-3 h-3 mr-1" />
                  {post.category}
                </Badge>
                
                <h3 className="text-xl font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-purple-900/20 border-purple-500/30 mt-12 p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
          <p className="text-gray-400 mb-6">
            Subscribe to our newsletter and never miss important crypto updates
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
              Subscribe
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}