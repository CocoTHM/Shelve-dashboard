'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { authApi } from '@/lib/api';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        router.push('/auth/login?error=no_code');
        return;
      }

      try {
        // Échange le code contre un JWT
        const response = await authApi.callback(code, state || undefined);
        const { user, token } = response.data;

        // Sauvegarde dans le store
        login(user, token);

        // Redirige vers le dashboard
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Callback error:', error);
        router.push('/auth/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, login, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
        <p className="text-gray-600">Authentification en cours...</p>
      </div>
    </div>
  );
}
