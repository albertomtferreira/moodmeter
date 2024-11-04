"use client"
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';

interface UpdatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdatePinModal: React.FC<UpdatePinModalProps> = ({ isOpen, onClose }) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    if (!isOpen) {
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Handle modal close with custom cleanup
  const handleClose = () => {
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setIsSubmitting(false);
    onClose();
  };


  const validatePin = (pin: string) => {
    return /^\d{6}$/.test(pin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validatePin(currentPin)) {
      toast({
        title: "Invalid current PIN",
        description: "Current PIN must be 6 digits",
        variant: "destructive",
      });
      return;
    }

    if (!validatePin(newPin)) {
      toast({
        title: "Invalid new PIN",
        description: "New PIN must be 6 digits",
        variant: "destructive",
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast({
        title: "PINs don't match",
        description: "New PIN and confirmation PIN must match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading({ isLoading: true, message: 'Updating PIN...' });

      const response = await fetch('/api/admin/data/user/update-pin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPin,
          newPin,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update PIN');
      }

      toast({
        title: "PIN Updated",
        description: "Your PIN has been successfully updated",
        variant: "success",
      });

      handleClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update PIN',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setLoading({ isLoading: false });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update PIN</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPin">Current PIN</Label>
            <Input
              id="currentPin"
              type="password"
              maxLength={6}
              pattern="\d{6}"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Enter current 6-digit PIN"
              className="text-center tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPin">New PIN</Label>
            <Input
              id="newPin"
              type="password"
              maxLength={6}
              pattern="\d{6}"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter new 6-digit PIN"
              className="text-center tracking-widest"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm New PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              maxLength={6}
              pattern="\d{6}"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm new 6-digit PIN"
              className="text-center tracking-widest"
            />
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              Update PIN
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePinModal;