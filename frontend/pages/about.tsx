import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import BackButton from '../components/ui/BackButton';

const About: React.FC = () => {
  return (
    <>
      <Head>
        <title>About Afritable - Discover Amazing African Cuisine</title>
        <meta name="description" content="Learn about Afritable, the premier platform for discovering and booking reservations at the best African restaurants in your city." />
        <meta name="keywords" content="about afritable, african restaurants, restaurant reservations, african cuisine" />
        <meta property="og:title" content="About Afritable - Discover Amazing African Cuisine" />
        <meta property="og:description" content="Learn about Afritable, the premier platform for discovering and booking reservations at the best African restaurants in your city." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Afritable - Discover Amazing African Cuisine" />
        <meta name="twitter:description" content="Learn about Afritable, the premier platform for discovering and booking reservations at the best African restaurants in your city." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton href="/" className="mb-4">
              Back to Home
            </BackButton>
          </div>

          {/* Hero Section */}
          <section className="bg-gradient-to-br from-orange-500 to-orange-700 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                About Afritable
              </h1>
              <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
                Connecting food lovers with the rich, diverse flavors of African cuisine
              </p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                  At Afritable, we believe that African cuisine deserves a place at the center of the culinary world. 
                  Our mission is to make it easier than ever to discover, explore, and enjoy the incredible diversity 
                  of African restaurants in your city.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Diverse Cuisines</h3>
                  <p className="text-gray-600">
                    From Ethiopian injera to Nigerian jollof rice, Moroccan tagines to Somali sambusas, 
                    discover the full spectrum of African culinary traditions.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Easy Discovery</h3>
                  <p className="text-gray-600">
                    Our intelligent search and filtering system helps you find the perfect African restaurant 
                    based on cuisine type, location, price range, and more.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Booking</h3>
                  <p className="text-gray-600">
                    Book reservations instantly with our integrated booking system. 
                    No more waiting on hold or playing phone tag with restaurants.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Story Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Our Story
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    Afritable was born from a simple observation: while African cuisine is some of the most 
                    flavorful and diverse in the world, it was often overlooked in mainstream restaurant discovery platforms.
                  </p>
                  <p className="text-lg text-gray-600 mb-6">
                    We set out to change that by creating a platform specifically designed to celebrate and promote 
                    African restaurants. From family-owned establishments serving traditional recipes passed down 
                    through generations to modern fusion restaurants pushing culinary boundaries.
                  </p>
                  <p className="text-lg text-gray-600">
                    Today, Afritable connects thousands of food lovers with authentic African dining experiences 
                    across major metropolitan areas, helping to preserve and promote these incredible culinary traditions.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                  <p className="text-orange-100 mb-6">
                    Be part of a growing community of food enthusiasts who appreciate the rich flavors 
                    and cultural heritage of African cuisine.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🍽️</span>
                      <span>Discover new restaurants</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">⭐</span>
                      <span>Share your experiences</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🤝</span>
                      <span>Support local businesses</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Our Values
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything we do is guided by our core values of authenticity, community, and celebration of diversity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Authenticity</h3>
                  <p className="text-gray-600 text-sm">
                    We prioritize authentic African restaurants that stay true to traditional recipes and cooking methods.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🤝</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Community</h3>
                  <p className="text-gray-600 text-sm">
                    We foster a supportive community that celebrates African culture and cuisine together.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌟</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Excellence</h3>
                  <p className="text-gray-600 text-sm">
                    We maintain high standards for restaurant quality and user experience on our platform.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Growth</h3>
                  <p className="text-gray-600 text-sm">
                    We're committed to growing the visibility and success of African restaurants worldwide.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Explore African Cuisine?
              </h2>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Join thousands of food lovers who have discovered their new favorite restaurants through Afritable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/restaurants"
                  className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Browse Restaurants
                </a>
                <a
                  href="/"
                  className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors duration-200"
                >
                  Start Your Journey
                </a>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default About;
