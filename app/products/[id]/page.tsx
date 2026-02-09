'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/products/${params.id}`);
      setProduct(data);
    } catch (error) {
      toast.error('Product not found');
      router.push('/products');
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }
    try {
      await addToCart(product.id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    try {
      await api.post('/reviews', {
        product_id: product.id,
        rating: review.rating,
        comment: review.comment,
      });
      toast.success('Review submitted!');
      setReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-pink-50 flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <button
            onClick={() => router.back()}
            className="mb-4 text-pink-600 hover:underline"
          >
            ← Back to Products
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="bg-pink-50 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center">
                    <span className="text-pink-300 text-6xl">💄</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-pink-600 mb-4">{product.price} Br</p>
                <p className="text-gray-600 mb-6">{product.description}</p>

                <div className="mb-6">
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Category:</span> {product.category?.name}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Stock:</span>{' '}
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                      {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Supplier:</span> {product.supplier?.name}
                  </p>
                </div>

                {user?.role?.name === 'customer' && product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Quantity:</label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-20 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={handleAddToCart}
                        className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t p-8">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

              {/* Review Form */}
              {user?.role?.name === 'customer' && (
                <form onSubmit={handleSubmitReview} className="mb-8 bg-pink-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Rating:</label>
                    <select
                      value={review.rating}
                      onChange={(e) => setReview({ ...review, rating: parseInt(e.target.value) })}
                      className="px-4 py-2 border rounded-lg"
                    >
                      <option value="5">5 - Excellent</option>
                      <option value="4">4 - Good</option>
                      <option value="3">3 - Average</option>
                      <option value="2">2 - Poor</option>
                      <option value="1">1 - Terrible</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Comment:</label>
                    <textarea
                      value={review.comment}
                      onChange={(e) => setReview({ ...review, comment: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={4}
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev: any) => (
                    <div key={rev.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{rev.user?.name}</span>
                        <span className="text-yellow-500">{'⭐'.repeat(rev.rating)}</span>
                      </div>
                      <p className="text-gray-600">{rev.comment}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
