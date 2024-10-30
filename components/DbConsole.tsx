import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, PlusCircle, RefreshCw, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ModelForm from './ModelForm';
import ManageSchoolsDialog from './ManageSchoolsDialog';

interface DataItem {
  id: string;
  [key: string]: any;
}

const DbConsole = () => {
  const [selectedModel, setSelectedModel] = useState<keyof typeof columns>('User');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editItem, setEditItem] = useState<DataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const models = ['User', 'School', 'Mood'];
  const columns = {
    User: ['name', 'username', 'email', 'role', 'pin', 'schools'],
    School: ['name', 'code', 'color', 'isActive'],
    Mood: ['type', 'schoolId', 'period', 'timestamp'],
  };

  useEffect(() => {
    fetchData();
  }, [selectedModel]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/data/${selectedModel.toLowerCase()}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      const response = await fetch(`/api/admin/data/${selectedModel.toLowerCase()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create record');
      await fetchData();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create record',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (formData: any) => {
    try {
      if (!editItem) return;
      const response = await fetch(`/api/admin/data/${selectedModel.toLowerCase()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id: editItem.id }),
      });

      if (!response.ok) throw new Error('Failed to update record');
      await fetchData();
      setIsDialogOpen(false);
      setEditItem(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update record',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    // TODO modal to handle delete
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`/api/admin/data/${selectedModel.toLowerCase()}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete record');
      await fetchData();
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete record',
        variant: 'destructive',
      });
    }
  };

  const filteredData: DataItem[] = data.filter(item =>
    Object.entries(item).some(([key, value]) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            value={selectedModel}
            onValueChange={(value: typeof selectedModel) => setSelectedModel(value)}
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
              {models.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editItem ? 'Edit' : 'Add New'} {selectedModel}</DialogTitle>
              </DialogHeader>
              <ModelForm
                model={selectedModel}
                initialData={editItem}
                onSubmit={editItem ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditItem(null);
                }}
              />
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={fetchData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns[selectedModel].map(column => (
                <TableHead key={column}>{column}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns[selectedModel].length + 1} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns[selectedModel].length + 1} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns[selectedModel].map(column => (
                    <TableCell key={column}>
                      {renderCellContent(item[column], column)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditItem(item);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {selectedModel === 'User' && (
                        <ManageSchoolsDialog
                          userId={item.id}
                          userName={item.name}
                          currentSchools={item.schools || []}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const renderCellContent = (value: any, column: string) => {
  if (value === null || value === undefined) return '-';

  if (typeof value === 'boolean') {
    return <Badge variant={value ? "success" : "secondary"}>{value.toString()}</Badge>;
  }

  if (column === 'role') {
    return <Badge variant="outline">{value}</Badge>;
  }

  if (value instanceof Date || column === 'timestamp') {
    return new Date(value).toLocaleString();
  }

  if (column === 'pin') {
    return '••••••';
  }

  if (column === 'schools' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((schoolUser: any) => (
          <Badge
            key={schoolUser.school.id}
            variant="outline"
            className="text-xs"
            style={{
              backgroundColor: schoolUser.school.color + '20', // Add transparency
              borderColor: schoolUser.school.color
            }}
          >
            {schoolUser.school.name}
            {schoolUser.isPreferred &&
              <span className="ml-1" title="Preferred School">★</span>
            }
          </Badge>
        ))}
      </div>
    );
  }

  if (column === 'schoolId' && value.school) {
    return (
      <Badge
        variant="outline"
        style={{
          backgroundColor: value.school.color + '20',
          borderColor: value.school.color
        }}
      >
        {value.school.name}
      </Badge>
    );
  }

  return String(value);
};

export default DbConsole;