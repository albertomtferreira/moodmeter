// HomePage.tsx
"use client"
import FeedbackButton from '@/components/FeedbackButton';
import { useSchool } from '@/contexts/SchoolContext';
import type { Mood } from '@/types';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Menu } from 'lucide-react';

const HomePage = () => {
  const { selectedSchool } = useSchool();
  const [viewportHeight, setViewportHeight] = useState('100vh');
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<Date | null>(null);
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

  const isButtonDisabled = (): boolean => {
    return !!(lastSubmission && Date.now() - lastSubmission.getTime() < SUBMISSION_COOLDOWN);
  };

  const handleFeedback = (emotion: Mood) => {
    if (!selectedSchool) {
      setShowModal(true);
      return;
    }

    // Check for cooldown period
    if (lastSubmission && Date.now() - lastSubmission.getTime() < SUBMISSION_COOLDOWN) {
      console.log('Please wait before submitting again');
      return;
    }

    const feedbackData = {
      mood: emotion,
      timestamp: new Date().toISOString(),
      school: selectedSchool.name,
      schoolId: selectedSchool.id
    };

    console.log('Feedback Data:', feedbackData);
    // Record submission time
    setLastSubmission(new Date());

    // Show success modal
    setShowSuccessModal(true);

    // Auto-hide success modal after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  };

  return (
    <div>
      <div
        className="bg-background flex flex-col items-center px-4 py-2 sm:px-8 sm:py-4"
        style={{ height: viewportHeight, maxHeight: viewportHeight }}
      >
        {/* Header Section */}
        <div className="w-full max-w-6xl flex justify-center pt-2">
          <div
            className={`
              inline-block px-4 py-2 rounded-full  text-sm sm:text-base font-medium shadow-md 
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

        {/* Success Modal */}
        {/* <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md text-center">
            <div className="flex flex-col items-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <DialogTitle className="text-xl mb-2">Thank You!</DialogTitle>
              <DialogDescription>
                Your feedback has been successfully recorded for {selectedSchool?.name}.
              </DialogDescription>
            </div>
          </DialogContent>
        </Dialog> */}

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