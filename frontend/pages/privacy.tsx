import React from 'react';
import Head from 'next/head';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

const Privacy: React.FC = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Afritable</title>
        <meta name="description" content="Learn how Afritable protects your privacy and handles your personal information when you use our restaurant reservation platform." />
        <meta name="keywords" content="privacy policy, data protection, personal information, Afritable privacy" />
        <meta property="og:title" content="Privacy Policy - Afritable" />
        <meta property="og:description" content="Learn how Afritable protects your privacy and handles your personal information when you use our restaurant reservation platform." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - Afritable" />
        <meta name="twitter:description" content="Learn how Afritable protects your privacy and handles your personal information when you use our restaurant reservation platform." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, 
                use, and protect your personal information.
              </p>
            </div>
          </section>

          {/* Privacy Policy Content */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <div className="mb-8">
                  <p className="text-gray-600">
                    <strong>Last updated:</strong> December 18, 2024
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We collect information you provide directly to us, such as when you create an account, 
                      make a reservation, or contact us for support.
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Name, email address, and phone number</li>
                      <li>Reservation details and preferences</li>
                      <li>Payment information (processed securely by third-party providers)</li>
                      <li>Communications with our support team</li>
                      <li>Reviews and ratings you submit</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Process and manage your restaurant reservations</li>
                      <li>Send you reservation confirmations and updates</li>
                      <li>Provide customer support and respond to your inquiries</li>
                      <li>Improve our services and develop new features</li>
                      <li>Send you promotional offers and updates (with your consent)</li>
                      <li>Comply with legal obligations and protect our rights</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>We may share your information in the following circumstances:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>With restaurants:</strong> We share your reservation details with the restaurants you book</li>
                      <li><strong>Service providers:</strong> We work with trusted third parties to process payments and provide services</li>
                      <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety</li>
                      <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                      <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We implement appropriate technical and organizational measures to protect your personal 
                      information against unauthorized access, alteration, disclosure, or destruction. This includes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Encryption of sensitive data in transit and at rest</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication measures</li>
                      <li>Employee training on data protection practices</li>
                    </ul>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights and Choices</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>You have the right to:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Access and update your personal information</li>
                      <li>Delete your account and associated data</li>
                      <li>Opt out of marketing communications</li>
                      <li>Request a copy of your data</li>
                      <li>Object to certain processing of your information</li>
                    </ul>
                    <p>
                      To exercise these rights, please contact us at{' '}
                      <a href="mailto:privacy@afritable.com" className="text-orange-600 hover:text-orange-700">
                        privacy@afritable.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                      and provide personalized content. You can control cookie settings through your browser preferences.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Our platform may contain links to third-party websites or services. We are not responsible 
                      for the privacy practices of these third parties. We encourage you to review their privacy policies.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Our services are not intended for children under 13 years of age. We do not knowingly collect 
                      personal information from children under 13. If we become aware of such collection, we will 
                      take steps to delete the information.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We may update this privacy policy from time to time. We will notify you of any material 
                      changes by posting the new policy on this page and updating the "Last updated" date.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      If you have any questions about this privacy policy or our data practices, please contact us:
                    </p>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p><strong>Email:</strong> <a href="mailto:privacy@afritable.com" className="text-orange-600 hover:text-orange-700">privacy@afritable.com</a></p>
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

export default Privacy;
