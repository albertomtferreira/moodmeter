// app/page.tsx
"use client"
import FeedbackButton from '@/components/FeedbackButton';
import type { Mood, School } from '@/types';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Menu, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuthStore } from '@/store/useAuthStore';
import { useSchoolStore } from '@/store/useSchoolStore';
import { useAppStore } from '@/store/useAppStore';
import NavbarToggle from '@/components/navbar/NavbarToggle';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();
  const { selectedSchool, setSelectedSchool } = useSchoolStore();
  const { setLoading } = useAppStore();
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const SUBMISSION_COOLDOWN = 400; // ms cooldown period

  // Handle mobile viewport height adjustments
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    // Set initial height
    updateViewportHeight();

    // Add overflow hidden to body only when homepage is mounted
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Update on resize and orientation change
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Cleanup function
    return () => {
      // Remove overflow hidden when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  // Load preferred school on mount
  useEffect(() => {
    const loadPreferredSchool = async () => {
      if (isAuthenticated && !selectedSchool && isInitialLoad) {
        setLoading(true);
        try {
          const response = await fetch('/api/users/schools', {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch schools');
          }

          const schools = await response.json();
          const preferredSchool = schools.find((s: UserSchool) => s.isPreferred);

          if (preferredSchool) {
            setSelectedSchool(preferredSchool.school);
          }
        } catch (error) {
          console.error('Error loading preferred school:', error);
        } finally {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    loadPreferredSchool();
  }, [isAuthenticated, selectedSchool, isInitialLoad, setSelectedSchool]);

  interface UserSchool {
    school: School;
    isPreferred: boolean;
  }

  // Hydrate stores
  useEffect(() => {
    useAuthStore.persist.rehydrate();
    useSchoolStore.persist.rehydrate();
    useAppStore.persist.rehydrate();
  }, []);

  const isButtonDisabled = (): boolean => {
    return !!(lastSubmission && Date.now() - lastSubmission.getTime() < SUBMISSION_COOLDOWN) || false;
  };

  const handleFeedback = async (emotion: Mood) => {
    if (!selectedSchool) {
      setShowModal(true);
      return;
    }

    // Check for cooldown period
    if (lastSubmission && Date.now() - lastSubmission.getTime() < SUBMISSION_COOLDOWN) {
      console.log('Please wait before submitting again');
      return;
    }

    setLoading(true, 'Submitting feedback...');

    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: emotion,
          schoolId: selectedSchool.id,
          period: 'LUNCH',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Record submission time
      setLastSubmission(new Date());

      // Show success modal
      setShowSuccessModal(true);

      // Auto-hide success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Custom Notification Component
  const Notification = ({
    show,
    onClose,
    type,
    title,
    message,
    icon: Icon
  }: {
    show: boolean;
    onClose: (value: boolean) => void;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    icon: any;
  }) => {
    if (!show) return null;

    const bgColors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500'
    };

    return (
      <div className={cn(
        "fixed bottom-4 right-4 md:right-8 p-4 rounded-lg shadow-lg z-50",
        "w-[300px] md:w-[350px]",
        "transform transition-all duration-300 ease-in-out",
        bgColors[type],
        show ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}>
        <div className="flex items-start space-x-3 text-white">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 w-0">
            <p className="font-medium text-sm">{title}</p>
            <p className="mt-1 text-sm opacity-90 break-words">{message}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              className="ml-2 inline-flex text-white hover:opacity-75"
              onClick={() => onClose(false)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <NavbarToggle />
      <div
        className="bg-background flex flex-col items-center px-4 py-2 sm:px-8 sm:py-4"
        style={{ height: viewportHeight, maxHeight: viewportHeight }}
      >
        {/* Header Section */}
        <div className="w-full max-w-6xl flex justify-center pt-2">
          <div
            className={`
              inline-block px-4 py-2 rounded-full text-sm sm:text-base font-medium shadow-md 
              transition-all duration-300 ease-in-out max-w-[90vw] truncate
              ${selectedSchool ? 'opacity-100 transform translate-y-0 text-white' : 'transform -translate-y-4 text-black'}
            `}
            style={{ backgroundColor: selectedSchool?.color || 'transparent' }}
          >
            {selectedSchool
              ? `Share your feedback for ${selectedSchool.name}`
              : 'Please select a school from the menu on the top right'}
          </div>
        </div>

        {/* School Selection Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>School Selection Required</DialogTitle>
              <DialogDescription className="pt-4">
                Please select a school before sharing your feedback. You can find the school selection menu by clicking the
                <span className="inline-flex items-center mx-2 px-2 py-1 bg-gray-100 rounded">
                  <Menu className="h-4 w-4 mr-1" />
                  Menu
                </span>
                button in the top right corner.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button
                variant="default"
                onClick={() => setShowModal(false)}
                className="mt-4"
              >
                Got it
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications */}
        <Notification
          show={showSuccessModal}
          onClose={setShowSuccessModal}
          type="success"
          title="Thank You!"
          message={`Your feedback has been successfully recorded for ${selectedSchool?.name}.`}
          icon={CheckCircle2}
        />

        <Notification
          show={showErrorModal}
          onClose={setShowErrorModal}
          type="error"
          title="Oops!"
          message="Something went wrong while recording your feedback. Please try again. User Session might have expired."
          icon={AlertCircle}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl" style={{ marginTop: '-20vh' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-text text-center px-2">
            How was your lunch today?
          </h1>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8 w-full max-w-5xl px-2">
            <FeedbackButton
              emotion="happy"
              onClick={() => handleFeedback('happy')}
              disabled={isButtonDisabled()}
            />
            <FeedbackButton
              emotion="okay"
              onClick={() => handleFeedback('okay')}
              disabled={isButtonDisabled()}
            />
            <FeedbackButton
              emotion="unhappy"
              onClick={() => handleFeedback('unhappy')}
              disabled={isButtonDisabled()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;