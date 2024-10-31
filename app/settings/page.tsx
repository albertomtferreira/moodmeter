// app/settings/page.tsx
"use client"
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ContentSkeleton } from '@/components/LoadingOverlay';
import DbConsole from '@/components/DbConsole';
import { DebugProtectedRoute } from '@/components/debug/DebugProtectedRoute';
import { UserButton, UserProfile } from '@clerk/nextjs';
import UserProfileModal from '@/components/UserProfileModal';

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
            <Card>
              <CardHeader>
                <CardTitle>User Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SettingsSection
                  title="Update Your Personal Details"
                  feature="settings.userManagement"
                >
                  {/* Add your school settings form here */}
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground mb-2">
                      Update your personal information, email, and profile settings
                    </div>
                    <UserProfileModal />
                  </div>
                </SettingsSection>
                <SettingsSection
                  title="Default School Settings"
                  feature="settings.defaultSchool"
                >
                  {/* Add your school settings form here */}
                  <div className="text-sm text-muted-foreground">
                    Configure your default school preferences
                  </div>
                </SettingsSection>
                <SettingsSection
                  title="PIN Management"
                  feature="settings.updatePin"
                >
                  {/* Add your PIN update form here */}
                  <div className="text-sm text-muted-foreground">
                    Update your access PIN
                  </div>
                </SettingsSection>
              </CardContent>
            </Card>
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