'use client';

import React from 'react';
import { AuthProvider } from './AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: React.ReactNode }) {
  // Replace with your actual Google Client ID from environment variables
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '123456789-dummy-client-id.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
