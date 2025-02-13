import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UnitConverter from './UnitConversion';
import CommonUnitSystemsFAQ from './CommonUnitSystemsFAQ';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex p-4 bg-gray-100 gap-4">
        <Link className="text-blue-600" to="/">Unit Converter</Link>
        <Link className="text-blue-600" to="/faq">Common Unit Systems FAQ</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UnitConverter />} />
        <Route path="/faq" element={<CommonUnitSystemsFAQ />} />
      </Routes>
    </BrowserRouter>
  );
}
