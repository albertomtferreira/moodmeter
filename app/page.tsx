"use client"
import React, { useState } from 'react';
import { Smile, Meh, Frown, Menu, Home, FileText, Settings, LogIn, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const FeedbackButton: React.FC<{ emotion: string; color: string; onClick: () => void }> = ({ emotion, color, onClick }) => (
  console.log(color),

  < button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-lg bg-${color} `}>
    {emotion === 'happy' && <Smile size={196} color="white" />}
    {emotion === 'okay' && <Meh size={196} color="white" />}
    {emotion === 'unhappy' && <Frown size={196} color="white" />}
    <span className="mt-2 text-background uppercase font-extrabold ">
      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
    </span>
  </button >
);

const LeftMenu: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute left-4 top-4">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col space-y-4">
          <Button variant="ghost" className="justify-start"><Home className="mr-2" /> Home</Button>
          <Button variant="ghost" className="justify-start"><FileText className="mr-2" /> Report</Button>
          <Button variant="ghost" className="justify-start"><Settings className="mr-2" /> Settings</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setIsLoggedIn(!isLoggedIn)}>
            {isLoggedIn ? <><LogOut className="mr-2" /> Logout</> : <><LogIn className="mr-2" /> Login</>}
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

const RightMenu: React.FC = () => {
  const schools = [
    { name: 'School A', color: '#FF5733' },
    { name: 'School B', color: '#33FF57' },
    { name: 'School C', color: '#5733FF' },
    { name: 'School D', color: '#FFFF33' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute right-4 top-4">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-none">
        <div className="grid grid-cols-2 gap-4 p-4">
          {schools.map((school, index) => (
            <button
              key={index}
              className="aspect-square rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform hover:scale-105"
              style={{ backgroundColor: school.color }}
            >
              {school.name}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const HomePage: React.FC = () => {
  const handleFeedback = (emotion: string) => {
    console.log(`User selected: ${emotion}`);
    // Here you would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-background flex flex-col h-screen justify-between items-center p-4">
      <LeftMenu />
      <RightMenu />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <img src="/api/placeholder/100/50" alt="Logo" className="h-12" />
      </div>
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