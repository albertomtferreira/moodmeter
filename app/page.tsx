"use client"
import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';


const FeedbackButton: React.FC<{ emotion: string; color: string; onClick: () => void }> = ({ emotion, color, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-lg bg-${color}`}>
    {emotion === 'happy' && <Smile size={196} color="white" />}
    {emotion === 'okay' && <Meh size={196} color="white" />}
    {emotion === 'unhappy' && <Frown size={196} color="white" />}
    <span className="mt-2 text-background uppercase font-extrabold">
      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
    </span>
  </button>
);

const HomePage: React.FC = () => {
  const handleFeedback = (emotion: string) => {
    console.log(`User selected: ${emotion}`);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen justify-between items-center p-4">


      <h1 className="text-2xl font-bold mt-8 text-text">How was your lunch today?</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-16">
        <FeedbackButton emotion="happy" color="primary" onClick={() => handleFeedback('happy')} />
        <FeedbackButton emotion="okay" color="secondary" onClick={() => handleFeedback('okay')} />
        <FeedbackButton emotion="unhappy" color="tertiary" onClick={() => handleFeedback('unhappy')} />
      </div>
      <p className="mb-4 text-sm text-text">Tap a face to share your feedback. This is anonymous.</p>
    </div>
  );
};

export default HomePage;