'use client';

import Navbar from '@/components/Navbar';

export default function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-pink-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-5xl font-bold text-pink-600 mb-8 text-center">Contact Us</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-8 text-center text-lg">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-pink-600 mb-4">📞 Phone</h3>
                <p className="text-gray-700 text-lg">0934634298</p>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-pink-600 mb-4">📧 Email</h3>
                <p className="text-gray-700 text-lg">alemiyealem346@gmail.com</p>
              </div>

              <div className="bg-pink-50 p-6 rounded-lg md:col-span-2">
                <h3 className="text-xl font-bold text-pink-600 mb-4">📍 Address</h3>
                <p className="text-gray-700 text-lg">BALE, ROBE</p>
              </div>
            </div>

            <div className="border-t pt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600"
                    rows={6}
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 text-lg font-semibold"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
