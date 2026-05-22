import React from 'react';
import { Factory, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-emerald-50 py-10 md:py-12 relative overflow-hidden">
      <div className="absolute inset-0 oem-grid opacity-[0.08] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-12 mb-10 md:mb-12">
          {/* Brand & Social */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5 w-fit">
              <div className="w-7 h-7 bg-oem-primary rounded-lg flex items-center justify-center text-white">
                <Factory className="w-3.5 h-3.5" />
              </div>
              <span className="text-lg font-display font-extrabold tracking-tight text-oem-dark uppercase">
                ENSU<span className="text-oem-primary">.ai</span>
              </span>
            </div>
            <p className="text-[11px] text-oem-dark/40 font-medium max-w-[200px] leading-relaxed">
              Platform AI jenama pertama Malaysia untuk founder yang berjiwa.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`Ikuti kami di ${label}`}
                  className="w-8 h-8 rounded-lg border border-emerald-100 flex items-center justify-center text-oem-dark/30 hover:text-oem-primary hover:border-emerald-300 transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-10 md:gap-x-14 gap-y-6">
            <div className="space-y-3.5">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary">Platform</h4>
              <ul className="space-y-2.5">
                {['Diagnosa', 'Kilang Pintar', 'API'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-oem-dark/40 text-[10px] font-bold uppercase tracking-widest hover:text-oem-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3.5">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-oem-primary">Legal</h4>
              <ul className="space-y-2.5">
                {['Privasi', 'Terma'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-oem-dark/40 text-[10px] font-bold uppercase tracking-widest hover:text-oem-primary transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Status Badge */}
          <div className="bg-emerald-50/50 px-4 py-2 rounded-xl border border-emerald-100 flex items-center gap-2 self-start">
            <div className="w-1.5 h-1.5 rounded-full bg-oem-primary animate-pulse" />
            <span className="text-[9px] font-black text-oem-dark/40 uppercase tracking-widest">Sistem Aktif</span>
          </div>
        </div>

        <div className="pt-7 border-t border-emerald-50 flex flex-col md:flex-row justify-between items-center gap-3 text-[9px] font-bold text-oem-dark/20 uppercase tracking-[0.2em]">
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
