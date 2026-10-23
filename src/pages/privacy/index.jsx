import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back to Home */}
          <Link
            to="/game-home-dashboard"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200 mb-6 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield size={22} className="text-purple-900" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-purple-300 text-sm mt-2 ml-13">Last Updated: April 15, 2026</p>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* Introduction */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Chase Street Press ("we," "our," or "us") operates MicrobeQuest at{' '}
            <span className="text-purple-700 font-medium">play.chasestreetpress.co</span>. This Privacy Policy explains how we collect, use, and protect your information when you use our service.
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">1. Information We Collect</h2>
          <p className="text-gray-700 mb-3">We collect:</p>
          <ul className="space-y-2">
            {[
              'Email address when you join our waitlist',
              'Game progress data stored locally on your device',
              'Device-local daily and session play-time totals used for parent restrictions, kept separately for guests and each account. These totals are not analytics and are not sent to a server. Old totals reset when play-time settings are next checked; export or delete them through Parent Controls.',
              'Anonymous usage data through Google Analytics including pages visited, time spent, and game activities completed',
              'Payment information processed securely through Stripe — we never store your card details',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 2 - COPPA */}
        <section className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">2. Children's Privacy (COPPA)</h2>
          <p className="text-gray-700 mb-3">
            MicrobeQuest is designed for children ages 7–13. We are committed to protecting children's privacy:
          </p>
          <ul className="space-y-2">
            {[
              'We do not knowingly collect personal information from children under 13 without parental consent',
              'Game progress is saved locally on your device and is not transmitted to our servers',
              'Parents may contact us at support@chasestreetpress.co to request deletion of any data related to their child',
              'We do not serve advertisements to children',
              'We do not sell children\'s data to third parties',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-3">We use your information to:</p>
          <ul className="space-y-2">
            {[
              'Provide and improve MicrobeQuest',
              'Send you updates about new content and features',
              'Process subscription payments',
              'Respond to your questions and support requests',
              'Analyze how the game is used to improve learning',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">4. Data Sharing</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We share data only with:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'Google Analytics', desc: 'Anonymous usage tracking' },
              { name: 'Stripe', desc: 'Payment processing' },
              { name: 'Resend', desc: 'Transactional email delivery' },
              { name: 'Klaviyo', desc: 'Marketing email delivery' },
            ]?.map((partner, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                <span className="mt-1 w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-purple-800">{partner?.name}</span>
                  <span className="text-gray-600"> — {partner?.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm mt-3 italic">All partners are required to protect your data.</p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">5. Data Retention</h2>
          <p className="text-gray-700 leading-relaxed">
            We retain your data for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting{' '}
            <a href="mailto:support@chasestreetpress.co" className="text-purple-700 underline hover:text-purple-900">
              support@chasestreetpress.co
            </a>.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">6. Your Rights</h2>
          <p className="text-gray-700 mb-3">You have the right to:</p>
          <ul className="space-y-2">
            {[
              'Access your personal data',
              'Correct inaccurate data',
              'Request deletion of your data',
              'Opt out of marketing emails at any time',
              'Withdraw consent at any time',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">7. Cookies</h2>
          <p className="text-gray-700 mb-3">We use cookies for:</p>
          <ul className="space-y-2 mb-3">
            {[
              'Google Analytics — anonymous usage tracking',
              'Saving your game preferences',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 text-sm">You can disable cookies in your browser settings.</p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">8. Security</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement industry standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.
          </p>
        </section>

        {/* Section 9 - Contact */}
        <section className="bg-purple-900 text-white rounded-xl p-6">
          <h2 className="text-lg font-bold text-yellow-400 uppercase tracking-wide mb-4 border-b border-purple-700 pb-2">9. Contact Us</h2>
          <p className="text-purple-200 mb-4">For privacy questions or concerns, contact:</p>
          <div className="space-y-1 text-white">
            <p className="font-semibold text-lg">Julianne Tajuba</p>
            <p className="text-purple-300">Chase Street Press</p>
            <div className="flex items-center gap-2 mt-3">
              <Mail size={16} className="text-yellow-400 flex-shrink-0" />
              <a href="mailto:julianne@chasestreetpress.co" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
                julianne@chasestreetpress.co
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-yellow-400 flex-shrink-0" />
              <a href="mailto:support@chasestreetpress.co" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">
                support@chasestreetpress.co
              </a>
            </div>
          </div>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">10. Changes to This Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update this policy periodically. We will notify you of significant changes via email or a notice on our website.
          </p>
        </section>

        {/* Footer back link */}
        <div className="pt-4 border-t border-gray-200">
          <Link
            to="/game-home-dashboard"
            className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-semibold transition-colors duration-200"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
