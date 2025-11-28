import React from 'react';
import { Phone, Mail, Truck } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-slate-900 text-white py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <a href="tel:+254700123456" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
            <Phone className="w-3.5 h-3.5" />
            <span>+254 700 123 456</span>
          </a>
          <a href="mailto:support@elecro.mart" className="flex items-center gap-1.5 hover:text-brand-500 transition-colors">
            <Mail className="w-3.5 h-3.5" />
            <span>support@elecro.mart</span>
          </a>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <Truck className="w-3.5 h-3.5" />
          <span>Free shipping on orders over KSh 5,000</span>
        </div>
      </div>
    </div>
  );
};