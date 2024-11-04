import { withSentryConfig } from '@sentry/nextjs';
import withPWA from 'next-pwa';

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
  skipWaiting: true
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