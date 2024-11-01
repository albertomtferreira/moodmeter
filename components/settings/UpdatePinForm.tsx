// components/settings/UpdatePinForm.tsx
"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';

export const UpdatePinForm = () => {
  const { setLoading } = useAppStore();
  const [pin, setPin] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({
      isLoading: true,
      message: 'Updating PIN...',
      type: 'content'
    });

    try {
      // API call to update PIN
      // await updatePin(pin);

      // Show success message using your toast system
    } catch (error) {
      // Handle error
    } finally {
      setLoading({
        isLoading: false
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        placeholder="Enter new PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        maxLength={6}
      />
      <Button type="submit" className="w-full">
        Update PIN
      </Button>
    </form>
  );
};