import React from 'react';
import { Factory, Github, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-emerald-50 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full oem-grid opacity-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
          {/* Brand & Social */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 group cursor-pointer w-fit">
              <div className="w-7 h-7 bg-oem-primary rounded-lg flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                <Factory className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-display font-extrabold tracking-tight text-oem-dark uppercase">
                ENSU<span className="text-oem-primary">.ai</span>
              </span>
            </div>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-oem-dark/20 hover:text-oem-primary transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Minimal Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary">Platform</h4>
              <ul className="space-y-3">
                {['Diagnosa', 'Kilang Pintar', 'API'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-oem-dark/40 text-[10px] font-bold uppercase tracking-widest hover:text-oem-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary">Legal</h4>
              <ul className="space-y-3">
                {['Privasi', 'Terma'].map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-oem-dark/40 text-[10px] font-bold uppercase tracking-widest hover:text-oem-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-oem-primary animate-pulse" />
            <span className="text-[9px] font-black text-oem-dark/50 uppercase tracking-widest">v5.28 Active</span>
          </div>
        </div>

        {/* Simple Bottom Bar */}
        <div className="pt-8 border-t border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-bold text-oem-dark/20 uppercase tracking-[0.2em]">
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
