'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role?.name !== 'admin') {
      router.push('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'orders') {
        const { data } = await api.get('/orders');
        setOrders(data);
      } else if (activeTab === 'products') {
        const { data } = await api.get('/products');
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Order status updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-pink-600 mb-8">Admin Dashboard</h1>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-2 rounded-lg ${
                activeTab === 'orders' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg ${
                activeTab === 'products' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Products
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Order #</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b">
                      <td className="px-4 py-3">{order.order_number}</td>
                      <td className="px-4 py-3">{order.user?.name}</td>
                      <td className="px-4 py-3">{order.total} Br</td>
                      <td className="px-4 py-3">{order.status}</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.supplier?.name}</td>
                      <td className="px-4 py-3">{product.price} Br</td>
                      <td className="px-4 py-3">{product.stock}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
