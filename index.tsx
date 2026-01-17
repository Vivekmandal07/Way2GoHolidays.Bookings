
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Fix: Import types at the entry point to ensure global JSX augmentation for custom elements like ion-icon
import './types';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
