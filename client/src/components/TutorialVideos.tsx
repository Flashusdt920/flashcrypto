import { useState } from 'react';
import { PlayCircle, BookOpen, X, ChevronRight, Clock, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail: string;
  videoUrl: string;
  completed?: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Getting Started with Bolt Flasher',
    description: 'Learn the basics of our platform and how to make your first transaction',
    duration: '5:30',
    difficulty: 'beginner',
    category: 'Getting Started',
    thumbnail: '🚀',
    videoUrl: '#',
  },
  {
    id: '2',
    title: 'Understanding Flash Fees',
    description: 'Complete guide to flash fees and how they work',
    duration: '8:15',
    difficulty: 'beginner',
    category: 'Fees & Payments',
    thumbnail: '💰',
    videoUrl: '#',
  },
  {
    id: '3',
    title: 'Advanced Transaction Settings',
    description: 'Master advanced features for power users',
    duration: '12:45',
    difficulty: 'advanced',
    category: 'Advanced',
    thumbnail: '⚡',
    videoUrl: '#',
  },
  {
    id: '4',
    title: 'Security Best Practices',
    description: 'Keep your account and transactions secure',
    duration: '10:20',
    difficulty: 'intermediate',
    category: 'Security',
    thumbnail: '🔒',
    videoUrl: '#',
  },
  {
    id: '5',
    title: 'Multi-Network Transactions',
    description: 'Send transactions across different blockchain networks',
    duration: '15:00',
    difficulty: 'intermediate',
    category: 'Networks',
    thumbnail: '🌐',
    videoUrl: '#',
  },
  {
    id: '6',
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to frequently encountered problems',
    duration: '7:45',
    difficulty: 'beginner',
    category: 'Support',
    thumbnail: '🛠️',
    videoUrl: '#',
  },
];

export function TutorialVideos() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);

  const categories = ['All', ...Array.from(new Set(tutorials.map(t => t.category)))];

  const filteredTutorials = selectedCategory === 'All' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const markAsCompleted = (id: string) => {
    setCompletedVideos(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-purple-400" />
            Tutorial Videos
          </h2>
          <p className="text-gray-400 mt-1">Learn how to use Bolt Flasher like a pro</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Progress</p>
          <p className="text-xl font-bold text-purple-400">
            {completedVideos.length}/{tutorials.length} Completed
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tutorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutorials.map((tutorial) => {
          const isCompleted = completedVideos.includes(tutorial.id);
          
          return (
            <Card
              key={tutorial.id}
              className="bg-black/50 border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer group"
              onClick={() => setSelectedVideo(tutorial)}
            >
              <div className="p-6">
                {/* Thumbnail */}
                <div className="relative mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg flex items-center justify-center text-5xl">
                    {tutorial.thumbnail}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-12 h-12 text-white" />
                  </div>
                  {isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-semibold line-clamp-2">{tutorial.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm line-clamp-2">{tutorial.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge className={getDifficultyColor(tutorial.difficulty)}>
                      {tutorial.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-3 h-3" />
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">{selectedVideo.category}</p>
                </div>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-400">Video player would be here</p>
                  <p className="text-gray-500 text-sm mt-2">Duration: {selectedVideo.duration}</p>
                </div>
              </div>

              {/* Video Footer */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center justify-between">
                  <Badge className={getDifficultyColor(selectedVideo.difficulty)}>
                    {selectedVideo.difficulty}
                  </Badge>
                  {!completedVideos.includes(selectedVideo.id) && (
                    <button
                      onClick={() => {
                        markAsCompleted(selectedVideo.id);
                        setSelectedVideo(null);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Mark as Completed
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-3">{selectedVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TutorialButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg transition-colors">
      <PlayCircle className="w-5 h-5 text-purple-400" />
      <span className="text-white">Watch Tutorials</span>
    </button>
  );
}