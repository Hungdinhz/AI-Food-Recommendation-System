'use client';

import Link from 'next/link';
import { useAuth } from '@/app/providers/AuthProvider';
import { User, LogOut } from 'lucide-react';

export function AuthNav() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-20 h-8 bg-slate-200 animate-pulse rounded-md"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium hidden md:block">{user.name}</span>
        </div>
        <button
          onClick={logout}
          className="text-slate-500 hover:text-red-500 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm font-medium hover:text-primary-600 transition-colors"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Đăng ký
      </Link>
    </div>
  );
}
