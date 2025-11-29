"use client"; // <--- VERY IMPORTANT

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, Zap, ArrowRight, ChevronRight, ChevronLeft, Plus, Loader2, Sparkles, Download, ImageOff } from 'lucide-react';
import { generateProductImage } from '../../lib/gemini'; // Adjusted path
import { BUNDLES } from '../../lib/constants'; // Adjusted path

interface HeroImageProps {
  itemName: string;
  onDownload?: (url: string) => void;
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ itemName, onDownload, className = '' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadOrGenerateImage = async () => {
      // Check LocalStorage for cached image
      const cachedKey = `hero_${itemName.replace(/\s+/g, '_').toLowerCase()}`;
      const cachedImage = localStorage.getItem(cachedKey);

      if (cachedImage) {
        setImageUrl(cachedImage);
        return;
      }

      // Generate new image
      setIsLoading(true);
      try {
        const anglePrompts = ['from front view', 'from side angle', 'at 45-degree angle'];
        const angle = anglePrompts[Math.floor(Math.random() * anglePrompts.length)];
        const prompt = `Professional studio product photography of ${itemName}, ${angle}, isolated on a clean white background, high resolution, commercial advertisement style, cinematic lighting, 4k.`;
        const generatedUrl = await generateProductImage(prompt);

        if (generatedUrl) {
          localStorage.setItem(cachedKey, generatedUrl);
          setImageUrl(generatedUrl);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Image generation failed:', err);
        setError(true);
      }
      setIsLoading(false);
    };

    if (itemName) {
      loadOrGenerateImage();
    }
  }, [itemName]);

  const handleDownload = useCallback(() => {
    if (imageUrl && onDownload) {
      onDownload(imageUrl);
    } else if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = `${itemName.replace(/\s+/g, '_').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [imageUrl, onDownload, itemName]);

  if (isLoading) {
    return (
      <div className={`relative bg-gray-900 rounded-lg ${className} flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`relative bg-gray-900 rounded-lg ${className} flex flex-col items-center justify-center text-gray-400`}>
        <ImageOff className="w-8 h-8 mb-2" />
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      <img
        src={imageUrl}
        alt={itemName}
        className="w-full h-full object-cover rounded-lg shimmer-effect"
        onLoad={() => setTimeout(() => {}, 1000)} // Allow shimmer to show
      />
      <button
        onClick={handleDownload}
        className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
};

const CountdownTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const blackFridayEnd = new Date('2025-12-31T23:59:59').getTime();

    const updateTimer = () => {
      const now = Date.now();
      const difference = blackFridayEnd - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-4">
      <Timer className="w-5 h-5 text-neon-yellow" />
      <div className="flex gap-3">
        {[
          { label: 'DAYS', value: timeLeft.days.toString().padStart(2, '0') },
          { label: 'HRS', value: timeLeft.hours.toString().padStart(2, '0') },
          { label: 'MINS', value: timeLeft.minutes.toString().padStart(2, '0') },
          { label: 'SECS', value: timeLeft.seconds.toString().padStart(2, '0') },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xl font-bold text-neon-yellow pulse-fast">
              {item.value}
            </div>
            <div className="text-xs text-gray-300 -mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BlackNovemberHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BUNDLES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDownload = useCallback((url: string, bundleTitle: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bundleTitle.replace(/\s+/g, '_').toLowerCase()}_bundle.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return (
    <section className="relative h-screen bg-gradient-to-br from-slate-900 via-brand-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float opacity-30">
        <Zap className="w-16 h-16 text-neon-yellow" />
      </div>
      <div className="absolute top-40 right-20 animate-float-delayed opacity-20">
        <Sparkles className="w-12 h-12 text-neon-blue" />
      </div>
      <div className="absolute bottom-32 left-1/4 animate-float opacity-25">
        <Plus className="w-14 h-14 text-brand-400" />
      </div>

      {/* Interactive Background Effects */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249, 115, 22, 0.3) 0%, transparent 50%)`,
        }}
        onMouseMove={handleMouseMove}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-start p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-6xl font-bold text-white text-glow">
                  BLACK<span className="text-brand-500">.NOVEMBER</span>
                </h1>
                <p className="text-xl text-gray-300 mt-2">Deals That Shock & Awaken Your Wallet</p>
              </div>
            </div>
            <CountdownTimer />
          </div>

          {/* CTA Button */}
          <button className="group bg-gradient-to-r from-brand-500 to-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-brand-600 hover:to-brand-700 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/30 flex items-center gap-3">
            <Zap className="w-6 h-6" />
            Shop Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Carousel */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="relative w-full max-w-7xl">

            {/* Carousel Track */}
            <div
              ref={trackRef}
              className="flex gap-8 animate-slide-left"
              style={{
                width: `${BUNDLES.length * 100}%`,
                animationDuration: '60s',
              }}
            >
              {[...BUNDLES, ...BUNDLES, ...BUNDLES].map((bundle, index) => (
                <div
                  key={`${bundle.id}-${index}`}
                  className="flex-none w-full max-w-md cursor-pointer group"
                  onClick={() => setCurrentSlide(bundle.id - 1)}
                >
                  <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${bundle.color} backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-white/10`}>
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold text-white">{bundle.title}</h3>
                      <p className="text-gray-300 text-sm max-w-[280px] mx-auto">{bundle.tagline}</p>

                      {/* Items Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <HeroImage
                            itemName={bundle.item1.name}
                            className="w-full h-24"
                            onDownload={(url) => handleDownload(url, bundle.title)}
                          />
                          <p className="text-xs text-gray-300 text-center">{bundle.item1.name}</p>
                        </div>
                        <div className="space-y-2">
                          <HeroImage
                            itemName={bundle.item2.name}
                            className="w-full h-24"
                            onDownload={(url) => handleDownload(url, bundle.title)}
                          />
                          <p className="text-xs text-gray-300 text-center">{bundle.item2.name}</p>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg line-through text-gray-400">{bundle.originalPrice}</span>
                          <span className="text-3xl font-bold text-brand-400">{bundle.bundlePrice}</span>
                        </div>
                        <div className="text-sm font-semibold text-green-400">Save {bundle.save}!</div>
                      </div>

                      {/* Buy Button */}
                      <button className="w-full bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 rounded-lg font-semibold hover:from-brand-600 hover:to-brand-700 transition-all hover:shadow-lg hover:shadow-brand-500/50 flex items-center justify-center gap-2 group">
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {BUNDLES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide % BUNDLES.length
                      ? 'bg-brand-500 scale-125'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentSlide(prev => (prev - 1 + BUNDLES.length) % BUNDLES.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % BUNDLES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
