import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Yönetim paneli ayrı bir parça olarak yüklenir; ziyaretçiler bu kodu ve Firebase Auth'u hiç indirmez.
const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdminRoute = window.location.pathname.replace(/\/+$/, '') === '/admin';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={<div className="min-h-dvh bg-surface" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
