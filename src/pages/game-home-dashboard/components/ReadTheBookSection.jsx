import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

export default function ReadTheBookSection({ className = '' }) {
  return (
    <section id="meet-aunt-juju-charlie" aria-labelledby="book-world-title" className={`rounded-3xl border-2 border-purple-200 bg-white p-5 sm:p-8 shadow-lg ${className}`}>
      <p className="font-caption font-bold text-purple-700 mb-2">ONE WORLD. SO MANY WAYS TO WONDER.</p>
      <h2 id="book-world-title" className="font-heading text-2xl sm:text-3xl text-purple-800">Meet Aunt Juju &amp; Charlie</h2>
      <p className="font-body text-gray-700 mt-3 max-w-2xl">You can meet these curious companions in a book or investigate alongside Aunt Juju in MicrobeQuest. Start wherever your curiosity takes you.</p>
      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <article className="rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5 flex flex-col items-center text-center">
          <img src="/assets/images/color_graduating_aunt_juju-1760838289072.png" alt="Cartoon Aunt Juju smiling in glasses and holding a book" width="144" height="144" className="w-36 h-36 object-contain rounded-2xl bg-white" loading="lazy" />
          <h3 className="font-heading text-xl text-purple-800 mt-4">Aunt Juju</h3>
          <p className="font-body text-gray-700 mt-2">Your science guide. Bring your questions, look for clues and try an idea. It’s okay to change your mind when you discover something new.</p>
        </article>
        <article className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 flex flex-col items-center text-center">
          <img src="/assets/images/IMG_2430-1760838191946.PNG" alt="Charlie the Zebra, the illustrated companion from the book" width="144" height="144" className="w-36 h-36 object-contain rounded-2xl bg-white" loading="lazy" />
          <h3 className="font-heading text-xl text-purple-800 mt-4">Charlie the Zebra</h3>
          <p className="font-body text-gray-700 mt-2">Aunt Juju’s adventure companion. Meet Charlie in their book, then bring your own curiosity to the tiny world of microbes.</p>
        </article>
      </div>
      <div className="mt-6 rounded-2xl bg-purple-50 border border-purple-200 p-5">
        <h3 className="font-heading text-lg text-purple-800">Already read our book?</h3>
        <p className="font-body text-gray-700 mt-2">Keep wondering! In The Cafeteria Clue, you’ll compare evidence and try a virtual experiment. You don’t need the book or a purchase to try this investigation.</p>
        <Link to="/investigations/cafeteria" className="inline-flex items-center gap-2 mt-4 min-h-[48px] rounded-xl bg-purple-700 text-white font-semibold px-5 py-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Investigate with Aunt Juju <Icon name="ArrowRight" size={18} /></Link>
      </div>
      <details className="mt-6 rounded-2xl border-2 border-blue-200 p-5">
        <summary className="font-heading text-lg text-purple-800 cursor-pointer min-h-[44px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-600">For Grown-ups: discover the book</summary>
        <div className="grid sm:grid-cols-[160px_1fr] gap-5 mt-4 items-start">
          <img src="/assets/images/000_COVER_1-1760837711045.jpg" alt="Cover of The Adventures of Aunt Juju and Charlie the Zebra: Microbiology Edition" width="160" height="200" className="w-40 h-auto rounded-lg shadow-md" loading="lazy" />
          <div className="font-body text-gray-700 space-y-3">
            <h3 className="font-heading text-lg text-purple-800">The Adventures of Aunt Juju and Charlie the Zebra: Microbiology Edition</h3>
            <p>By Julianne Tajuba, published by Chase Street Press. The book introduces children to microbiology and the different careers people can pursue in the field.</p>
            <p>Read together, then ask: “Which science job would you like to learn more about?” The game offers another way to explore through questions, evidence and discovery. The Cafeteria Clue is a new fictional investigation, not a scene reproduced from the book.</p>
            <a href="https://chasestreetpress.co/products/the-adventures-of-aunt-juju-and-charlie-the-zebra" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 min-h-[48px] text-purple-800 font-bold underline">See the book at Chase Street Press <Icon name="ExternalLink" size={16} /><span className="sr-only"> (opens in a new tab)</span></a>
            <p className="text-sm">Book purchase is optional. This game connection is a prototype being reviewed with families.</p>
          </div>
        </div>
      </details>
    </section>
  );
}
