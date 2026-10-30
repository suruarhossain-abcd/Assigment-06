'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  Flame,
  Trash2,
  Dumbbell,
  ChevronDown,
  Star,
  CheckCircle2,
} from 'lucide-react';

const MyPlanPage = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayPlan, setTodayPlan] = useState([]);
  const [savedPlan, setSavedPlan] = useState([]);

  const [sortBy, setSortBy] = useState('rating');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const today = JSON.parse(localStorage.getItem('fitlog-plan') || '[]');
        const saved = JSON.parse(localStorage.getItem('fitlog-saved') || '[]');

        let apiWorkouts = [];

        try {
          const res = await fetch('https://api.abcz.workers.dev/api/fitlog');

          if (res.ok) {
            const data = await res.json();
            apiWorkouts = Array.isArray(data) ? data : [];
          }
        } catch (error) {
          console.error('Failed to fetch workout ratings:', error);
        }

        const addRatings = list =>
          list.map(item => {
            const apiWorkout = apiWorkouts.find(
              workout => String(workout.id) === String(item.id),
            );

            return {
              ...item,
              rating: Number(apiWorkout?.rating ?? item.rating) || 0,
            };
          });

        const updatedToday = addRatings(Array.isArray(today) ? today : []);
        const updatedSaved = addRatings(Array.isArray(saved) ? saved : []);

        setTodayPlan(updatedToday);
        setSavedPlan(updatedSaved);

        localStorage.setItem('fitlog-plan', JSON.stringify(updatedToday));
        localStorage.setItem('fitlog-saved', JSON.stringify(updatedSaved));
      } catch (error) {
        console.error('Failed to load workouts:', error);
        setTodayPlan([]);
        setSavedPlan([]);
      }
    };

    loadPlans();

    window.addEventListener('fitlog-update', loadPlans);

    return () => {
      window.removeEventListener('fitlog-update', loadPlans);
    };
  }, []);

  const currentPlan = activeTab === 'today' ? todayPlan : savedPlan;

  const sortedPlan = useMemo(() => {
    return [...currentPlan].sort((a, b) => {
      let valueA;
      let valueB;

      if (sortBy === 'rating') {
        valueA = Number(a.rating) || 0;
        valueB = Number(b.rating) || 0;
      } else if (sortBy === 'duration') {
        valueA = Number(a.duration) || 0;
        valueB = Number(b.duration) || 0;
      } else {
        valueA = Number(a.calories) || 0;
        valueB = Number(b.calories) || 0;
      }

      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
    });
  }, [currentPlan, sortBy, sortOrder]);

  const totalDuration = useMemo(() => {
    return currentPlan.reduce(
      (total, item) => total + Number(item.duration || 0),
      0,
    );
  }, [currentPlan]);

  const totalCalories = useMemo(() => {
    return currentPlan.reduce(
      (total, item) => total + Number(item.calories || 0),
      0,
    );
  }, [currentPlan]);

  const handleRemove = id => {
    const key = activeTab === 'today' ? 'fitlog-plan' : 'fitlog-saved';

    const updatedPlan = currentPlan.filter(
      item => String(item.id) !== String(id),
    );

    localStorage.setItem(key, JSON.stringify(updatedPlan));

    if (activeTab === 'today') {
      setTodayPlan(updatedPlan);
    } else {
      setSavedPlan(updatedPlan);
    }

    window.dispatchEvent(new Event('fitlog-update'));
  };

  const handleMarkAsDone = id => {
    const key = activeTab === 'today' ? 'fitlog-plan' : 'fitlog-saved';

    const updatedPlan = currentPlan.map(item =>
      String(item.id) === String(id) ? { ...item, isDone: true } : item,
    );

    localStorage.setItem(key, JSON.stringify(updatedPlan));

    if (activeTab === 'today') {
      setTodayPlan(updatedPlan);
    } else {
      setSavedPlan(updatedPlan);
    }

    window.dispatchEvent(new Event('fitlog-update'));
  };

  const sortOptions = [
    { value: 'rating', label: 'Rating', icon: Star },
    { value: 'duration', label: 'Duration', icon: Clock },
    { value: 'calories', label: 'Calories', icon: Flame },
  ];

  return (
    <main className="min-h-screen bg-[#15171d] px-5 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="mb-2 text-sm font-bold uppercase tracking-[3px] text-[#c2f800]">
            Your Fitness Journey
          </p>

          <h1 className="text-4xl font-black uppercase md:text-5xl">
            My <span className="text-[#c2f800]">Plan</span>
          </h1>

          <p className="mt-3 text-gray-400">
            Manage your workouts and track your daily progress.
          </p>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#23262e] bg-[#1c1f27] p-6">
            <Dumbbell className="mb-4 text-[#c2f800]" size={28} />
            <p className="text-sm text-gray-400">Total Workouts</p>
            <h2 className="mt-2 text-3xl font-bold">{currentPlan.length}</h2>
          </div>

          <div className="rounded-2xl border border-[#23262e] bg-[#1c1f27] p-6">
            <Clock className="mb-4 text-[#c2f800]" size={28} />
            <p className="text-sm text-gray-400">Total Duration</p>
            <h2 className="mt-2 text-3xl font-bold">
              {totalDuration} <span className="text-base">min</span>
            </h2>
          </div>

          <div className="rounded-2xl border border-[#23262e] bg-[#1c1f27] p-6">
            <Flame className="mb-4 text-[#c2f800]" size={28} />
            <p className="text-sm text-gray-400">Total Calories</p>
            <h2 className="mt-2 text-3xl font-bold">
              {totalCalories} <span className="text-base">kcal</span>
            </h2>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              className={`rounded-xl px-6 py-3 font-bold transition ${
                activeTab === 'today'
                  ? 'bg-[#c2f800] text-black'
                  : 'border border-[#353944] text-gray-400 hover:border-[#c2f800] hover:text-[#c2f800]'
              }`}
            >
              Today's Plan ({todayPlan.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`rounded-xl px-6 py-3 font-bold transition ${
                activeTab === 'saved'
                  ? 'bg-[#c2f800] text-black'
                  : 'border border-[#353944] text-gray-400 hover:border-[#c2f800] hover:text-[#c2f800]'
              }`}
            >
              Saved for Later ({savedPlan.length})
            </button>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-3 rounded-xl border border-[#353944] bg-[#1c1f27] px-4 py-3 text-sm font-semibold text-white transition hover:border-[#c2f800]"
            >
              <span className="text-gray-400">Sort By:</span>

              <span className="text-[#c2f800]">
                {sortOptions.find(option => option.value === sortBy)?.label}
              </span>

              <ChevronDown
                size={18}
                className={`transition-transform duration-200 ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-xl border border-[#353944] bg-[#1c1f27] shadow-xl">
                {sortOptions.map(option => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#292e38] ${
                        sortBy === option.value
                          ? 'font-bold text-[#c2f800]'
                          : 'text-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {option.label}

                      {sortBy === option.value && (
                        <span className="ml-auto text-[#c2f800]">✓</span>
                      )}
                    </button>
                  );
                })}

                <div className="border-t border-[#353944] p-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-xs text-gray-300 transition hover:bg-[#292e38]"
                  >
                    {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                    <ChevronDown
                      size={15}
                      className={`transition-transform ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {currentPlan.length === 0 ? (
          <div className="rounded-2xl border border-[#23262e] bg-[#1c1f27] px-5 py-16 text-center">
            <Dumbbell size={45} className="mx-auto mb-5 text-[#c2f800]" />

            <h2 className="text-2xl font-bold">
              {activeTab === 'today'
                ? 'Your plan is empty!'
                : 'No saved workouts yet!'}
            </h2>

            <p className="mt-3 text-gray-400">
              Add some workouts to get started.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-[#c2f800] px-6 py-3 font-bold text-black transition hover:bg-[#a9d900]"
            >
              Explore Workouts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {sortedPlan.map(workout => (
              <div
                key={workout.id}
                className="flex flex-col gap-5 rounded-2xl border border-[#23262e] bg-[#1c1f27] p-5 transition hover:-translate-y-1 sm:flex-row"
              >
                <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#252a32] sm:h-36 sm:w-36">
                  {workout.image ? (
                    <img
                      src={workout.image}
                      alt={workout.name || 'Workout'}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Dumbbell size={35} className="text-[#c2f800]" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{workout.name}</h3>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <Clock size={16} className="text-[#c2f800]" />
                        {workout.duration || 0} min
                      </span>

                      <span className="flex items-center gap-2">
                        <Flame size={16} className="text-[#c2f800]" />
                        {workout.calories || 0} kcal
                      </span>

                      <span className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="fill-[#c2f800] text-[#c2f800]"
                        />
                        {Number(workout.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/workouts/${workout.id}`}
                      className="text-sm font-bold text-[#c2f800] hover:underline"
                    >
                      View Details
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkAsDone(workout.id)}
                        disabled={workout.isDone}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition ${
                          workout.isDone
                            ? 'cursor-not-allowed border-[#c2f800]/30 bg-[#c2f800]/10 text-[#c2f800]'
                            : 'border-[#c2f800]/40 text-[#c2f800] hover:bg-[#c2f800] hover:text-black'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        {workout.isDone ? 'Completed' : 'Mark as Done'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(workout.id)}
                        className="rounded-lg border border-red-500/30 p-2 text-red-400 transition hover:bg-red-500/10"
                        aria-label="Remove workout"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default MyPlanPage;
