import React from 'react';
import { Factory, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="hidden md:block bg-white border-t border-emerald-50 py-5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-oem-primary rounded-lg flex items-center justify-center text-white">
              <Factory className="w-3 h-3" />
            </div>
            <span className="text-sm font-extrabold tracking-tight text-oem-dark uppercase">
              ENSU<span className="text-oem-primary">.ai</span>
            </span>
          </div>

{/* Right: social + status */}
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-oem-dark/20 hover:text-oem-primary transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
            <div className="bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-oem-primary animate-pulse" />
              <span className="text-[9px] font-black text-oem-dark/50 uppercase tracking-widest">v5.28 Active</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-50 flex justify-between text-[9px] font-bold text-oem-dark/20 uppercase tracking-[0.2em]">
          <span>© 2026 Ensu.AI Smart Foundry</span>
          <div className="flex gap-4">
            <span className="text-oem-primary/40">MY · SG · ID</span>
            <span>Dibina dengan Jiwa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
