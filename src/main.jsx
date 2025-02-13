import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import UnitConverter from './App.jsx';  // Updated import

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UnitConverter />   {/* Updated component */}
  </StrictMode>,
);
