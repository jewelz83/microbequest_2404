import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className="bg-purple-900 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/game-home-dashboard"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200 mb-6 font-semibold text-sm"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <RefreshCw size={22} className="text-purple-900" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Refund Policy</h1>
          </div>
          <p className="text-purple-300 text-sm mt-2 ml-13">Last Updated: April 15, 2026</p>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">

        {/* Our Commitment */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-700 leading-relaxed">
            At Chase Street Press we want you to be completely satisfied with MicrobeQuest. If you are not happy with your purchase we will work with you to make it right.
          </p>
        </section>

        {/* Monthly Subscriptions */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Monthly Subscriptions <span className="text-purple-600 normal-case font-semibold text-base">($1.99/month)</span>
          </h2>
          <ul className="space-y-2">
            {[
              'You may cancel at any time',
              'Cancellation takes effect at end of billing period',
              'No refunds for partial months already billed',
              'You retain access until end of paid period',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Annual Subscriptions */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Annual Subscriptions <span className="text-purple-600 normal-case font-semibold text-base">($14.99/year)</span>
          </h2>
          <ul className="space-y-2">
            {[
              'Full refund within 14 days of purchase',
              'Refund only if you have not accessed premium content',
              'After 14 days no refunds but you may cancel to prevent renewal',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
            <li className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              Contact{' '}
              <a href="mailto:support@chasestreetpress.co" className="text-purple-700 hover:text-purple-900 underline underline-offset-2 font-medium">
                support@chasestreetpress.co
              </a>{' '}
              to request
            </li>
          </ul>
        </section>

        {/* Classroom Licenses */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Classroom Licenses <span className="text-purple-600 normal-case font-semibold text-base">($79/year)</span>
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              Full refund within 30 days of purchase
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              Partial refunds considered on case by case basis
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              Contact{' '}
              <a href="mailto:teachers@chasestreetpress.co" className="text-purple-700 hover:text-purple-900 underline underline-offset-2 font-medium">
                teachers@chasestreetpress.co
              </a>{' '}
              to request
            </li>
            <li className="flex items-start gap-3 text-gray-700">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              We will work with school budget cycles when needed
            </li>
          </ul>
        </section>

        {/* Sunflower Access Program */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Sunflower Access Program
          </h2>
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-5 py-4">
            <p className="text-gray-700 leading-relaxed">
              🌻 No payment required — always free for qualifying organizations.
            </p>
          </div>
        </section>

        {/* How to Request a Refund */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            How to Request a Refund
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Email us at{' '}
            <a href="mailto:support@chasestreetpress.co" className="text-purple-700 hover:text-purple-900 underline underline-offset-2 font-medium">
              support@chasestreetpress.co
            </a>{' '}
            with:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              'Your name and email address',
              'Order confirmation number',
              'Reason for refund request',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-700 leading-relaxed">We will respond within 2 business days.</p>
        </section>

        {/* Exceptions */}
        <section>
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide border-b-2 border-yellow-400 pb-2 mb-4">
            Exceptions
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to deny refunds in cases of:
          </p>
          <ul className="space-y-2">
            {[
              'Abuse of the refund policy',
              'Violation of our Terms of Service',
              'Fraudulent activity',
            ]?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Questions */}
        <section className="bg-purple-50 border border-purple-200 rounded-xl px-6 py-6">
          <h2 className="text-xl font-bold text-purple-900 uppercase tracking-wide mb-3">
            Questions
          </h2>
          <p className="text-gray-700 leading-relaxed mb-1">
            Contact us at{' '}
            <a href="mailto:support@chasestreetpress.co" className="text-purple-700 hover:text-purple-900 underline underline-offset-2 font-medium">
              support@chasestreetpress.co
            </a>
          </p>
          <p className="text-gray-700 leading-relaxed">We are committed to making this right for you.</p>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8 text-center space-y-1">
          <p className="text-purple-900 font-bold text-base">Chase Street Press</p>
          <p className="text-gray-500 text-sm">A minority and woman-owned STEM learning platform</p>
          <p className="text-yellow-500 text-sm font-medium">🌻 Lead with curiosity</p>
          <div className="pt-4">
            <Link
              to="/game-home-dashboard"
              className="inline-flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors duration-200 font-semibold text-sm"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RefundPolicy;
