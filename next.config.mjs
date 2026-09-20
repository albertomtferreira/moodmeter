import { withSentryConfig } from '@sentry/nextjs';
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your base Next.js config options here
};

// PWA configuration
const withPWAConfig = withPWA({
  dest: 'public',
  // disable: false,
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  // Authenticated report responses must never fall back to another session's
  // service-worker cache, even when offline or when an API request is slow.
  runtimeCaching: [
    {
      urlPattern: ({ url }) => url.origin === self.location.origin &&
        (url.pathname.startsWith('/api/reports/') || url.pathname === '/api/users/schools'),
      handler: 'NetworkOnly',
      method: 'GET',
    },
    ...runtimeCaching,
  ],
})(nextConfig);

// Sentry configuration
const sentryConfig = {
  org: "alberto-ferreira",
  project: "mood-meter",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

// Combine both configurations
export default withSentryConfig(withPWAConfig, sentryConfig);
