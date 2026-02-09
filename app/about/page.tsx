'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold text-pink-600 mb-8 text-center">About Alem Cosmetics</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
            <div className="text-center mb-8">
              <p className="text-2xl text-gray-700 font-semibold">
                Your trusted online cosmetics shop 
              </p>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Welcome to Alem Cosmetics!   
                Our shop offers a wide range of cosmetics including lipsticks, foundations, 
                mascaras, eyeshadows, skincare products, and perfumes.
              </p>

              <p>
                We believe that everyone deserves to look and feel beautiful. That's why we carefully 
                select our products to ensure they meet high quality standards 
                 for our customers.
              </p>

              <p>
                Located in BALE, ROBE, we serve customers across Ethiopia with reliable delivery and 
                excellent customer service. Whether you're looking for everyday makeup or special occasion 
                products, we have something for everyone.
              </p>

              <div className="text-center mt-8">
                <p className="text-xl text-gray-700 mb-6">
                  Ready to start shopping?
                </p>
                <Link
                  href="/products"
                  className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-pink-700 inline-block"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
