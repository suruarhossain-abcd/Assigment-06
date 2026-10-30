'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClipboardList, Bookmark } from 'lucide-react';

import fitlog from '@/assets/logo.png';

const Navbar = () => {
  const pathname = usePathname();

  const [planCount, setPlanCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      try {
        const plan = JSON.parse(localStorage.getItem('fitlog-plan') || '[]');
        const saved = JSON.parse(localStorage.getItem('fitlog-saved') || '[]');

        setPlanCount(Array.isArray(plan) ? plan.length : 0);
        setSavedCount(Array.isArray(saved) ? saved.length : 0);
      } catch (error) {
        console.error('Failed to load FitLog data:', error);
      }
    };

    updateCounts();

    window.addEventListener('storage', updateCounts);
    window.addEventListener('fitlog-update', updateCounts);

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('fitlog-update', updateCounts);
    };
  }, []);

  const linkClass = href =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      pathname === href
        ? 'bg-[#c2f800]/15 text-[#c2f800]'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0c10]/95 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between px-5 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={fitlog}
            alt="FitLog logo"
            width={28}
            height={28}
            priority
            className="h-7 w-7 object-contain"
          />

          <span className="font-['Oswald'] text-base font-bold uppercase tracking-wider text-white">
            FitLog
          </span>
        </Link>

        <ul className="hidden items-center gap-2 sm:flex">
          <li>
            <Link href="/" className={linkClass('/')}>
              Workouts
            </Link>
          </li>

          <li>
            <Link href="/Plan" className={linkClass('/Plan')}>
              My Plan
            </Link>
          </li>
        </ul>

        <div className="flex shrink-0 items-center gap-3 text-xs sm:gap-5">
          <Link
            href="/Plan"
            className={`flex items-center gap-2 font-medium transition ${
              pathname === '/Plan'
                ? 'text-[#c2f800]'
                : 'text-white hover:text-[#c2f800]'
            }`}
          >
            <ClipboardList size={16} />
            <span>My Plan</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c2f800] px-1.5 text-[11px] font-bold text-[#0b0c10]">
              {planCount}
            </span>
          </Link>

          <Link
            href="/saved"
            className={`flex items-center gap-2 font-medium transition ${
              pathname === '/saved'
                ? 'text-[#c2f800]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark size={16} />
            <span>Saved</span>

            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/20 px-1.5 text-[11px] font-bold text-gray-300">
              {savedCount}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
