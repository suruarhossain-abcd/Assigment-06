'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, Clock, Flame } from 'lucide-react';

const SavedPage = () => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  useEffect(() => {
    const loadSavedWorkouts = () => {
      const saved = JSON.parse(localStorage.getItem('fitlog-saved') || '[]');

      setSavedWorkouts(saved);
    };

    loadSavedWorkouts();

    window.addEventListener('fitlog-update', loadSavedWorkouts);

    return () => {
      window.removeEventListener('fitlog-update', loadSavedWorkouts);
    };
  }, []);

  const handleRemove = id => {
    const updatedWorkouts = savedWorkouts.filter(
      workout => String(workout.id) !== String(id),
    );

    localStorage.setItem('fitlog-saved', JSON.stringify(updatedWorkouts));

    setSavedWorkouts(updatedWorkouts);

    window.dispatchEvent(new Event('fitlog-update'));
  };

  return (
    <main className="min-h-screen bg-[#0b0c10] px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <Bookmark className="text-[#c2f800]" size={28} />

            <p className="text-sm font-bold tracking-[3px] text-[#c2f800]">
              YOUR COLLECTION
            </p>
          </div>

          <h1 className="font-['Oswald'] text-4xl font-bold uppercase md:text-5xl">
            Saved Workouts
          </h1>

          <p className="mt-3 text-sm text-gray-400">
            Your favorite workouts, saved for later.
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-[#23262e] bg-[#151820] p-5">
          <p className="text-sm text-gray-400">Total Saved Workouts</p>

          <h2 className="mt-2 text-3xl font-bold text-[#c2f800]">
            {savedWorkouts.length}
          </h2>
        </div>

        {savedWorkouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#343944] py-20 text-center">
            <Bookmark className="mx-auto mb-4 text-gray-500" size={45} />

            <h2 className="mb-2 text-xl font-bold">No Saved Workouts Yet</h2>

            <p className="mb-6 text-sm text-gray-500">
              Save your favorite workouts to see them here.
            </p>

            <Link
              href="/workouts"
              className="inline-block rounded-lg bg-[#c2f800] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#a9d900]"
            >
              Explore Workouts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedWorkouts.map(workout => (
              <div
                key={workout.id}
                className="overflow-hidden rounded-2xl border border-[#23262e] bg-[#151820] transition hover:-translate-y-1"
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={workout.image}
                    alt={workout.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="mb-4 font-['Oswald'] text-xl font-bold uppercase">
                    {workout.name}
                  </h3>

                  <div className="mb-5 flex flex-wrap gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                      <Clock size={15} className="text-[#c2f800]" />
                      {workout.duration} min
                    </span>

                    <span className="flex items-center gap-2">
                      <Flame size={15} className="text-[#c2f800]" />
                      {workout.calories} kcal
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="flex-1 rounded-lg bg-[#c2f800] py-3 text-center text-sm font-bold text-black transition hover:bg-[#a9d900]"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => handleRemove(workout.id)}
                      className="rounded-lg border border-[#343944] px-4 text-red-400 transition hover:border-red-500 hover:bg-red-500/10"
                      aria-label="Remove saved workout"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default SavedPage;
