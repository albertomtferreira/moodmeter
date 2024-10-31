// components/AuthModal.tsx
"use client"
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from '@/store/useAuthStore';

interface AuthModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onSuccess, onCancel }: AuthModalProps) {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthenticated } = useAuthStore();
  const { toast } = useToast();

  const resetForm = () => {
    setPin('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Submitting auth request:', { username, pin });

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, pin }),
      });

      const data = await response.json();
      console.log('Auth response:', data);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Authentication successful",
          duration: 3000,
          variant: "success",
        });
        resetForm();
        setAuthenticated(true);
        onSuccess();
        toast({
          title: "Authentication successful",
          description: "Loading your preferences...",
          duration: 3000,
          variant: "success"
        });
      } else {
        setError(data.error || "Invalid username or PIN");
        setPin('');
        toast({
          title: "Error",
          description: data.error || "Invalid username or PIN",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError("An error occurred during authentication");
      setPin('');
      toast({
        title: "Error",
        description: "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Authentication Required</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder="Enter your username"
              disabled={isLoading}
              required
              autoComplete="username"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              PIN
            </label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter your PIN"
              maxLength={6}
              disabled={isLoading}
              required
              autoComplete="current-password"
              className="w-full"
              pattern="\d{6}"
              title="Please enter a 6-digit PIN"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || pin.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}