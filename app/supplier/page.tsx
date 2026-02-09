'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Supplier() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  });
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role?.name !== 'supplier') {
      router.push('/');
      return;
    }
    fetchProducts();
    fetchCategories();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        images: formData.image_url ? [formData.image_url] : []
      };
      await api.post('/products', productData);
      toast.success('Product added successfully!');
      setShowForm(false);
      fetchProducts();
      setFormData({ name: '', category_id: '', description: '', price: '', stock: '', image_url: '' });
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateStock = async (id: number) => {
    const stock = prompt('Enter new stock quantity:');
    if (!stock) return;
    try {
      await api.put(`/products/${id}`, { stock: parseInt(stock) });
      toast.success('Stock updated!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-pink-600">Supplier Dashboard</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              {showForm ? 'Cancel' : 'Add Product'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="px-4 py-2 border rounded-lg md:col-span-2"
                  rows={3}
                  required
                />
                <input
                  type="url"
                  placeholder="Image URL (e.g., https://example.com/image.jpg)"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="px-4 py-2 border rounded-lg md:col-span-2"
                />
                <button
                  type="submit"
                  className="bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 md:col-span-2"
                >
                  Add Product
                </button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pink-100">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.price} Br</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUpdateStock(product.id)}
                        className="text-pink-600 hover:underline"
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
