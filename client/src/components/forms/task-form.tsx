import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  clientName: z.string().min(1, 'Client name is required'),
  clientPhone: z.string().min(1, 'Client phone is required'),
  location: z.string().min(1, 'Location is required'),
  mapUrl: z.string().url().optional().or(z.literal('')),
  technicianId: z.number().optional(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTimeFrom: z.string().min(1, 'Start time is required'),
  scheduledTimeTo: z.string().min(1, 'End time is required'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: TaskFormData) => void;
  isLoading?: boolean;
  technicians: any[];
}

export default function TaskForm({ initialData, onSubmit, isLoading, technicians }: TaskFormProps) {
  const { t } = useLanguage();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      clientName: initialData?.clientName || '',
      clientPhone: initialData?.clientPhone || '',
      location: initialData?.location || '',
      mapUrl: initialData?.mapUrl || '',
      technicianId: initialData?.technicianId || undefined,
      scheduledDate: initialData?.scheduledDate || '',
      scheduledTimeFrom: initialData?.scheduledTimeFrom || '',
      scheduledTimeTo: initialData?.scheduledTimeTo || '',
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.title')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('task.title_placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technicianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.assign_technician' as any)}</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value === "unassigned" ? undefined : parseInt(value))}
                  value={field.value?.toString() || "unassigned"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('task.select_technician' as any)} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="unassigned">{t('task.unassigned' as any)}</SelectItem>
                    {technicians.map((tech: any) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {tech.firstName} {tech.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('task.description' as any)}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('task.description_placeholder' as any)}
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.client_name' as any)}</FormLabel>
                <FormControl>
                  <Input placeholder={t('task.client_name_placeholder' as any)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.client_phone' as any)}</FormLabel>
                <FormControl>
                  <Input placeholder={t('task.client_phone_placeholder' as any)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.location' as any)}</FormLabel>
                <FormControl>
                  <Input placeholder={t('task.location_placeholder' as any)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mapUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.map_url' as any)}</FormLabel>
                <FormControl>
                  <Input placeholder={t('task.map_url_placeholder' as any)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.scheduled_date' as any)}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTimeFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.start_time' as any)}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledTimeTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('task.end_time' as any)}</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
