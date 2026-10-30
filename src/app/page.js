import { Suspense } from 'react';

import MainBar from './Components/Main';

import Card from './Lib/Card.jsx';

import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <MainBar />
      <Suspense
        fallback={<p className="py-10 text-center">Loading cards...</p>}
      >
        <Card />
      </Suspense>
    </div>
  );
}
