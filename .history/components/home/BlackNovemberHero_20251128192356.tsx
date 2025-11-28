import React, { useState, useEffect, useRef } from 'react';
import { Timer, Zap, ArrowRight, ChevronRight, ChevronLeft, Plus, Loader2, Sparkles, Download, ImageOff } from 'lucide-react';
import { generateProductImage } from '../../lib/gemini';

// Internal component to handle AI generation, caching, and display for Hero images
interface HeroImageProps {
  productName: string;
  angleIndex: number; // 0=Front, 1=Side/Top, 2=Lifestyle
  bundleId: number;
  itemId: number; // 1 or 2
  className?: string;
  isBackground?: boolean;
}

const HeroImage: React.FC<HeroImageProps> = ({ productName, angleIndex, bundleId, itemId, className = "", isBackground = false }) => {
  const [src, setSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  
  // Create a unique key for LocalStorage
  // e.g., "hero-img-1-item-1-angle-0"
  const storageKey = `hero-img-${bundleId}-item-${itemId}-angle-${angleIndex}`;

  useEffect(() => {
    let isMounted = true;

    const loadOrGenerate = async () => {
      // 1. Try Local Storage first
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        if (isMounted) {
          setSrc(cached);
          setLoading(false);
          setIsAiGenerated(true);
        }
        return;
      }

      // 2. Generate if not found
      // Add descriptive suffix based on index to get variety
      const angles = [
        "cinematic front view product shot, studio lighting",
        "minimalist side profile or top down view, elegant",
        "lifestyle context shot, photorealistic, depth of field"
      ];
      const anglePrompt = angles[angleIndex] || angles[0];
      const prompt = `${productName} ${anglePrompt}`;

      // Call Gemini API
      try {
        const url = await generateProductImage(prompt);
        if (url && isMounted) {
          setSrc(url);
          setIsAiGenerated(true);
          // Save to LocalStorage
          try {
            localStorage.setItem(storageKey, url);
          } catch (e) {
            console.warn("Storage quota exceeded");
          }
        }
      } catch (err) {
        console.error("Hero generation failed", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadOrGenerate();

    return () => { isMounted = false; };
  }, [productName, angleIndex, storageKey]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-${angleIndex}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-900/50 ${className}`}>
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!src) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-800 ${className}`}>
        <ImageOff className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full group/image ${className}`}>
      <img src={src} alt={productName} className={`w-full h-full object-cover ${className}`} />
      
      {/* Download Button (Only for non-background images) */}
      {!isBackground && isAiGenerated && (
        <button 
          onClick={handleDownload}
          title="Download Image"
          className="absolute top-2 right-2 p-2 bg-black/60 backdrop-blur-md rounded-full text-white opacity-0 group-hover/image:opacity-100 transition-opacity hover:bg-brand-600 z-50"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* AI Badge */}
      {!isBackground && isAiGenerated && (
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white flex items-center gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity pointer-events-none">
          <Sparkles className="w-3 h-3 text-brand-400" /> AI
        </div>
      )}
    </div>
  );
};

// Map product names to local image files
const getProductImage = (productName: string): string => {
  const imageMap: { [key: string]: string } = {
    "MacBook Air 15\"": "/images/products/macbook-air-15_-m3-chip.png",
    "Sony XM5 Headphones": "/images/products/sony-wh-1000xm5-wireless-headphones.png",
    "PlayStation 5 Slim": "/images/products/playstation-5-console-(slim).png",
    "4K OLED TV 55\"": "/images/products/lg-c3-55_-oled-evo-4k-tv.png",
    "iPhone 15 Pro": "/images/products/apple-iphone-15-pro-max-(256gb).png",
    "Anker Power Bank": "/images/products/anker-737-power-bank.png"
  };
  return imageMap[productName] || "";
};

// Set images to use local product images
const BUNDLES = [
  {
    id: 1,
    title: "Streamer Starter Pack",
    item1: { 
      name: "MacBook Air 15\"", 
      // 3 slots for 3 angles using the same local image
      images: [getProductImage("MacBook Air 15\""), getProductImage("MacBook Air 15\""), getProductImage("MacBook Air 15\"")] 
    },
    item2: { 
      name: "Sony XM5 Headphones", 
      images: [getProductImage("Sony XM5 Headphones"), getProductImage("Sony XM5 Headphones"), getProductImage("Sony XM5 Headphones")] 
    },
    originalPrice: "KSh 227,500",
    bundlePrice: "KSh 199,000",
    save: "KSh 28,500",
    tagline: "Silence the noise. Amplify the work.",
    color: "from-blue-900/40 to-black"
  },
  {
    id: 2,
    title: "Console Command Kit",
    item1: { 
      name: "PlayStation 5 Slim", 
      images: [getProductImage("PlayStation 5 Slim"), getProductImage("PlayStation 5 Slim"), getProductImage("PlayStation 5 Slim")] 
    },
    item2: { 
      name: "4K OLED TV 55\"", 
      images: [getProductImage("4K OLED TV 55\""), getProductImage("4K OLED TV 55\""), getProductImage("4K OLED TV 55\"")] 
    },
    originalPrice: "KSh 264,000",
    bundlePrice: "KSh 230,000",
    save: "KSh 34,000",
    tagline: "Next-gen gaming meets cinema reality.",
    color: "from-purple-900/40 to-black"
  },
  {
    id: 3,
    title: "Mobile Creator Suite",
    item1: { 
      name: "iPhone 15 Pro", 
      images: [getProductImage("iPhone 15 Pro"), getProductImage("iPhone 15 Pro"), getProductImage("iPhone 15 Pro")] 
    },
    item2: { 
      name: "Anker Power Bank", 
      images: [getProductImage("Anker Power Bank"), getProductImage("Anker Power Bank"), getProductImage("Anker Power Bank")] 
    },
    originalPrice: "KSh 233,500",
    bundlePrice: "KSh 210,000",
    save: "KSh 23,500",
    tagline: "Capture everything. Never run empty.",
    color: "from-amber-900/40 to-black"
  }
];

export const BlackNovemberHero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [subImageIndex, setSubImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });
  
  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return { h: 23, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Main Slide Auto-Slide Logic (Bundles)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % BUNDLES.length);
      setSubImageIndex(0); // Reset sub images when slide changes
    }, 12000); // Increased time to allow AI images to generate/load comfortably
    return () => clearInterval(slideTimer);
  }, []);

  // Sub Image Auto-Slide Logic (Product Angles)
  useEffect(() => {
    const subTimer = setInterval(() => {
      setSubImageIndex(prev => prev + 1);
    }, 3000); // Change product angle every 3s
    return () => clearInterval(subTimer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % BUNDLES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + BUNDLES.length) % BUNDLES.length);

  return (
    <div className="relative bg-black text-white h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center">
      
      {/* --- BACKGROUND LAYER --- */}
      {BUNDLES.map((bundle, index) => (
        <div 
          key={bundle.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Split Background Images - Using HeroImage Component for AI Gen */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative overflow-hidden">
               <div className="w-full h-full opacity-20 scale-110 blur-sm transform origin-left transition-transform duration-[10000ms]">
                  <HeroImage 
                    productName={bundle.item1.name} 
                    angleIndex={0} 
                    bundleId={bundle.id} 
                    itemId={1}
                    isBackground={true}
                  />
               </div>
               <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
            </div>
            <div className="w-1/2 h-full relative overflow-hidden">
               <div className="w-full h-full opacity-20 scale-110 blur-sm transform origin-right transition-transform duration-[10000ms]">
                 <HeroImage 
                    productName={bundle.item2.name} 
                    angleIndex={0} 
                    bundleId={bundle.id} 
                    itemId={2}
                    isBackground={true}
                  />
               </div>
               <div className="absolute inset-0 bg-gradient-to-l from-black via-transparent to-transparent"></div>
            </div>
          </div>
          
          {/* Color Overlay Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-t ${bundle.color} opacity-80 mix-blend-multiply`}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
        </div>
      ))}

      {/* --- MAIN CONTENT OVERLAY --- */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
        
        {/* Top Header / Glitch Text */}
        <div className="absolute top-8 left-4 md:left-8">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic opacity-20 select-none">
              BLACK NOV
            </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full pt-16 pb-8">
          
          {/* LEFT: Text & Info */}
          <div className="lg:col-span-5 space-y-8 relative z-30 pointer-events-none md:pointer-events-auto">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-600 text-white font-bold text-xs uppercase tracking-widest animate-pulse pointer-events-auto">
                <Zap className="w-3 h-3" /> Flash Bundle Deal
             </div>

             <div className="space-y-2 pointer-events-auto">
               {BUNDLES.map((bundle, index) => (
                  index === currentSlide && (
                    <div key={index} className="animate-float">
                        <h2 className="text-5xl md:text-7xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
                          {bundle.title}
                        </h2>
                        <p className="text-xl md:text-2xl text-brand-500 font-medium italic mt-4">
                          "{bundle.tagline}"
                        </p>
                    </div>
                  )
               ))}
             </div>

             {/* Pricing Card */}
             <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl inline-block min-w-[300px] pointer-events-auto">
                {BUNDLES.map((bundle, index) => (
                   index === currentSlide && (
                     <div key={index} className="space-y-4">
                        <div className="flex justify-between items-end text-sm text-gray-400 font-mono">
                           <span>COMBINED VALUE</span>
                           <span className="line-through decoration-red-500">{bundle.originalPrice}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-4xl font-bold text-white">{bundle.bundlePrice}</span>
                           <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">-{(parseInt(bundle.save.replace(/\D/g, '')) / parseInt(bundle.originalPrice.replace(/\D/g, '')) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="h-px bg-white/20 w-full"></div>
                        <div className="flex justify-between items-center text-brand-400 text-sm">
                           <span>You Save:</span>
                           <span className="font-bold">{bundle.save}</span>
                        </div>
                     </div>
                   )
                ))}
             </div>

             {/* CTA */}
             <div className="flex flex-wrap gap-4 pointer-events-auto">
                <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wide overflow-hidden hover:bg-brand-500 transition-colors rounded-lg">
                  <span className="relative flex items-center gap-2">
                    Grab This Bundle <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                {/* Countdown Small */}
                <div className="flex items-center gap-3 text-gray-400 font-mono border border-gray-700 rounded-lg px-4 bg-black/40">
                    <Timer className="w-4 h-4 text-brand-500" />
                    <div className="flex gap-1 text-sm">
                      <span className="text-white font-bold">{timeLeft.h.toString().padStart(2, '0')}</span>:
                      <span className="text-white font-bold">{timeLeft.m.toString().padStart(2, '0')}</span>:
                      <span className="text-white font-bold">{timeLeft.s.toString().padStart(2, '0')}</span>
                    </div>
                </div>
             </div>
          </div>

          {/* RIGHT: Visual Composition (Dynamic Product Carousel) */}
          <div className="lg:col-span-7 relative h-full flex items-center justify-center pb-20 md:pb-32">
             {BUNDLES.map((bundle, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ${index === currentSlide ? 'opacity-100 scale-100 translate-y-0 z-20' : 'opacity-0 scale-95 translate-y-10 z-0 pointer-events-none'}`}
                >
                   {/* Abstract Circle Backgrounds */}
                   <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-white/10 animate-[spin_20s_linear_infinite]"></div>
                   <div className="absolute w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full border border-dashed border-white/20 animate-[spin_15s_linear_infinite_reverse]"></div>

                   {/* Item 1 Carousel (Left Tilted) */}
                   <div className="relative z-10 transform -rotate-6 translate-x-4 md:translate-x-10 group cursor-pointer hover:z-30 hover:scale-105 transition-all duration-300">
                      <div className="w-40 h-40 md:w-80 md:h-80 bg-white p-2 rounded-2xl shadow-2xl rotate-3 group-hover:rotate-0 transition-transform relative">
                          <div className="w-full h-full relative overflow-hidden rounded-xl bg-gray-100">
                             {/* Inner Carousel for Item 1 */}
                              {bundle.item1.images.map((_, imgIdx) => (
                                <div 
                                  key={imgIdx}
                                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${imgIdx === subImageIndex % bundle.item1.images.length ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
                                >
                                  <HeroImage 
                                    productName={bundle.item1.name} 
                                    angleIndex={imgIdx} 
                                    bundleId={bundle.id}
                                    itemId={1}
                                  />
                                </div>
                              ))}
                          </div>
                          
                          {/* Image Progress Indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {bundle.item1.images.map((_, dotIdx) => (
                              <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${dotIdx === subImageIndex % bundle.item1.images.length ? 'bg-brand-500' : 'bg-black/20'}`} />
                            ))}
                          </div>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white text-[10px] md:text-xs px-3 py-1 rounded-full border border-gray-700 whitespace-nowrap shadow-lg">
                         {bundle.item1.name}
                      </div>
                   </div>

                   {/* Plus Sign */}
                   <div className="relative z-20 mx-[-10px] md:mx-[-20px] bg-brand-600 text-white rounded-full p-1.5 md:p-2 border-4 border-black shadow-xl animate-pulse">
                      <Plus className="w-4 h-4 md:w-8 md:h-8" />
                   </div>

                   {/* Item 2 Carousel (Right Tilted) */}
                   <div className="relative z-0 transform rotate-6 -translate-x-4 -translate-y-8 md:-translate-x-10 md:-translate-y-20 group cursor-pointer hover:z-30 hover:scale-105 transition-all duration-300">
                      <div className="w-40 h-40 md:w-80 md:h-80 bg-white p-2 rounded-2xl shadow-2xl -rotate-3 group-hover:rotate-0 transition-transform relative">
                           <div className="w-full h-full relative overflow-hidden rounded-xl bg-gray-100">
                              {/* Inner Carousel for Item 2 */}
                              {bundle.item2.images.map((_, imgIdx) => (
                                <div 
                                  key={imgIdx}
                                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${imgIdx === subImageIndex % bundle.item2.images.length ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} 
                                >
                                  <HeroImage 
                                    productName={bundle.item2.name} 
                                    angleIndex={imgIdx} 
                                    bundleId={bundle.id}
                                    itemId={2}
                                  />
                                </div>
                              ))}
                           </div>
                           
                          {/* Image Progress Indicator */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                            {bundle.item2.images.map((_, dotIdx) => (
                              <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-colors shadow-sm ${dotIdx === subImageIndex % bundle.item2.images.length ? 'bg-brand-500' : 'bg-black/20'}`} />
                            ))}
                          </div>
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur text-white text-[10px] md:text-xs px-3 py-1 rounded-full border border-gray-700 whitespace-nowrap shadow-lg">
                         {bundle.item2.name}
                      </div>
                   </div>
                </div>
             ))}
          </div>

        </div>

        {/* Main Slider Navigation Dots/Arrows */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-30">
           <button onClick={prevSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
             <ChevronLeft className="w-6 h-6" />
           </button>
           
           <div className="flex gap-2">
             {BUNDLES.map((_, i) => (
               <button 
                 key={i}
                 onClick={() => setCurrentSlide(i)}
                 className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-brand-500' : 'w-2 bg-gray-600 hover:bg-gray-400'}`}
               />
             ))}
           </div>

           <button onClick={nextSlide} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white">
             <ChevronRight className="w-6 h-6" />
           </button>
        </div>
      </div>
    </div>
  );
};