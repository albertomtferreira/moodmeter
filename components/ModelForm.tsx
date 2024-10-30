import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface ModelFormProps {
  model: string;
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const formSchemas = {
  User: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'VIEWER']),
    pin: z.string().length(6, 'PIN must be 6 digits'),
  }),
  School: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    code: z.string().min(2, 'Code must be at least 2 characters'),
    color: z.string(),
    isActive: z.boolean(),
  }),
  Mood: z.object({
    type: z.enum(['HAPPY', 'OKAY', 'UNHAPPY']),
    schoolId: z.string(),
    period: z.enum(['MORNING', 'LUNCH', 'AFTERNOON', 'AFTER_SCHOOL']),
    timestamp: z.string().optional(),
  }),
};

const ModelForm: React.FC<ModelFormProps> = ({
  model,
  initialData,
  onSubmit,
  onCancel,
}) => {
  const schema = formSchemas[model as keyof typeof formSchemas];
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {},
  });

  const handleSubmit = async (data: any) => {
    try {
      // Remove timestamp from Mood data if it's a new record
      if (model === 'Mood' && !initialData) {
        delete data.timestamp;
      }

      await onSubmit(data);
      toast({
        title: 'Success',
        description: `${model} ${initialData ? 'updated' : 'created'} successfully`,
        variant: 'success'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${initialData ? 'update' : 'create'} ${model}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {Object.keys(schema.shape).map((field) => (
          // Don't render timestamp field for Mood creation/editing
          (field !== 'timestamp' || model !== 'Mood') && (
            <FormField
              key={field}
              control={form.control}
              name={field}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </FormLabel>
                  <FormControl>
                    {renderFormControl(field, formField)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        ))}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const renderFormControl = (field: string, formField: any) => {
  if (field === 'role') {
    return (
      <Select
        onValueChange={formField.onChange}
        defaultValue={formField.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
          <SelectItem value="VIEWER">Viewer</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
          <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (field === 'type') {
    return (
      <Select
        onValueChange={formField.onChange}
        defaultValue={formField.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select mood type" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
          <SelectItem value="HAPPY">Happy</SelectItem>
          <SelectItem value="OKAY">Okay</SelectItem>
          <SelectItem value="UNHAPPY">Unhappy</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (field === 'period') {
    return (
      <Select
        onValueChange={formField.onChange}
        defaultValue={formField.value}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-lg border-gray-200 min-w-[280px]">
          <SelectItem value="MORNING">Morning</SelectItem>
          <SelectItem value="LUNCH">Lunch</SelectItem>
          <SelectItem value="AFTERNOON">Afternoon</SelectItem>
          <SelectItem value="AFTER_SCHOOL">After School</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (field === 'isActive') {
    return (
      <Switch
        checked={formField.value}
        onCheckedChange={formField.onChange}
      />
    );
  }

  if (field === 'color') {
    return (
      <Input
        {...formField}
        type="color"
        className="h-10 cursor-pointer"
      />
    );
  }

  return (
    <Input {...formField} />
  );
};

export default ModelForm;