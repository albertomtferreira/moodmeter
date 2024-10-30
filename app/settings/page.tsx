// app/settings/page.tsx
"use client"
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DbConsole from '@/components/DbConsole';


export default function SettingsPage() {
  const { canAccess, role } = usePermissions();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="user">
        <TabsList>
          <TabsTrigger value="user">User Settings</TabsTrigger>
          {canAccess('settings.deleteMoods') && (
            <TabsTrigger value="admin">Admin Settings</TabsTrigger>
          )}
          {canAccess('settings.dbConsole') && (
            <TabsTrigger value="system">System Settings</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="user">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProtectedRoute feature="settings.defaultSchool">
                {/* Default School Settings */}
                <div>
                  Default School Settings
                </div>
              </ProtectedRoute>

              <ProtectedRoute feature="settings.updatePin">
                {/* PIN Update Form */}
                <div>
                  PIN Update Form
                </div>
              </ProtectedRoute>
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
                {/* Mood Deletion Controls */}
              </CardContent>
            </Card>
          </ProtectedRoute>
        </TabsContent>

        <TabsContent value="system">
          <ProtectedRoute feature="settings.dbConsole">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* DB Console Controls */}
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
                <DbConsole />
              </CardContent>
            </Card>
          </ProtectedRoute>
        </TabsContent>
      </Tabs>
    </div>
  );
}