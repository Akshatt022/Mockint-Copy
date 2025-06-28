// components/TestimonialsSection.jsx
import React, { useState, useEffect } from 'react';
import { Quote, Star, ArrowLeft, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';

const testimonials = [
  {
    name: 'Riya Sharma',
    role: 'NEET Aspirant',
    location: 'Delhi',
    quote: 'Mockint helped me practice targeted questions with ease. The instant feedback and analytics are amazing! I improved my score by 40% in just 2 months.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    examScore: '650/720',
    improvement: '+40%',
    timeUsed: '3 months'
  },
  {
    name: 'Ankit Mehta',
    role: 'JEE Student',
    location: 'Mumbai',
    quote: 'I loved how I could select difficulty and topic. It made my prep super focused and efficient. The AI recommendations were spot on!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    examScore: '280/300',
    improvement: '+60%',
    timeUsed: '4 months'
  },
  {
    name: 'Sneha Patil',
    role: 'IIT JAM Physics',
    location: 'Pune',
    quote: 'The UI is so clean and smooth. I was able to take mock tests anytime and track my improvement. Best platform for physics preparation!',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    examScore: '85/100',
    improvement: '+35%',
    timeUsed: '2 months'
  },
  {
    name: 'Rahul Kumar',
    role: 'GATE Student',
    location: 'Bangalore',
    quote: 'Amazing question bank and the difficulty progression is perfect. Helped me crack GATE with AIR 150!',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 5,
    examScore: 'AIR 150',
    improvement: '+50%',
    timeUsed: '5 months'
  },
  {
    name: 'Priya Singh',
    role: 'CAT Aspirant',
    location: 'Kolkata',
    quote: 'The analytical dashboard and performance insights are incredible. Mockint made my CAT prep systematic and result-oriented.',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    rating: 5,
    examScore: '95%ile',
    improvement: '+45%',
    timeUsed: '6 months'
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Student Success Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What Our <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Students Say</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Real feedback from students who transformed their exam preparation and achieved their dreams with Mockint.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white mb-2">50K+</div>
            <div className="text-slate-400 text-sm">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-slate-400 text-sm">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9★</div>
            <div className="text-slate-400 text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">45%</div>
            <div className="text-slate-400 text-sm">Avg. Improvement</div>
          </div>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative">
          {/* Featured Testimonial */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/50 backdrop-blur-sm border border-slate-600/30 rounded-3xl p-8 md:p-12 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Quote Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-lg sm:text-xl md:text-2xl text-slate-200 leading-relaxed mb-6 italic">
                  "{testimonials[currentIndex].quote}"
                </p>
                
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* User Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonials[currentIndex].image}
                      alt={testimonials[currentIndex].name}
                      className="w-16 h-16 rounded-full border-3 border-emerald-400"
                    />
                    <div>
                      <h4 className="text-xl font-bold text-white">{testimonials[currentIndex].name}</h4>
                      <p className="text-emerald-400 font-medium">{testimonials[currentIndex].role}</p>
                      <p className="text-slate-400 text-sm">{testimonials[currentIndex].location}</p>
                    </div>
                  </div>

                  {/* Achievement Stats */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start">
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Score</div>
                      <div className="text-lg font-bold text-white">{testimonials[currentIndex].examScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Improvement</div>
                      <div className="text-lg font-bold text-emerald-400">{testimonials[currentIndex].improvement}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400">Duration</div>
                      <div className="text-lg font-bold text-white">{testimonials[currentIndex].timeUsed}</div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center lg:justify-start gap-1 mt-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            {/* Previous/Next Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={prevTestimonial}
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-emerald-400 w-8' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>

            {/* Auto-play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {isAutoPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>

        {/* Bottom Grid of Other Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {testimonials.filter((_, index) => index !== currentIndex).slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-600/30 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group"
              onClick={() => goToSlide(testimonials.findIndex(t => t.name === testimonial.name))}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-emerald-400"
                />
                <div>
                  <h5 className="font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                    {testimonial.name}
                  </h5>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 line-clamp-3">"{testimonial.quote}"</p>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;