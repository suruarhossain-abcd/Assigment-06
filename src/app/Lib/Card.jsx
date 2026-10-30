import React from 'react';
import Link from 'next/link';
import { Clock, Flame, Star } from 'lucide-react';

const AllCard = async () => {
  const res = await fetch('https://api.abcz.workers.dev/api/fitlog');

  if (!res.ok) {
    throw new Error(`Failed to fetch cards: ${res.status}`);
  }

  const cards = await res.json();

  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(item => (
        <Link
          href={`/workouts/${item.id}`}
          key={item.id}
          className="block group"
        >
          <div className="h-full overflow-hidden rounded-2xl border border-[#23262e] bg-[#15171d] transition duration-300 hover:-translate-y-1 hover:border-[#c2f800]/50 cursor-pointer">
            <figure className="h-48 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            </figure>

            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {item.muscleGroups.map(group => (
                  <span
                    key={group}
                    className="rounded-full bg-[#c2f800] px-3 py-1 text-[11px] font-bold uppercase leading-none text-[#0d0e12]"
                  >
                    {group}
                  </span>
                ))}
              </div>

              <h2 className="mt-4 font-['Oswald'] text-xl font-bold uppercase tracking-wide text-white">
                {item.name}
              </h2>

              <p className="mt-1 text-sm text-[#a1a4ad]">{item.equipment}</p>

              <div className="mt-5 flex items-center gap-5 border-t border-[#23262e] pt-4 text-sm text-[#a1a4ad]">
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {item.duration} min
                </span>

                <span className="flex items-center gap-1.5">
                  <Flame size={16} />
                  {item.caloriesBurned} kcal
                </span>

                <span className="flex items-center gap-1.5">
                  <Star size={16} />
                  {item.rating}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default AllCard;
