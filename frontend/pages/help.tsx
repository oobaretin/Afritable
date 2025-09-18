import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Help: React.FC = () => {
  const faqs = [
    {
      question: "How do I make a reservation?",
      answer: "Making a reservation is easy! Simply search for a restaurant, select your preferred date and time, enter your party size, and complete the booking. You'll receive a confirmation email with all the details."
    },
    {
      question: "Can I cancel or modify my reservation?",
      answer: "Yes, you can cancel or modify your reservation up to 2 hours before your scheduled time. Use the link in your confirmation email or contact the restaurant directly. Some restaurants may have different cancellation policies."
    },
    {
      question: "How do I find African restaurants near me?",
      answer: "Use our search feature on the homepage or restaurants page. You can filter by cuisine type (Ethiopian, Nigerian, Moroccan, etc.), location, price range, and ratings to find the perfect restaurant for you."
    },
    {
      question: "Is there a fee for using Afritable?",
      answer: "Afritable is free for customers to use. We work with restaurants to provide this service, and they may have their own policies regarding reservations and any associated fees."
    },
    {
      question: "How do I list my restaurant on Afritable?",
      answer: "We'd love to have your restaurant on our platform! Contact us at partnerships@afritable.com and we'll guide you through the onboarding process. We're always looking for authentic African restaurants to feature."
    },
    {
      question: "What types of African cuisines are available?",
      answer: "We feature a wide variety of African cuisines including Ethiopian, Nigerian, Moroccan, West African, East African, Somali, Sudanese, and South African restaurants. Each offers authentic flavors and traditional dishes."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team by emailing support@afritable.com or calling +1 (555) 123-4567. We're available Monday-Friday 9AM-6PM EST and Saturday 10AM-4PM EST."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Currently, Afritable is available as a web application that works great on mobile devices. We're working on a dedicated mobile app that will be available soon. Stay tuned for updates!"
    },
    {
      question: "How do I redeem a gift card?",
      answer: "When making a reservation, you'll have the option to apply a gift card during the booking process. Simply enter your gift card code and the amount will be applied to your reservation."
    },
    {
      question: "What if I have dietary restrictions?",
      answer: "Many of our partner restaurants offer vegetarian, vegan, and gluten-free options. You can specify any dietary restrictions when making your reservation, and we'll notify the restaurant in advance."
    }
  ];

  return (
    <>
      <Head>
        <title>Help Center - Afritable</title>
        <meta name="description" content="Get help with Afritable. Find answers to common questions about reservations, restaurants, and using our platform to discover African cuisine." />
        <meta name="keywords" content="Afritable help, customer support, FAQ, restaurant reservations, African cuisine help" />
        <meta property="og:title" content="Help Center - Afritable" />
        <meta property="og:description" content="Get help with Afritable. Find answers to common questions about reservations, restaurants, and using our platform to discover African cuisine." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Help Center - Afritable" />
        <meta name="twitter:description" content="Get help with Afritable. Find answers to common questions about reservations, restaurants, and using our platform to discover African cuisine." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Help Center
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Find answers to your questions about Afritable. We're here to help you discover 
                and enjoy amazing African cuisine in your city.
              </p>
            </div>
          </section>

          {/* Search Help */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Search for Help
                </h2>
                <p className="text-lg text-gray-600">
                  Can't find what you're looking for? Search our help articles
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search help articles..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <svg className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Quick answers to common questions
                </p>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Still Need Help?
                </h2>
                <p className="text-lg text-gray-600">
                  Our support team is here to assist you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-4">
                    Send us an email and we'll get back to you within 24 hours
                  </p>
                  <a href="mailto:support@afritable.com" className="text-orange-600 hover:text-orange-700 font-medium">
                    support@afritable.com
                  </a>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-4">
                    Call us during business hours for immediate assistance
                  </p>
                  <a href="tel:+15551234567" className="text-orange-600 hover:text-orange-700 font-medium">
                    +1 (555) 123-4567
                  </a>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-4">
                    Chat with our support team in real-time
                  </p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Support Hours
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Support</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-medium">Closed</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Support</h3>
                    <p className="text-gray-600 mb-4">
                      For urgent matters outside business hours, please email us at 
                      <a href="mailto:emergency@afritable.com" className="text-orange-600 hover:text-orange-700 ml-1">
                        emergency@afritable.com
                      </a>
                    </p>
                    <p className="text-sm text-gray-500">
                      We'll respond to emergency emails within 2 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Help;
