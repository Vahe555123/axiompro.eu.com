import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

// Admin is served from /admin/ on the same host as the main API.
const base = import.meta.env.BASE_URL;
const routerBasename = base === '/' ? '' : base.replace(/\/$/, '');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename || undefined}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
