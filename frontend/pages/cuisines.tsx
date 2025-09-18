import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Cuisines: React.FC = () => {
  const cuisines = [
    {
      name: 'Ethiopian',
      description: 'Rich flavors with injera bread, berbere spices, and traditional stews',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
      restaurants: 12
    },
    {
      name: 'Nigerian',
      description: 'Authentic jollof rice, suya, and traditional West African dishes',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      restaurants: 8
    },
    {
      name: 'Moroccan',
      description: 'Aromatic tagines, couscous, and North African specialties',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      restaurants: 6
    },
    {
      name: 'West African',
      description: 'Diverse flavors from Ghana, Senegal, and Ivory Coast',
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      restaurants: 10
    },
    {
      name: 'East African',
      description: 'Kenyan, Tanzanian, and Ugandan culinary traditions',
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
      restaurants: 7
    },
    {
      name: 'Somali',
      description: 'Traditional Somali cuisine with aromatic spices and rice dishes',
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop',
      restaurants: 4
    },
    {
      name: 'Sudanese',
      description: 'Authentic Sudanese flavors with traditional breads and stews',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop',
      restaurants: 3
    },
    {
      name: 'South African',
      description: 'Braai, bobotie, and Cape Malay influenced dishes',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
      restaurants: 5
    }
  ];

  return (
    <>
      <Head>
        <title>Browse African Cuisines - Afritable</title>
        <meta name="description" content="Explore the diverse world of African cuisines. From Ethiopian injera to Nigerian jollof rice, discover authentic African restaurants in your city." />
        <meta name="keywords" content="African cuisines, Ethiopian food, Nigerian cuisine, Moroccan food, West African, East African, Somali food, Sudanese cuisine" />
        <meta property="og:title" content="Browse African Cuisines - Afritable" />
        <meta property="og:description" content="Explore the diverse world of African cuisines. From Ethiopian injera to Nigerian jollof rice, discover authentic African restaurants in your city." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Browse African Cuisines - Afritable" />
        <meta name="twitter:description" content="Explore the diverse world of African cuisines. From Ethiopian injera to Nigerian jollof rice, discover authentic African restaurants in your city." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Explore African Cuisines
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Discover the rich diversity of African culinary traditions. From the aromatic spices of North Africa to the bold flavors of West Africa, find your next favorite cuisine.
              </p>
            </div>
          </section>

          {/* Cuisines Grid */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Popular African Cuisines
                </h2>
                <p className="text-lg text-gray-600">
                  Each cuisine tells a story of culture, tradition, and flavor
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {cuisines.map((cuisine, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative h-48">
                      <img
                        src={cuisine.image}
                        alt={cuisine.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold mb-1">
                          {cuisine.name}
                        </h3>
                        <p className="text-orange-200 text-sm">
                          {cuisine.restaurants} restaurants
                        </p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {cuisine.description}
                      </p>
                      <button className="mt-4 w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors duration-200 font-medium">
                        Find Restaurants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Restaurants */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Featured Restaurants
                </h2>
                <p className="text-lg text-gray-600">
                  Discover top-rated African restaurants in your area
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Addis Ababa</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Addis Ababa Restaurant</h3>
                    <p className="text-gray-600 mb-4">Authentic Ethiopian cuisine with traditional injera and flavorful stews.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium">Ethiopian</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-600 ml-2">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Nigerian Kitchen</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nigerian Kitchen</h3>
                    <p className="text-gray-600 mb-4">Traditional Nigerian dishes including jollof rice and suya.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium">Nigerian</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★★★★☆</span>
                        <span className="text-gray-600 ml-2">4.6</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Marrakech</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Marrakech Moroccan Restaurant</h3>
                    <p className="text-gray-600 mb-4">Aromatic tagines and couscous with authentic Moroccan flavors.</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-600 font-medium">Moroccan</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-gray-600 ml-2">4.9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-16 bg-orange-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Explore?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Find and book reservations at the best African restaurants in your city. 
                Your next culinary adventure awaits!
              </p>
              <button className="bg-white text-orange-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200">
                Find Restaurants Near You
              </button>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Cuisines;
