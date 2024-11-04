// app/settings/page.tsx
"use client"
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ContentSkeleton } from '@/components/LoadingOverlay';
import DbConsole from '@/components/DbConsole';
import { DebugProtectedRoute } from '@/components/debug/DebugProtectedRoute';
import UserProfileModal from '@/components/UserProfileModal';
import UserSchools from '@/components/UserSchools';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import UpdatePinModal from '@/components/UpdatePinModal';


interface SettingsSectionProps {
  title: string;
  feature: string;
  children: React.ReactNode;
}

const SettingsSection = ({ title, feature, children }: SettingsSectionProps) => (

  <ProtectedRoute
    feature={feature}
    loadingComponent={<ContentSkeleton />}
  >
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{title}</h3>
      {children}
    </div>
  </ProtectedRoute>
);

export default function SettingsPage() {
  const { canAccess, role, isLoading: permissionsLoading } = usePermissions();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);


  if (permissionsLoading) {
    return <ContentSkeleton />;
  }

  // Define available tabs based on permissions
  const availableTabs = [
    { id: 'user', label: 'User Settings', feature: 'settings' },
    { id: 'admin', label: 'Admin Settings', feature: 'settings.deleteMoods' },
    { id: 'system', label: 'System Settings', feature: 'settings.dbConsole' },
  ].filter(tab => canAccess(tab.feature));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="user">
        <TabsList className="w-full justify-start">
          {availableTabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex-1 max-w-[200px]"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-6 space-y-6">

          <TabsContent value="user">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 max-w-7xl mx-auto">
              {/* Personal Details Card */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Personal Details</CardTitle>
                  <CardDescription>
                    Manage your profile information and account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingsSection
                    title=""
                    feature="settings.userManagement"

                  >
                    <UserProfileModal />
                  </SettingsSection>
                </CardContent>
              </Card>

              {/* PIN Management Card */}
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Update PIN</CardTitle>
                  <CardDescription>
                    Manage your security PIN for account access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SettingsSection
                    title=""
                    feature="settings.updatePin"

                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Your PIN is used for secure actions
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setIsPinModalOpen(true)}
                      >
                        Update PIN
                      </Button>

                      <UpdatePinModal
                        isOpen={isPinModalOpen}
                        onClose={() => setIsPinModalOpen(false)}
                      />
                    </div>
                  </SettingsSection>
                </CardContent>
              </Card>
            </div>
            <UserSchools />
          </TabsContent>

          <TabsContent value="admin">
            <ProtectedRoute feature="settings.deleteMoods">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Manage mood entries and system settings
                  </div>
                  {/* Add your admin controls here */}
                </CardContent>
              </Card>
            </ProtectedRoute>
          </TabsContent>

          <TabsContent value="system">
            <ProtectedRoute feature="settings.dbConsole">
              <Card>
                <CardHeader>
                  <CardTitle>Database Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-4">
                    Advanced database operations and management
                  </div>
                  <DbConsole />
                </CardContent>
              </Card>
            </ProtectedRoute>
          </TabsContent>
        </div>
      </Tabs>

      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <DebugProtectedRoute feature="settings" />
      )}
    </div>
  );
}