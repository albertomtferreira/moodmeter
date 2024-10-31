import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, StarOff } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { ContentSkeleton, TableSkeleton } from '@/components/LoadingOverlay';

interface School {
  id: string;
  name: string;
  color: string;
}

interface SchoolUser {
  school: School;
  isPreferred: boolean;
}

interface UserSchoolsProps {
  userId?: string;
}

const UserSchools = ({ userId }: UserSchoolsProps) => {
  const [schools, setSchools] = useState<SchoolUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingPreferred, setUpdatingPreferred] = useState(false);
  const { toast } = useToast();
  const { userId: clerkUserId } = useAuth();

  const effectiveUserId = userId || clerkUserId;

  useEffect(() => {
    fetchUserSchools();
  }, [effectiveUserId]);

  const fetchUserSchools = async () => {
    if (!effectiveUserId) return;

    try {
      const response = await fetch(`/api/admin/data/user/${effectiveUserId}/schools`);
      if (!response.ok) throw new Error('Failed to fetch schools');
      const data = await response.json();
      setSchools(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load schools',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetPreferred = async (schoolId: string) => {
    setUpdatingPreferred(true);
    try {
      const response = await fetch(`/api/admin/data/user/${effectiveUserId}/preferred-school`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolId }),
      });

      if (!response.ok) throw new Error('Failed to update preferred school');

      // Update local state
      setSchools(prevSchools =>
        prevSchools.map(schoolUser => ({
          ...schoolUser,
          isPreferred: schoolUser.school.id === schoolId
        }))
      );

      toast({
        title: 'Success',
        description: 'Preferred school updated successfully',
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update preferred school',
        variant: 'destructive',
      });
    }
    finally {
      setUpdatingPreferred(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <ContentSkeleton />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Schools</CardTitle>
        <CardDescription>
          Manage your school preferences and SAML settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {schools.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            No schools assigned
          </div>
        ) : updatingPreferred ? (
          <TableSkeleton rows={schools.length} />
        ) : (
          <div className="space-y-4">
            {schools
              .sort((a, b) =>
                a.school.name.toLowerCase().localeCompare(b.school.name.toLowerCase())
              )
              .map(({ school, isPreferred }) => (
                <div
                  key={school.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{
                    backgroundColor: `${school.color}10`,
                    borderColor: `${school.color}40`
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant="outline"
                      style={{
                        backgroundColor: `${school.color}20`,
                        borderColor: school.color
                      }}
                    >
                      {school.name}
                    </Badge>
                    {isPreferred && (
                      <Badge variant="secondary">
                        Preferred
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetPreferred(school.id)}
                    disabled={isPreferred}
                    className="hover:text-yellow-600"
                  >
                    {isPreferred ? (
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSchools;