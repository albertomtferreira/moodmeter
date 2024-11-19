// app/(landing)/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { ArrowRight, BarChart2, Shield, Zap, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AnalyticsService } from '@/lib/services/analytics';

export default function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasTrackedPrompt, setHasTrackedPrompt] = useState(false);

  // Platform detection
  const getPlatform = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) return 'ANDROID';
    if (/(iphone|ipad|ipod)/.test(userAgent)) return 'IOS';
    if (/windows/.test(userAgent)) return 'WINDOWS';
    if (/mac/.test(userAgent)) return 'MAC';
    return 'OTHER';
  };

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = async (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);

      // Track that PWA is installable
      if (!hasTrackedPrompt) {
        try {
          await AnalyticsService.recordInstallationEvent({
            source: 'BROWSER_PROMPT',
            stage: 'PROMPTED',
            platform: getPlatform(),
            deviceInfo: {
              userAgent: window.navigator.userAgent,
              language: window.navigator.language,
              platform: window.navigator.platform
            }
          });
          setHasTrackedPrompt(true);
        } catch (error) {
          console.error('Failed to record installation prompt:', error);
        }
      }
    };


    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    // Remove this event listener since we'll track completion in handleInstallClick
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [hasTrackedPrompt]); // Add hasTrackedPrompt to dependencies

  const handleInstallClick = async (source: 'HERO_BUTTON' | 'MOBILE_BANNER') => {
    if (!deferredPrompt) return;

    try {
      // Track acceptance
      await AnalyticsService.recordInstallationEvent({
        source,
        stage: 'ACCEPTED',
        platform: getPlatform(),
        deviceInfo: {
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          platform: window.navigator.platform
        }
      });

      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        // Track completion here instead of in appinstalled event
        await AnalyticsService.recordInstallationEvent({
          source,
          stage: 'COMPLETED',
          platform: getPlatform(),
          deviceInfo: {
            userAgent: window.navigator.userAgent,
            language: window.navigator.language,
            platform: window.navigator.platform
          }
        });
      } else {
        await AnalyticsService.recordInstallationEvent({
          source,
          stage: 'REJECTED',
          platform: getPlatform(),
          deviceInfo: {
            userAgent: window.navigator.userAgent,
            language: window.navigator.language,
            platform: window.navigator.platform
          }
        });
      }
    } catch (error) {
      console.error('Error installing PWA:', error);
      await AnalyticsService.recordInstallationEvent({
        source,
        stage: 'FAILED',
        platform: getPlatform(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        deviceInfo: {
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          platform: window.navigator.platform
        }
      });
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden bg-gradient-to-b from-background to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Transform Feedback into
              <span className="text-primary block mt-2">Meaningful Action</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Empower your organization with real-time mood tracking and analytics.
              Make data-driven decisions to improve satisfaction and engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                <Link href="/sign-up">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="px-8"
              >
                <Link href="/">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              {isInstallable && !isInstalled && (
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 bg-secondary/10 hover:bg-secondary/20"
                  onClick={() => handleInstallClick('HERO_BUTTON')}
                >
                  Install App
                  <Download className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
            {isInstalled && (
              <div className="mt-4 text-sm text-primary flex items-center justify-center gap-2">
                <Shield className="h-4 w-4" />
                App installed successfully! Open it from your home screen.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="rounded-lg p-3 inline-block bg-primary/10 mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">Track mood trends and patterns with instant visualization.</p>
            </div>
            <div className="text-center p-6">
              <div className="rounded-lg p-3 inline-block bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Anonymous Feedback</h3>
              <p className="text-gray-600">Ensure honest responses with secure, anonymous feedback.</p>
            </div>
            <div className="text-center p-6">
              <div className="rounded-lg p-3 inline-block bg-primary/10 mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Deployment</h3>
              <p className="text-gray-600">Get started in minutes with our simple setup process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PWA Install Banner - Shows at bottom on mobile */}
      {isInstallable && !isInstalled && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg p-4 z-50">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex-1">
              <h3 className="font-semibold">Install MoodMeter</h3>
              <p className="text-sm text-gray-600">Get the best experience</p>
            </div>
            <Button
              size="sm"
              className="bg-primary text-white"
              onClick={() => handleInstallClick('MOBILE_BANNER')}
            >
              Install
              <Download className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}