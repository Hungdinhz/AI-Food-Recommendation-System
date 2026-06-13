'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(response.data.message || 'Mật khẩu đã được thay đổi.');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra, token có thể đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Đặt lại mật khẩu</h1>
        <p className="text-slate-500">Nhập mật khẩu mới cho tài khoản của bạn</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu mới</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 mt-2"
        >
          {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Suspense fallback={<div>Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
