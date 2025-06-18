import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

const technicianSchema = z.object({
  telegramId: z.string().min(1, 'Telegram ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

interface TechnicianFormProps {
  initialData?: any;
  onSubmit: (data: TechnicianFormData) => void;
  isLoading?: boolean;
}

export default function TechnicianForm({ initialData, onSubmit, isLoading }: TechnicianFormProps) {
  const { t } = useLanguage();

  const form = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      telegramId: initialData?.telegramId || '',
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      username: initialData?.username || '',
      phoneNumber: initialData?.phoneNumber || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  const handleSubmit = (data: TechnicianFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telegramId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Telegram user ID" {...field} />
                </FormControl>
                <FormDescription>
                  The unique Telegram user ID (numeric)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telegram Username</FormLabel>
                <FormControl>
                  <Input placeholder="@username (optional)" {...field} />
                </FormControl>
                <FormDescription>
                  Telegram username without @ symbol
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number (optional)" {...field} />
              </FormControl>
              <FormDescription>
                Contact phone number for the technician
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Enable or disable this technician for task assignments
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center space-x-4 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('common.save')}
          </Button>
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
