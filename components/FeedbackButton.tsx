"use client"
import { Smile, Meh, Frown } from 'lucide-react';

const FeedbackButton: React.FC<{ emotion: string; onClick: () => void }> = ({ emotion, onClick }) => {
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

  return (

    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-lg transition-transform hover:scale-105"
      style={{ backgroundColor: getBackgroundColor() }}
    >
      <IconComponent size={196} color="white" />
      <span className="mt-2 text-background uppercase font-extrabold">
        {emotion}
      </span>
    </button>

  )

};

export default FeedbackButton;