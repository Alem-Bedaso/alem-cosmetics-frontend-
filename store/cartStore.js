import { create } from 'zustand';
import api from '@/lib/api';

export const useCartStore = create((set) => ({
  cart: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cart: data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    try {
      await api.post('/cart', { product_id: productId, quantity });
      const { data } = await api.get('/cart');
      set({ cart: data });
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }));
    } catch (error) {
      throw error;
    }
  },

  clearCart: () => set({ cart: [] }),
}));
