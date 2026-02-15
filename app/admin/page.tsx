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
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
      if (activeTab === 'dashboard' || activeTab === 'orders') {
        const { data } = await api.get('/orders');
        setOrders(data);
        
        // Calculate stats
        const totalRevenue = data.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
        setStats(prev => ({ ...prev, totalOrders: data.length, totalRevenue }));
      }
      
      if (activeTab === 'dashboard' || activeTab === 'products') {
        const { data } = await api.get('/products');
        setProducts(data.data || []);
        setStats(prev => ({ ...prev, totalProducts: data.data?.length || 0 }));
      }
      
      if (activeTab === 'users') {
        // Fetch users - you'll need to create this endpoint
        try {
          const { data } = await api.get('/admin/users');
          setUsers(data);
          setStats(prev => ({ ...prev, totalUsers: data.length }));
        } catch (error) {
          console.log('Users endpoint not available yet');
        }
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
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted!');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleChangeUserRole = async (userId: number, roleId: number) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role_id: roleId });
      toast.success('User role updated!');
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-pink-600 mb-8">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg ${
                activeTab === 'dashboard' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Dashboard
            </button>
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
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-lg ${
                activeTab === 'users' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Users
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-600 text-sm mb-2">Total Orders</h3>
                  <p className="text-3xl font-bold text-pink-600">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} Br</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-600 text-sm mb-2">Total Products</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalProducts}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-600 text-sm mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-pink-100">
                      <tr>
                        <th className="px-4 py-3 text-left">Order #</th>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-3">{order.order_number}</td>
                          <td className="px-4 py-3">{order.user?.name}</td>
                          <td className="px-4 py-3">{order.total} Br</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <div className="p-4 bg-pink-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">All Orders</h2>
                <span className="text-gray-600">Total: {orders.length}</span>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Order #</th>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{order.order_number}</td>
                      <td className="px-4 py-3">{order.user?.name}</td>
                      <td className="px-4 py-3">{order.user?.email}</td>
                      <td className="px-4 py-3 font-semibold">{order.total} Br</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <div className="p-4 bg-pink-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">All Products</h2>
                <span className="text-gray-600">Total: {products.length}</span>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Product</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Supplier</th>
                    <th className="px-4 py-3 text-left">Price</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{product.id}</td>
                      <td className="px-4 py-3 font-semibold">{product.name}</td>
                      <td className="px-4 py-3">{product.category?.name}</td>
                      <td className="px-4 py-3">{product.supplier?.name || 'N/A'}</td>
                      <td className="px-4 py-3">{product.price} Br</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-sm ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:underline text-sm"
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

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
              <div className="p-4 bg-pink-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">All Users</h2>
                <span className="text-gray-600">Total: {users.length}</span>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">ID</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3 font-semibold">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role_id}
                          onChange={(e) => handleChangeUserRole(u.id, parseInt(e.target.value))}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          <option value="1">Customer</option>
                          <option value="2">Admin</option>
                          <option value="3">Supplier</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">{u.phone || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Order Details Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-6">
                  <p><strong>Order Number:</strong> {selectedOrder.order_number}</p>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Total:</strong> {selectedOrder.total} Br</p>
                  <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                </div>

                <h3 className="text-xl font-bold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between border-b pb-2">
                      <div>
                        <p className="font-semibold">{item.product?.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{item.price} Br</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="mt-6 w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
