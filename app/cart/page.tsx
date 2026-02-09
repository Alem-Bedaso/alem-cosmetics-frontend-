'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function Cart() {
  const { cart, fetchCart, removeFromCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCart();
  }, [user]);

  const total = cart.reduce((sum: number, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const address = prompt('Enter shipping address:');
      const phone = prompt('Enter phone number:');
      if (!address || !phone) return;

      await api.post('/orders', { shipping_address: address, phone });
      toast.success('Order placed successfully!');
      router.push('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold text-pink-600 mb-8">Shopping Cart</h1>
          {cart.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty</p>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b py-4">
                    <div>
                      <h3 className="font-bold">{item.product.name}</h3>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">{item.product.price * item.quantity} Br</p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-2xl font-bold text-pink-600">{total.toFixed(2)} Br</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
