import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const token = localStorage.getItem('adminToken');
  const sessionUnlocked = sessionStorage.getItem('adminSessionUnlocked') === 'true';
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    let active = true;

    if (!token || !sessionUnlocked) {
      setStatus('denied');
      return;
    }

    const verifySession = async () => {
      try {
        await api.get('/admin/session');
        if (active) setStatus('allowed');
      } catch {
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminSessionUnlocked');
        if (active) setStatus('denied');
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [token, sessionUnlocked]);

  if (!token || !sessionUnlocked) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (status === 'checking') {
    return (
      <div className="admin-page grid min-h-screen place-items-center p-4">
        <div className="glass-admin-card px-6 py-5 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#f8dce8] border-t-[#f48fb1]" />
          <p className="mt-3 text-sm font-black text-[#3f2e35]">Memeriksa sesi admin...</p>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
