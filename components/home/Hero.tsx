import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
          alt="Shopping Banner"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            Flash Sales Live Now
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            Discover Quality <br/>
            <span className="text-brand-500">Kenyan Brands</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Shop the latest electronics, fashion trends, and home essentials with fast delivery across Nairobi and countrywide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-600/20">
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/10">
              View Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
