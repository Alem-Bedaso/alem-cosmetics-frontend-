'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/skincare.jpg"
            alt="Alem Cosmetics"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 py-32 text-center min-h-screen flex flex-col justify-center">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Welcome to Alem Online Cosmetics Shop
          </h1>
          <p className="text-2xl text-white mb-10 drop-shadow-xl">
            Discover the best cosmetics for your beauty needs
          </p>
          <Link
            href="/products"
            className="bg-pink-600 text-white px-10 py-4 rounded-lg text-xl hover:bg-pink-700 inline-block shadow-2xl mx-auto"
          >
            Shop Now
          </Link>
        </div>
      </main>
    </>
  );
}
