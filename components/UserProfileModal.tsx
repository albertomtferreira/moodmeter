import React from 'react';
import { UserProfile } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const UserProfileModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-auto">
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] min-h-[600px] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Edit Your Profile</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-6">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0",
                navbar: "hidden",
                header: "hidden",
                profilePage__security: "hidden"
              }
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;