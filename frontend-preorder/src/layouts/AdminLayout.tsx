import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  ShoppingCart,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  path: string;
  name: string;
  subtitle: string;
  icon: LucideIcon;
}

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const menuItems: MenuItem[] = [
  {
    path: '/admin',
    name: 'Dashboard',
    subtitle: 'Ringkasan operasional hari ini.',
    icon: LayoutDashboard,
  },
  {
    path: '/admin/products',
    name: 'Kelola Produk',
    subtitle: 'Menu, variant, gambar, dan status PO.',
    icon: Package,
  },
  {
    path: '/admin/orders',
    name: 'Kelola Pesanan',
    subtitle: 'Verifikasi dan pantau pesanan pelanggan.',
    icon: ShoppingCart,
  },
  {
    path: '/admin/reviews',
    name: 'Moderasi Ulasan',
    subtitle: 'Tampilkan ulasan yang siap masuk halaman publik.',
    icon: MessageSquare,
  },
];

const AdminSidebar = ({ currentPath, onNavigate, onLogout }: AdminSidebarProps) => (
  <div className="flex h-full flex-col">
    <div className="px-6 pb-5 pt-6">
      <div className="scan-sheen rounded-[28px] border border-white/70 bg-white/58 px-5 py-5 shadow-sm">
        <p className="text-lg font-black tracking-tight text-[#3f2e35]">Hi Pud Admin</p>
        <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#8a7c82]">Pre-Order Studio</p>
      </div>
    </div>

    <nav className="flex-1 space-y-2 px-4">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;

        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`pressable group flex w-full items-center gap-3 rounded-[24px] px-4 py-3.5 text-left text-sm ${
              isActive
                ? 'bg-[#f48fb1] text-white shadow-lg shadow-pink-200/60'
                : 'text-[#6d5963] hover:bg-white/70 hover:text-[#3f2e35]'
            }`}
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-[18px] ${isActive ? 'bg-white/18' : 'bg-white/55 group-hover:bg-[#f8dce8]/70'}`}>
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block font-extrabold">{item.name}</span>
              <span className={`mt-0.5 hidden truncate text-[11px] font-bold lg:block ${isActive ? 'text-white/75' : 'text-[#9a8a91]'}`}>{item.subtitle}</span>
            </span>
          </button>
        );
      })}
    </nav>

    <div className="p-4">
      <button
        onClick={onLogout}
        className="pressable flex w-full items-center justify-center gap-2 rounded-[24px] border border-[#f7a8a8]/45 bg-white/64 px-4 py-3 text-sm font-black text-[#b75161] hover:bg-[#f7a8a8]/20"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  </div>
);

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activePage = useMemo(
    () => menuItems.find((item) => item.path === location.pathname) || menuItems[0],
    [location.pathname]
  );

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminSessionUnlocked');
    navigate('/admin/login');
  };

  return (
    <div className="admin-page font-sans">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 p-5 lg:block">
        <div className="glass-admin-card h-full overflow-hidden">
          <AdminSidebar currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout} />
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup menu"
            className="absolute inset-0 bg-[#3f2e35]/24 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative h-full w-[min(84vw,310px)] p-4">
            <div className="glass-admin-card h-full overflow-hidden">
              <div className="absolute right-7 top-7 z-10">
                <button
                  type="button"
                  aria-label="Tutup menu"
                  onClick={() => setSidebarOpen(false)}
                  className="admin-icon-button bg-white/70 text-[#8a7c82]"
                >
                  <X size={20} />
                </button>
              </div>
              <AdminSidebar currentPath={location.pathname} onNavigate={handleNavigate} onLogout={handleLogout} />
            </div>
          </aside>
        </div>
      )}

      <main className="min-h-screen lg:pl-72">
        <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-5 sm:px-6 lg:px-9 lg:py-7">
          <header className="admin-topbar sticky top-4 z-20 mb-7 flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Buka menu"
                className="admin-icon-button bg-white/72 text-[#3f2e35] lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={21} />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f48fb1]">Admin Workspace</p>
                <h1 className="truncate text-base font-black text-[#3f2e35] sm:text-lg">
                  {activePage.name}
                </h1>
                <p className="hidden text-sm font-medium text-[#8a7c82] sm:block">
                  {activePage.subtitle}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/70 bg-white/58 px-2 py-2 sm:px-3">
              <div className="hidden text-right sm:block">
                <p className="text-xs font-black text-[#3f2e35]">Hi Pud Team</p>
                <p className="text-[11px] font-bold text-[#8a7c82]">Admin</p>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#f8dce8] text-[#f48fb1]">
                <UserRound size={18} />
              </div>
            </div>
          </header>

          <div className="flex-1 pb-8">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
