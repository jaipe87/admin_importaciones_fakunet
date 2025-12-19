
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Image as ImageIcon, LogOut, Menu, X, Tag, Layers, MonitorPlay, MessageSquare, BarChart3 } from 'lucide-react';
import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analítica', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Productos', href: '/admin/products', icon: Package },
    { name: 'Marcas', href: '/admin/brands', icon: Tag },
    { name: 'Categorías', href: '/admin/categories', icon: Layers },
    { name: 'Slider Home', href: '/admin/slider', icon: MonitorPlay },
    { name: 'Multimedia', href: '/admin/media', icon: ImageIcon },
    { name: 'Mensajes', href: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-fakunet-bg overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-fakunet-main text-white shadow-xl">
        <div className="p-6 border-b border-fakunet-medium">
          <h2 className="text-xl font-bold">FAKUNET</h2>
          <span className="text-xs text-blue-200">Panel Administrativo</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-fakunet-cta text-white' : 'text-gray-300 hover:bg-fakunet-medium hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-fakunet-medium">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-300 hover:bg-red-900/30 hover:text-red-100 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-fakunet-main text-white p-4 shadow-md z-20">
          <span className="font-bold">FAKUNET ADMIN</span>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-fakunet-main z-10 shadow-xl border-t border-fakunet-medium">
            <nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    pathname === item.href ? 'bg-fakunet-cta' : 'text-gray-300'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-red-300 hover:bg-red-900/20 w-full text-left rounded-lg"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
