'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';

const WorkoutActions = ({ workout }) => {
  const [isPlanned, setIsPlanned] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const plan = JSON.parse(localStorage.getItem('fitlog-plan') || '[]');
        const saved = JSON.parse(localStorage.getItem('fitlog-saved') || '[]');

        setIsPlanned(plan.some(item => String(item.id) === String(workout.id)));

        setIsSaved(saved.some(item => String(item.id) === String(workout.id)));
      } catch (error) {
        console.error('Failed to load workout status:', error);
      }
    };

    checkStatus();

    window.addEventListener('fitlog-update', checkStatus);

    return () => {
      window.removeEventListener('fitlog-update', checkStatus);
    };
  }, [workout.id]);

  const toggleWorkout = (key, setStatus) => {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');

      const alreadyExists = existing.some(
        item => String(item.id) === String(workout.id),
      );

      if (alreadyExists) {
        if (key === 'fitlog-plan') {
          toast.warning("Already added to Today's Plan!");
        } else {
          toast.warning('Already saved!');
        }

        return;
      }

      const updated = [
        ...existing,
        {
          id: workout.id,
          name: workout.name,
          image: workout.image,
          duration: Number(workout.duration) || 0,
          calories: Number(workout.caloriesBurned) || 0,
        },
      ];

      localStorage.setItem(key, JSON.stringify(updated));

      setStatus(true);

      if (key === 'fitlog-plan') {
        toast.success("Added to Today's Plan!");
      } else {
        toast.success('Saved successfully!');
      }

      window.dispatchEvent(new Event('fitlog-update'));
    } catch (error) {
      console.error('Failed to update workout:', error);
      toast.error('Something went wrong!');
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => toggleWorkout('fitlog-plan', setIsPlanned)}
        className="flex items-center gap-2 rounded-lg bg-[#c2f800] px-5 py-3 font-bold text-black transition hover:bg-[#a9d900]"
      >
        <CalendarDays size={18} />

        {isPlanned ? "Added to Today's Plan" : "Add to Today's Plan"}
      </button>

      <button
        type="button"
        onClick={() => toggleWorkout('fitlog-saved', setIsSaved)}
        className="flex items-center gap-2 rounded-lg border border-[#c2f800] px-5 py-3 font-bold text-[#c2f800] transition hover:bg-[#c2f800] hover:text-black"
      >
        <Bookmark size={18} />

        {isSaved ? 'Saved' : 'Save for later'}
      </button>
    </div>
  );
};

export default WorkoutActions;
