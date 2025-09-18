import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Terms: React.FC = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - Afritable</title>
        <meta name="description" content="Read Afritable's terms of service to understand your rights and responsibilities when using our restaurant reservation platform." />
        <meta name="keywords" content="terms of service, user agreement, Afritable terms, restaurant reservations terms" />
        <meta property="og:title" content="Terms of Service - Afritable" />
        <meta property="og:description" content="Read Afritable's terms of service to understand your rights and responsibilities when using our restaurant reservation platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service - Afritable" />
        <meta name="twitter:description" content="Read Afritable's terms of service to understand your rights and responsibilities when using our restaurant reservation platform." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Terms of Service
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Please read these terms carefully before using Afritable. 
                By using our service, you agree to be bound by these terms.
              </p>
            </div>
          </section>

          {/* Terms Content */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <div className="mb-8">
                  <p className="text-gray-600">
                    <strong>Last updated:</strong> December 18, 2024
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      By accessing and using Afritable ("the Service"), you accept and agree to be bound by the 
                      terms and provision of this agreement. If you do not agree to abide by the above, please 
                      do not use this service.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Afritable is a restaurant reservation platform that connects users with African restaurants. 
                      We provide the following services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Restaurant search and discovery</li>
                      <li>Online reservation booking</li>
                      <li>Restaurant reviews and ratings</li>
                      <li>Customer support</li>
                      <li>Promotional offers and deals</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>To use certain features of our service, you must create an account. You agree to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Provide accurate and complete information</li>
                      <li>Keep your account information up to date</li>
                      <li>Maintain the security of your password</li>
                      <li>Accept responsibility for all activities under your account</li>
                      <li>Notify us immediately of any unauthorized use</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Reservations and Bookings</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>When making reservations through our platform:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Reservations are subject to restaurant availability and policies</li>
                      <li>You are responsible for honoring your reservation commitments</li>
                      <li>Cancellation policies vary by restaurant</li>
                      <li>We are not responsible for restaurant service quality or food safety</li>
                      <li>Restaurants may have their own terms and conditions</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. User Conduct</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>You agree not to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Use the service for any unlawful purpose</li>
                      <li>Submit false or misleading information</li>
                      <li>Interfere with the proper functioning of the service</li>
                      <li>Attempt to gain unauthorized access to our systems</li>
                      <li>Post inappropriate, offensive, or harmful content</li>
                      <li>Violate any applicable laws or regulations</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Reviews and Content</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      You may submit reviews, ratings, and other content. By submitting content, you grant us 
                      a non-exclusive, royalty-free license to use, modify, and display your content in connection 
                      with our service.
                    </p>
                    <p>You are responsible for ensuring your content is:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Accurate and truthful</li>
                      <li>Not defamatory or offensive</li>
                      <li>Not infringing on third-party rights</li>
                      <li>Compliant with applicable laws</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Payment and Fees</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Our reservation service is free to users. However:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Restaurants may charge for meals and services</li>
                      <li>Some restaurants may have cancellation fees</li>
                      <li>We may introduce premium features in the future</li>
                      <li>Payment processing is handled by third-party providers</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      The Afritable service, including its design, functionality, and content, is protected by 
                      intellectual property laws. You may not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Copy, modify, or distribute our content without permission</li>
                      <li>Use our trademarks or logos without authorization</li>
                      <li>Reverse engineer or attempt to extract source code</li>
                      <li>Create derivative works based on our service</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Our service is provided "as is" without warranties of any kind. We disclaim all warranties, 
                      express or implied, including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Merchantability and fitness for a particular purpose</li>
                      <li>Accuracy, reliability, or completeness of information</li>
                      <li>Uninterrupted or error-free operation</li>
                      <li>Security of data transmission</li>
                    </ul>
                    <p>
                      In no event shall Afritable be liable for any indirect, incidental, special, or consequential 
                      damages arising from your use of the service.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We may terminate or suspend your account at any time for violation of these terms or for 
                      any other reason at our discretion. You may also terminate your account at any time by 
                      contacting us.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We reserve the right to modify these terms at any time. We will notify users of material 
                      changes by posting the updated terms on our website. Your continued use of the service 
                      after changes constitutes acceptance of the new terms.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      These terms shall be governed by and construed in accordance with the laws of the State of 
                      New York, without regard to conflict of law principles. Any disputes arising from these 
                      terms shall be resolved in the courts of New York.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      If you have any questions about these terms, please contact us:
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p><strong>Email:</strong> <a href="mailto:legal@afritable.com" className="text-orange-600 hover:text-orange-700">legal@afritable.com</a></p>
                      <p><strong>Phone:</strong> <a href="tel:+15551234567" className="text-orange-600 hover:text-orange-700">+1 (555) 123-4567</a></p>
                      <p><strong>Address:</strong> 123 Restaurant Row, New York, NY 10001</p>
                    </div>
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

export default Terms;
