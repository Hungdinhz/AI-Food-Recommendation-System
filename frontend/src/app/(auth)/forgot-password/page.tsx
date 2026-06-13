'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'Nếu email tồn tại, link khôi phục đã được gửi.');
    } catch (err: any) {
      setMessage('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Quên mật khẩu</h1>
          <p className="text-slate-500">Nhập email của bạn để nhận link khôi phục</p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium font-semibold">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
