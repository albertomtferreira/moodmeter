"use client"
import FeedbackButton from '@/components/FeedbackButton';
import React from 'react';



const HomePage: React.FC = () => {
  const handleFeedback = (emotion: 'happy' | 'okay' | 'unhappy') => {
    console.log(`User selected: ${emotion}`);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen justify-between items-center p-4">
      <h1 className="text-2xl font-bold mt-8 text-text">How was your lunch today?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        <FeedbackButton emotion="happy" onClick={() => handleFeedback('happy')} />
        <FeedbackButton emotion="okay" onClick={() => handleFeedback('okay')} />
        <FeedbackButton emotion="unhappy" onClick={() => handleFeedback('unhappy')} />
      </div>
      <p className="mb-4 text-sm text-text">Tap a face to share your feedback. This is anonymous.</p>
    </div>
  );
};

export default HomePage;