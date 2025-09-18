import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const GiftCards: React.FC = () => {
  const giftCardAmounts = [25, 50, 100, 150, 200, 250];

  return (
    <>
      <Head>
        <title>Gift Cards - Afritable</title>
        <meta name="description" content="Give the gift of amazing African cuisine with Afritable gift cards. Perfect for food lovers and special occasions." />
        <meta name="keywords" content="African restaurant gift cards, food gift cards, restaurant vouchers, dining gift certificates" />
        <meta property="og:title" content="Gift Cards - Afritable" />
        <meta property="og:description" content="Give the gift of amazing African cuisine with Afritable gift cards. Perfect for food lovers and special occasions." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gift Cards - Afritable" />
        <meta name="twitter:description" content="Give the gift of amazing African cuisine with Afritable gift cards. Perfect for food lovers and special occasions." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Gift Cards
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Give the gift of amazing African cuisine. Perfect for birthdays, holidays, 
                or any special occasion. Let your loved ones discover the flavors of Africa.
              </p>
            </div>
          </section>

          {/* Gift Card Options */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Choose Your Gift Card Amount
                </h2>
                <p className="text-lg text-gray-600">
                  Select the perfect amount for your gift
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                {giftCardAmounts.map((amount) => (
                  <div key={amount} className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center hover:border-orange-500 hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      ${amount}
                    </div>
                    <div className="text-sm text-gray-600">
                      Gift Card
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Amount */}
              <div className="max-w-md mx-auto mb-12">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Custom Amount
                  </h3>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Enter amount"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors duration-200">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gift Card Preview */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Gift Card Preview
                </h2>
                <p className="text-lg text-gray-600">
                  See how your gift card will look
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-8 text-white shadow-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">A</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Afritable</h3>
                    <p className="text-orange-100 mb-6">Gift Card</p>
                    <div className="text-4xl font-bold mb-4">$100.00</div>
                    <div className="text-sm text-orange-100 mb-4">
                      Valid at all participating African restaurants
                    </div>
                    <div className="text-xs text-orange-200">
                      Card Number: **** **** **** 1234
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Afritable Gift Cards?
                </h2>
                <p className="text-lg text-gray-600">
                  The perfect gift for food lovers
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Never Expires
                  </h3>
                  <p className="text-gray-600">
                    Your gift card never expires, so recipients can use it whenever they're ready to explore African cuisine.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Use Anywhere
                  </h3>
                  <p className="text-gray-600">
                    Valid at all participating African restaurants in your city. From Ethiopian to Nigerian, Moroccan to Somali.
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Digital Delivery
                  </h3>
                  <p className="text-gray-600">
                    Gift cards are delivered instantly via email. Perfect for last-minute gifts or long-distance celebrations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Purchase Form */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Purchase Gift Card
                </h2>
                
                <form className="space-y-6">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Gift Card Amount
                    </label>
                    <select
                      id="amount"
                      name="amount"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select amount</option>
                      {giftCardAmounts.map((amount) => (
                        <option key={amount} value={amount}>${amount}</option>
                      ))}
                      <option value="custom">Custom Amount</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter recipient's name"
                    />
                  </div>

                  <div>
                    <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      id="recipientEmail"
                      name="recipientEmail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter recipient's email"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Personal Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Add a personal message to your gift card"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 font-medium"
                  >
                    Purchase Gift Card
                  </button>
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

export default GiftCards;
