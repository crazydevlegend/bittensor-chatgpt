import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';

import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '@/utils/app/const';

import '@/styles/globals.css';

if (!AUTH0_CLIENT_ID || !AUTH0_DOMAIN) {
  throw new Error(
    'Please define AUTH0_CLIENT_ID and AUTH0_DOMAIN in your .env.local file',
  );
}

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();

  return (
    <div className={inter.className}>
      <Toaster />
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri:
            process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI ||
            'http://localhost:3000',
          audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
          scope: 'openid profile email',
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Auth0Provider>
    </div>
  );
}

export default appWithTranslation(App);
