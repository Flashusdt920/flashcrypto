import { useState } from 'react';
import { Play, Star, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  title: string;
  transcript: string;
  videoUrl: string;
  thumbnail: string;
  date: string;
  profit: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Michael Thompson',
    location: 'New York, USA',
    rating: 5,
    title: 'Made $50K in 3 Months',
    transcript: 'Bolt Flasher completely changed my crypto trading experience. The flash transaction feature is revolutionary, and the success rate is incredible. I have made over $50,000 in just 3 months!',
    videoUrl: '#',
    thumbnail: '🎥',
    date: '2 weeks ago',
    profit: '+$50,000'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    location: 'Singapore',
    rating: 5,
    title: 'Best Platform for Flash Transactions',
    transcript: 'I have tried many platforms, but Bolt Flasher is by far the best. The security features give me peace of mind, and the transaction speed is unmatched. Highly recommended!',
    videoUrl: '#',
    thumbnail: '🎬',
    date: '1 month ago',
    profit: '+$25,000'
  },
  {
    id: '3',
    name: 'David Rodriguez',
    location: 'Madrid, Spain',
    rating: 5,
    title: 'Professional and Reliable',
    transcript: 'As a professional trader, I need a platform I can trust. Bolt Flasher delivers on all fronts - security, speed, and reliability. The 24/7 support is exceptional.',
    videoUrl: '#',
    thumbnail: '📹',
    date: '3 weeks ago',
    profit: '+$75,000'
  },
  {
    id: '4',
    name: 'Emma Johnson',
    location: 'London, UK',
    rating: 5,
    title: 'Life-Changing Platform',
    transcript: 'This platform has literally changed my life. The flash fees are worth every penny when you see the returns. I have paid off my student loans thanks to Bolt Flasher!',
    videoUrl: '#',
    thumbnail: '🎞️',
    date: '1 week ago',
    profit: '+$35,000'
  }
];

export default function VideoTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    // In production, this would play the actual video
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const current = testimonials[currentIndex];

  return (
    <Card className="bg-black/50 border-purple-500/20 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">Success Stories</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-gray-400 text-sm px-2">
              {currentIndex + 1} / {testimonials.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Video Player Area */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{current.thumbnail}</div>
                    <Button
                      onClick={handlePlay}
                      className="bg-purple-600 hover:bg-purple-700"
                      size="lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Play Testimonial
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur p-3 rounded-lg">
                    <p className="text-white text-sm italic">"{current.transcript}"</p>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-pulse text-purple-400 mb-4">
                      <Play className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-white">Playing video testimonial...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Testimonial Details */}
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{current.name}</h4>
                    <p className="text-gray-400 text-sm">{current.location}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-xl">{current.profit}</div>
                  <p className="text-gray-500 text-xs">{current.date}</p>
                </div>
              </div>

              <h5 className="text-purple-300 font-semibold mb-2">{current.title}</h5>
              <p className="text-gray-300 text-sm leading-relaxed">{current.transcript}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 pt-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'w-8 bg-purple-400' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}