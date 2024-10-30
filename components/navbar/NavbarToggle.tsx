// components/NavbarToggle.tsx
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "../AuthModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const NavbarToggle = () => {
  const {
    isNavbarVisible,
    isAuthenticated,
    toggleNavbar,
    setAuthenticated,
    setNavbarVisibility
  } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toast } = useToast();

  const handleToggleClick = () => {
    if (!isNavbarVisible && !isAuthenticated) {
      setShowAuthModal(true);
    } else {
      toggleNavbar();
      if (isNavbarVisible) {
        setAuthenticated(false);
        toast({
          title: "Kiosk Mode Enabled",
          description: "Navbar is now hidden",
          duration: 2000,
        });
      }
    }
  };

  const handleAuthSuccess = () => {
    setAuthenticated(true);
    setShowAuthModal(false);
    setNavbarVisibility(true);
    toast({
      title: "Access Granted",
      description: "Navbar is now visible! Ensure that you close it when not in use.",
      duration: 2000,
      variant: "warning",
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className={`fixed ${isNavbarVisible ? 'left-20' : 'left-4'} top-4 z-40 transition-all duration-300`}
        onClick={handleToggleClick}
      >
        {isNavbarVisible ? <EyeOff /> : <Eye />}
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onSuccess={handleAuthSuccess}
        onCancel={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default NavbarToggle;