import { Suspense } from 'react';
import WorkoutActions from '../../Components/WorkoutActions';

const WorkoutDetails = async ({ params }) => {
  const { id } = await params;

  const res = await fetch('https://api.abcz.workers.dev/api/fitlog', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch workouts');
  }

  const workouts = await res.json();

  const workout = workouts.find(item => String(item.id) === String(id));

  if (!workout) {
    return (
      <main className="min-h-screen bg-[#0b0c10] p-10 text-white">
        <h1 className="text-2xl font-bold">Workout not found!</h1>
      </main>
    );
  }

  const details = [
    { label: 'EQUIPMENT', value: workout.equipment },
    { label: 'DIFFICULTY', value: workout.difficulty || 'Intermediate' },
    { label: 'SETS', value: workout.sets || 4 },
    { label: 'REPS', value: workout.reps || '6-8' },
    { label: 'DURATION', value: `${workout.duration} min` },
    { label: 'CALORIES', value: `${workout.caloriesBurned} kcal` },
    { label: 'RATING', value: workout.rating },
  ];

  const instructions = workout.instructions || [];

  return (
    <main className="min-h-screen bg-[#0b0c10] px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2">
          <div className="h-[350px] overflow-hidden rounded-2xl border border-[#23262e] bg-[#151820] md:h-[520px]">
            <img
              src={workout.image}
              alt={workout.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="mb-4 font-['Oswald'] text-3xl font-bold uppercase tracking-wide md:text-4xl">
              {workout.name}
            </h1>

            <p className="mb-6 text-sm leading-7 text-gray-400">
              {workout.description}
            </p>

            <div className="mb-7 flex flex-wrap gap-2">
              {workout.muscleGroups?.map(group => (
                <span
                  key={group}
                  className="rounded-full bg-[#c2f800]/10 px-4 py-2 text-xs font-semibold text-[#c2f800]"
                >
                  {group}
                </span>
              ))}
            </div>

            <div className="mb-8 overflow-hidden rounded-xl border border-[#23262e] bg-[#151820]">
              {details.map(detail => (
                <div
                  key={detail.label}
                  className="flex items-center justify-between border-b border-[#23262e] px-5 py-4 last:border-0"
                >
                  <span className="text-xs font-bold tracking-wider text-gray-500">
                    {detail.label}
                  </span>

                  <span className="text-sm font-semibold text-gray-200">
                    {detail.value ?? 'N/A'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="mb-5 font-['Oswald'] text-xl font-bold tracking-wide">
                INSTRUCTIONS
              </h2>

              <ol className="space-y-4">
                {instructions.map((instruction, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm leading-6 text-gray-400"
                  >
                    <span className="font-bold text-[#c2f800]">
                      {index + 1}.
                    </span>

                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            <WorkoutActions workout={workout} />
          </div>
        </div>
      </div>
    </main>
  );
};

const DetailPage = ({ params }) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b0c10] text-[#c2f800]">
          Loading Workout Details...
        </div>
      }
    >
      <WorkoutDetails params={params} />
    </Suspense>
  );
};

export default DetailPage;
