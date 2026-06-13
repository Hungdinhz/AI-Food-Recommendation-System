'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers/AuthProvider';
import api from '@/lib/axios';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, id, email: resEmail, name } = response.data;
      login(token, { id, email: resEmail, name });
      router.push('/plan'); // Redirect after login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await api.post('/auth/google', { token: credentialResponse.credential });
      const { token, id, email: resEmail, name } = response.data;
      login(token, { id, email: resEmail, name });
      router.push('/plan');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập Google thất bại.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Đăng nhập</h1>
          <p className="text-slate-500">Chào mừng bạn quay lại với NutriAI</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Đăng nhập Google thất bại.')}
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-slate-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium font-semibold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
