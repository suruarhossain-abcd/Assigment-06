import React from 'react';
import Image from 'next/image';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-[#23262e] bg-[#15171d] px-5 py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Image
            src={logo}
            alt="FitLog Logo"
            width={32}
            height={32}
            className="h-6 w-6 object-contain"
          />
          <span className="font-['Oswald'] text-sm font-bold uppercase tracking-wider text-white">
            FitLog
          </span>
        </div>

        <p className="text-center text-xs text-[#6b6f7a] sm:text-right">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
