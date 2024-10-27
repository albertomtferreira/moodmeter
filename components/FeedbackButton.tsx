"use client"
import { Smile, Meh, Frown } from 'lucide-react';
import { useState } from 'react';

interface FeedbackButtonProps {
  emotion: string;
  onClick: () => void;
  disabled?: boolean;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ emotion, onClick, disabled }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const getBackgroundColor = () => {
    switch (emotion) {
      case 'happy':
        return 'var(--color-primary)';
      case 'okay':
        return 'var(--color-secondary)';
      case 'unhappy':
        return 'var(--color-tertiary)';
      default:
        return 'var(--color-background)';
    }
  };

  const IconComponent = emotion === 'happy' ? Smile : emotion === 'okay' ? Meh : Frown;

  const handleClick = () => {
    if (!disabled) {
      setIsAnimating(true);
      onClick();
      // Reset animation after it completes
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        aspect-square w-full flex flex-col items-center justify-center p-2 sm:p-4 
        rounded-xl sm:rounded-2xl transition-colors duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        ${isAnimating ? 'animate-shake' : ''}
      `}
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <div className="relative w-full aspect-square">
        <IconComponent
          className={`
            text-white w-[80%] h-[80%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            transition-transform duration-200
            ${isAnimating ? 'scale-110' : ''}
          `}
        />
      </div>
      <span className="mt-1 sm:mt-2 text-white uppercase font-bold tracking-wider text-xs sm:text-sm md:text-base">
        {emotion}
      </span>
    </button>
  );
};

export default FeedbackButton;