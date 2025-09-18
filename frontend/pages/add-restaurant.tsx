import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import BackButton from '../components/ui/BackButton';

interface RestaurantFormData {
  name: string;
  description: string;
  cuisine: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  website: string;
  email: string;
  priceRange: string;
  acceptsReservations: boolean;
  hasDelivery: boolean;
  hasTakeout: boolean;
  hasOutdoorSeating: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  isWheelchairAccessible: boolean;
}

const AddRestaurant: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    cuisine: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    email: '',
    priceRange: 'MODERATE',
    acceptsReservations: true,
    hasDelivery: false,
    hasTakeout: true,
    hasOutdoorSeating: false,
    hasWifi: false,
    hasParking: false,
    isWheelchairAccessible: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/restaurants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/restaurants');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add restaurant');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cuisines = [
    'Ethiopian', 'Nigerian', 'Moroccan', 'West African', 'East African', 
    'Somali', 'Sudanese', 'Ghanaian', 'Senegalese', 'Kenyan', 'Tanzanian',
    'South African', 'African', 'African Fusion'
  ];

  return (
    <>
      <Head>
        <title>Add Restaurant - Afritable</title>
        <meta name="description" content="Add a new African restaurant to Afritable" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton href="/restaurants" className="mb-4">
              Back to Restaurants
            </BackButton>
          </div>

          {/* Form Section */}
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Add a New Restaurant
                  </h1>
                  <p className="text-gray-600">
                    Help us grow our platform by adding African restaurants in your area
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Restaurant Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter restaurant name"
                      />
                    </div>

                    <div>
                      <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Type *
                      </label>
                      <select
                        id="cuisine"
                        name="cuisine"
                        required
                        value={formData.cuisine}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select cuisine type</option>
                        {cuisines.map((cuisine) => (
                          <option key={cuisine} value={cuisine}>{cuisine}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Describe the restaurant, specialties, atmosphere..."
                    />
                  </div>

                  {/* Location Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                          Address *
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="Street address"
                        />
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          required
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="ZIP code"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          placeholder="contact@restaurant.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </label>
                        <select
                          id="priceRange"
                          name="priceRange"
                          value={formData.priceRange}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="BUDGET">$ - Budget</option>
                          <option value="MODERATE">$$ - Moderate</option>
                          <option value="EXPENSIVE">$$$ - Expensive</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant Features</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'acceptsReservations', label: 'Accepts Reservations' },
                        { name: 'hasDelivery', label: 'Delivery Available' },
                        { name: 'hasTakeout', label: 'Takeout Available' },
                        { name: 'hasOutdoorSeating', label: 'Outdoor Seating' },
                        { name: 'hasWifi', label: 'Free WiFi' },
                        { name: 'hasParking', label: 'Parking Available' },
                        { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible' },
                      ].map((feature) => (
                        <label key={feature.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name={feature.name}
                            checked={formData[feature.name as keyof RestaurantFormData] as boolean}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700">{feature.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200"
                    >
                      {loading ? 'Adding Restaurant...' : 'Add Restaurant'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AddRestaurant;
