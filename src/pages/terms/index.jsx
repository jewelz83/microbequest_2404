import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Mail } from 'lucide-react';

const TermsOfService = () => {
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
              <FileText size={22} className="text-purple-900" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Terms of Service</h1>
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
            These Terms of Service govern your use of <span className="text-purple-700 font-medium">MicrobeQuest</span> operated by <span className="text-purple-700 font-medium">Chase Street Press</span>. By using MicrobeQuest, you agree to these terms.
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using MicrobeQuest, you agree to be bound by these Terms. If you are under 18, a parent or guardian must agree to these Terms on your behalf.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">2. Description of Service</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            MicrobeQuest is an educational STEM game that teaches microbiology through interactive gameplay. We offer:
          </p>
          <ul className="space-y-2">
            {[
              'A free Explorer tier with limited content',
              'A paid Scientist subscription with full access',
              'A Classroom license for educators',
              'The Sunflower Access Program for qualifying nonprofits and Title I schools',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">3. Accounts and Subscriptions</h2>
          <ul className="space-y-2">
            {[
              'You must provide accurate information when creating an account',
              'You are responsible for maintaining the security of your account credentials',
              'Subscriptions automatically renew unless cancelled',
              'You may cancel your subscription at any time through your account settings',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">4. Payment Terms</h2>
          <ul className="space-y-2">
            {[
              'Monthly subscriptions: $1.99/month',
              'Annual subscriptions: $14.99/year',
              'Classroom license: $79/year',
              'All payments processed securely through Stripe',
              'Prices may change with 30 days notice to existing subscribers',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">5. Refund Policy</h2>
          <ul className="space-y-2">
            {[
              'Monthly subscriptions: No refunds for partial months',
              'Annual subscriptions: Refund within 14 days of purchase if you have not accessed premium content',
              'Classroom licenses: Refund within 30 days if unsatisfied',
              'Sunflower Access Program: No payment required',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">6. Intellectual Property</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            All content in MicrobeQuest including but not limited to games, characters, text, graphics, and educational content is owned by Chase Street Press and protected by copyright law. You may not:
          </p>
          <ul className="space-y-2">
            {[
              'Copy or reproduce any content',
              'Modify or create derivative works',
              'Distribute or sell any content',
              'Use our content for commercial purposes',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">7. Acceptable Use</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">You agree not to:</p>
          <ul className="space-y-2">
            {[
              'Use the service for any unlawful purpose',
              'Attempt to gain unauthorized access to our systems',
              'Interfere with or disrupt the service',
              'Collect data from the service without permission',
              'Share your account credentials with others',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">8. Educational Use</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Teachers and schools using the Classroom license may:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Allow students to access MicrobeQuest',
              'Use game content for educational purposes',
              'Share progress reports with parents',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed">
            Teachers may not share classroom license credentials beyond their registered class.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">9. Sunflower Access Program</h2>
          <p className="text-gray-700 mb-3 leading-relaxed">
            Qualifying organizations receive free access subject to:
          </p>
          <ul className="space-y-2">
            {[
              'Verification of nonprofit or Title I status',
              'Annual renewal of qualification',
              'Use limited to educational purposes only',
              'No resale or redistribution of access',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">10. Disclaimer of Warranties</h2>
          <p className="text-gray-700 leading-relaxed">
            MicrobeQuest is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">11. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            Chase Street Press shall not be liable for any indirect, incidental, or consequential damages arising from your use of MicrobeQuest.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">12. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of the State of Georgia without regard to conflict of law principles.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">13. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms periodically. Continued use of MicrobeQuest after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* Section 14 — Contact */}
        <section>
          <h2 className="text-lg font-bold text-purple-800 uppercase tracking-wide mb-3 border-b-2 border-yellow-400 pb-1">14. Contact Us</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">For questions about these Terms, contact:</p>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 space-y-2">
            <p className="font-semibold text-purple-900">Julianne Tajuba</p>
            <p className="text-gray-700">Chase Street Press</p>
            <a
              href="mailto:julianne@chasestreetpress.co"
              className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-colors duration-200"
            >
              <Mail size={16} />
              julianne@chasestreetpress.co
            </a>
          </div>
        </section>

        {/* Back to Home — bottom */}
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

export default TermsOfService;
