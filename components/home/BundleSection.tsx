import React from 'react';
import { Plus, ArrowRight, Gift } from 'lucide-react';

const BUNDLES = [
  {
    id: 1,
    title: " The 'Streamer Starter' Pack",
    item1: { name: "MacBook Air 15\"", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&q=80" },
    item2: { name: "Sony XM5 Headphones", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80" },
    originalPrice: "KSh 227,500",
    bundlePrice: "KSh 199,000",
    save: "KSh 28,500"
  },
  {
    id: 2,
    title: "Console Command Bundle",
    item1: { name: "PlayStation 5 Slim", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80" },
    item2: { name: "4K OLED TV 55\"", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80" },
    originalPrice: "KSh 264,000",
    bundlePrice: "KSh 230,000",
    save: "KSh 34,000"
  },
  {
    id: 3,
    title: "Mobile Creator Kit",
    item1: { name: "iPhone 15 Pro", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80" },
    item2: { name: "Anker Power Bank", image: "https://images.unsplash.com/photo-1620713755490-67566d71b563?w=400&q=80" },
    originalPrice: "KSh 233,500",
    bundlePrice: "KSh 210,000",
    save: "KSh 23,500"
  }
];

export const BundleSection: React.FC = () => {
  return (
    <section className="bg-zinc-900 border-y border-zinc-800 overflow-hidden">
      {/* Ticker Tape */}
      <div className="bg-brand-600 text-black py-2 overflow-hidden rotate-1 scale-105 shadow-xl relative z-10">
        <div className="whitespace-nowrap animate-slide-left flex gap-8 font-black uppercase tracking-wider text-sm md:text-base">
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              <span>Black November Bundles</span>
              <span className="text-white">•</span>
              <span>Better Together</span>
              <span className="text-white">•</span>
              <span>Save Big</span>
              <span className="text-white">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Power Couples <span className="text-brand-500">.</span>
            </h2>
            <p className="text-gray-400">Why buy one when two is cheaper?</p>
          </div>
          <button className="text-brand-500 hover:text-brand-400 font-medium flex items-center gap-2 transition-colors">
            View All Bundles <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {BUNDLES.map((bundle) => (
            <div key={bundle.id} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:bg-zinc-800 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                SAVE {bundle.save}
              </div>
              
              <h3 className="text-white font-bold text-lg mb-6 group-hover:text-brand-500 transition-colors">
                {bundle.title}
              </h3>

              <div className="flex items-center justify-center mb-8 relative">
                <div className="relative z-0 transform -rotate-6 transition-transform group-hover:rotate-0 duration-500">
                  <div className="w-28 h-28 bg-white p-1 rounded-lg shadow-lg">
                    <img src={bundle.item1.image} alt={bundle.item1.name} className="w-full h-full object-cover rounded" />
                  </div>
                </div>
                
                <div className="relative z-20 mx-[-10px] bg-black text-white rounded-full p-1 border-2 border-zinc-700">
                  <Plus className="w-4 h-4" />
                </div>

                <div className="relative z-10 transform rotate-6 transition-transform group-hover:rotate-0 duration-500">
                  <div className="w-28 h-28 bg-white p-1 rounded-lg shadow-lg">
                    <img src={bundle.item2.image} alt={bundle.item2.name} className="w-full h-full object-cover rounded" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Combined Value:</span>
                  <span className="line-through decoration-red-500">{bundle.originalPrice}</span>
                </div>
                
                <div className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-brand-500/30">
                  <span className="text-gray-300 text-sm">Bundle Price</span>
                  <span className="text-xl font-bold text-brand-500">{bundle.bundlePrice}</span>
                </div>

                <button className="w-full py-3 bg-white text-black font-bold rounded hover:bg-brand-500 hover:text-white transition-all flex items-center justify-center gap-2">
                  <Gift className="w-4 h-4" />
                  Grab The Bundle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};