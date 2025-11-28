import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold tracking-tight">
              Elecro<span className="text-brand-500">.Mart</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted online marketplace for quality products in Kenya. Experience seamless shopping with secure payments and fast delivery.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button 
                  key={i} 
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors duration-300"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Shopping</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Deals'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-500 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Information */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Information</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms & Conditions', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-brand-500 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <span>Moi Avenue, CBD<br/>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>+254 700 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-500 flex-shrink-0" />
                <span>support@elecro.mart</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>
            © {new Date().getFullYear()} Elecro.Mart. All rights reserved.
          </div>
          <div className="flex gap-6">
             <button className="hover:text-white transition-colors">Privacy</button>
             <button className="hover:text-white transition-colors">Terms</button>
             <button className="hover:text-white transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};