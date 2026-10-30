import { Suspense } from 'react';
import { Inter, Hind_Siliguri } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const hind = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
});

export const metadata = {
  title: 'FitLog',
  description: 'Track your workouts and plans',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="bn"
      data-theme="dark"
      className={`dark ${inter.variable} ${hind.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-gray-950 text-gray-100">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <main className="flex-1">{children}</main>

        <ToastContainer />

        <Footer />
      </body>
    </html>
  );
}
