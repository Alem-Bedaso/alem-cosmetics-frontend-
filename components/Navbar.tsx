'use client';
import Link from 'next/link';

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  return (
    <nav className="bg-pink-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
           Alem Cosmetics
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/products" className="hover:text-pink-200">
           Products
            </Link>
            <Link href="/about" className="hover:text-pink-200">
             About Us
            </Link>
            <Link href="/contact" className="hover:text-pink-200">
             Contact
            </Link>

            {user ? (
              <>
                {user.role?.name === 'customer' && (
                  <>
                    <Link href="/cart" className="hover:text-pink-200">
                     Cart ({cart.length})
                    </Link>
                    <Link href="/orders" className="hover:text-pink-200">
                     Orders
                    </Link>
                  </>
                )}
                {user.role?.name === 'admin' && (
                  <Link href="/admin" className="hover:text-pink-200">
                    Admin
                  </Link>
                )}
                {user.role?.name === 'supplier' && (
                  <Link href="/supplier" className="hover:text-pink-200">
                   Supplier
                  </Link>
                )}
                <button onClick={logout} className="hover:text-pink-200">
                Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-pink-200">
                 Login
                </Link>
                <Link href="/register" className="hover:text-pink-200">
                 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
