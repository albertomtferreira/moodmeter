"use client"
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

export default FeedbackButton;