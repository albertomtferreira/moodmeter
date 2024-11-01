import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { School } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from '@/store/useAppStore';
import { LoadingOverlay } from '@/components/LoadingOverlay';

interface ManageSchoolsDialogProps {
  userId: string;
  userName: string;
  currentSchools: any[];
}

const ManageSchoolsDialog = ({ userId, userName, currentSchools }: ManageSchoolsDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [preferredSchool, setPreferredSchool] = useState<string>('');
  const { setLoading } = useAppStore();
  const { toast } = useToast();

  // Fetch all available schools
  useEffect(() => {
    const fetchSchools = async () => {
      setLoading({
        isLoading: true,
        message: 'Loading available schools...',
        type: 'content'
      });

      try {
        const response = await fetch('/api/admin/data/school');
        if (!response.ok) throw new Error('Failed to fetch schools');
        const data = await response.json();
        setSchools(data);

        // Set initial selections based on current schools
        const initialSelected = new Set(currentSchools.map(s => s.school.id));
        setSelectedSchools(initialSelected);
        const preferred = currentSchools.find(s => s.isPreferred);
        if (preferred) setPreferredSchool(preferred.school.id);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch schools',
          variant: 'destructive',
        });
      } finally {
        setLoading({
          isLoading: false
        });
      }
    };

    if (isOpen) {
      fetchSchools();
    }
  }, [isOpen, currentSchools, setLoading]);

  const handleSubmit = async () => {
    setLoading({
      isLoading: true,
      message: 'Updating school assignments...',
      type: 'form'
    });

    try {
      const response = await fetch(`/api/admin/users/${userId}/schools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolIds: Array.from(selectedSchools),
          preferredSchoolId: preferredSchool
        }),
      });

      if (!response.ok) throw new Error('Failed to update schools');

      toast({
        title: 'Success',
        description: 'Schools updated successfully',
        variant: 'success',
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schools',
        variant: 'destructive',
      });
    } finally {
      setLoading({
        isLoading: false
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Manage Schools">
          <School className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Schools for {userName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-4">
            <Label>Select Schools</Label>
            {schools.map((school) => (
              <div key={school.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedSchools.has(school.id)}
                  onCheckedChange={(checked) => {
                    const newSelected = new Set(selectedSchools);
                    if (checked) {
                      newSelected.add(school.id);
                    } else {
                      newSelected.delete(school.id);
                      if (preferredSchool === school.id) {
                        setPreferredSchool('');
                      }
                    }
                    setSelectedSchools(newSelected);
                  }}
                />
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: school.color + '20',
                    borderColor: school.color
                  }}
                >
                  {school.name}
                </Badge>
              </div>
            ))}
          </div>

          {selectedSchools.size > 0 && (
            <div className="space-y-4">
              <Label>Preferred School</Label>
              <RadioGroup
                value={preferredSchool}
                onValueChange={setPreferredSchool}
              >
                {schools
                  .filter(school => selectedSchools.has(school.id))
                  .map((school) => (
                    <div key={school.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={school.id} id={school.id} />
                      <Label htmlFor={school.id}>
                        <Badge
                          variant="outline"
                          style={{
                            backgroundColor: school.color + '20',
                            borderColor: school.color
                          }}
                        >
                          {school.name}
                        </Badge>
                      </Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={useAppStore(state => state.loading.isLoading)}
            >
              Save Changes
            </Button>
          </div>
        </div>
        <LoadingOverlay />
      </DialogContent>
    </Dialog>
  );
};

export default ManageSchoolsDialog;