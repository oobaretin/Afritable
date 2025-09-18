import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import BackButton from '../components/ui/BackButton';

const Contact: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact Afritable - Get in Touch</title>
        <meta name="description" content="Contact Afritable for support, partnerships, or general inquiries. We're here to help you discover amazing African cuisine." />
        <meta name="keywords" content="contact afritable, support, partnerships, african restaurants, customer service" />
        <meta property="og:title" content="Contact Afritable - Get in Touch" />
        <meta property="og:description" content="Contact Afritable for support, partnerships, or general inquiries. We're here to help you discover amazing African cuisine." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Afritable - Get in Touch" />
        <meta name="twitter:description" content="Contact Afritable for support, partnerships, or general inquiries. We're here to help you discover amazing African cuisine." />
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
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Get in Touch
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Have questions about Afritable? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                  <p className="text-gray-600">hello@afritable.com</p>
                  <p className="text-gray-600">support@afritable.com</p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Mon-Fri 9AM-6PM EST</p>
                </div>

                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-600">123 Restaurant Row</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Send us a Message
                  </h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="restaurant">Restaurant Listing</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition duration-200 font-medium"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Find answers to common questions about Afritable
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How do I make a reservation?
                  </h3>
                  <p className="text-gray-600">
                    Simply search for a restaurant, select your preferred date and time, and complete the booking process. You'll receive a confirmation email with all the details.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Can I cancel or modify my reservation?
                  </h3>
                  <p className="text-gray-600">
                    Yes, you can cancel or modify your reservation up to 2 hours before your scheduled time. Use the link in your confirmation email or contact the restaurant directly.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    How do I list my restaurant on Afritable?
                  </h3>
                  <p className="text-gray-600">
                    We'd love to have your restaurant on our platform! Contact us at partnerships@afritable.com and we'll guide you through the onboarding process.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Is there a fee for using Afritable?
                  </h3>
                  <p className="text-gray-600">
                    Afritable is free for customers to use. We work with restaurants to provide this service, and they may have their own policies regarding reservations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Business Hours */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Business Hours
                </h2>
                <p className="text-lg text-gray-600">
                  Our customer support team is available to help you
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Monday - Friday</span>
                      <span className="text-gray-600">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">Saturday</span>
                      <span className="text-gray-600">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-900">Sunday</span>
                      <span className="text-gray-600">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> For urgent matters outside business hours, please email us at support@afritable.com and we'll respond as soon as possible.
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

export default Contact;
