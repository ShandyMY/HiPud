import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || '/admin';

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/admin/login', {
        username: username.trim(),
        password: password.trim(),
      });
      const { token } = response.data;
      localStorage.setItem('adminToken', token);
      sessionStorage.setItem('adminSessionUnlocked', 'true');
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Login admin gagal:', error);
      localStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminSessionUnlocked');
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Username atau password salah.',
        buttonsStyling: false,
        customClass: { confirmButton: 'btn-admin-primary px-5 py-2.5 font-black' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page flex min-h-screen items-center justify-center p-4 font-sans">
      <div className="glass-admin-card w-full max-w-md overflow-hidden p-6 sm:p-7">
        <div className="rounded-[28px] border border-white/70 bg-white/58 p-7 text-center">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-3xl bg-[#f8dce8] text-[#f48fb1]">
            <Lock size={28} />
          </div>
          <h1 className="text-xl font-black text-[#3f2e35]">Hi Pud Admin</h1>
          <p className="mt-1 text-sm font-bold text-[#8a7c82]">Pre-Order Studio</p>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <label className="admin-label flex items-center gap-2">
              <User size={16} className="text-[#f48fb1]" /> Username
            </label>
            <input
              type="text"
              required
              className="admin-soft-input mt-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="admin-label flex items-center gap-2">
              <Lock size={16} className="text-[#f48fb1]" /> Password
            </label>
            <input
              type="password"
              required
              className="admin-soft-input mt-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-admin-primary w-full px-5 py-3.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
