import React from 'react';
import Image from 'next/image';
import bannerImg from '@/assets/banner.png';

const MainBar = () => {
  return (
    <section className="container mx-auto px-5 py-10">
      <main className="flex min-h-[375px] flex-col items-start justify-between gap-10 rounded-2xl border border-[#23262e] bg-[#15171d] px-12 py-12 md:flex-row md:items-center">
        {/* Left: text */}
        <div className="flex flex-col">
          <h3 className="text-[11px] font-semibold uppercase tracking-[1.5px] text-[#c2f800]">
            WORKOUT LIBRARY
          </h3>

          <h1 className="mt-5 font-['Oswald'] text-[60px] font-bold uppercase leading-none tracking-[-1.5px] text-white">
            TRAIN WITH INTENT. LOG <br />
            EVERY SET.
          </h1>

          <p className="mt-4 max-w-[512px] text-base leading-6 text-[#a1a4ad]">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <button
            type="button"
            className="mt-5 w-fit rounded-md bg-[#c2f800] px-5 py-3 text-xs font-bold uppercase text-[#0d0e12] transition hover:brightness-110"
          >
            BROWSE WORKOUTS
          </button>
        </div>

        
        <div className="flex w-full justify-center md:w-auto md:pr-24">
          <Image
            src={bannerImg}
            alt="Muscle anatomy on a preacher curl machine"
            priority
            className="h-[300px] w-auto object-contain"
          />
        </div>
      </main>
    </section>
  );
};

export default MainBar;
