import React from 'react';
import { Link } from 'react-router-dom';
import ReadTheBookSection from '../game-home-dashboard/components/ReadTheBookSection';
export default function BookWorld() {
  return <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 font-body">
    <header className="bg-gradient-to-r from-purple-700 to-blue-700 text-white p-5"><div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4"><Link to="/game-home-dashboard" className="font-heading text-2xl">MicrobeQuest</Link><Link to="/game-home-dashboard" className="underline min-h-[44px] inline-flex items-center">Back to your choices</Link></div></header>
    <main className="max-w-5xl mx-auto p-4 sm:p-8"><ReadTheBookSection /></main>
    <footer className="max-w-5xl mx-auto p-6 text-sm text-gray-600">Chase Street Press · Lead with curiosity.</footer>
  </div>;
}
