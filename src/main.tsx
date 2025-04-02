import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './index.css';

// Find root element and create React root
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please check your HTML file.');
}

// Render the application
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
