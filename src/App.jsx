import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UnitConverter from './UnitConversion';
import CommonUnitSystemsFAQ from './CommonUnitSystemsFAQ';

export default function App() {
  return (
    <BrowserRouter>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <span className="inline-flex items-center">
              {/* An optional SVG icon or logo */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 11h20M2 7h20M2 15h20M2 19h20"
                />
              </svg>
              Unit Converter Pro
            </span>
          </Link>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/faq" className="text-gray-700 hover:text-blue-600">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content: define routes here */}
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<UnitConverter />} />
            <Route path="/faq" element={<CommonUnitSystemsFAQ />} />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} UnitConverter Pro. All rights
            reserved.
          </p>
          <div className="text-sm mt-2 md:mt-0">
            <a href="#" className="text-blue-500 hover:underline mr-4">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-500 hover:underline">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
}
