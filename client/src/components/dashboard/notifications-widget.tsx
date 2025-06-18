import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, UserPlus, AlertTriangle, Clock } from 'lucide-react';

export default function NotificationsWidget() {
  const { t } = useLanguage();
  
  const { data: notifications = [] } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const getNotificationIcon = (type: string) => {
    const icons = {
      task_created: Clock,
      task_accepted: CheckCircle,
      task_rejected: AlertTriangle,
      task_completed: CheckCircle,
      technician_added: UserPlus,
      invoice_created: CheckCircle,
    };
    return icons[type as keyof typeof icons] || Clock;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      task_created: 'text-blue-500',
      task_accepted: 'text-emerald-500',
      task_rejected: 'text-red-500',
      task_completed: 'text-emerald-500',
      technician_added: 'text-blue-500',
      invoice_created: 'text-amber-500',
    };
    return colors[type as keyof typeof colors] || 'text-blue-500';
  };

  const getBorderColor = (type: string) => {
    const colors = {
      task_created: 'border-l-blue-500',
      task_accepted: 'border-l-emerald-500',
      task_rejected: 'border-l-red-500',
      task_completed: 'border-l-emerald-500',
      technician_added: 'border-l-blue-500',
      invoice_created: 'border-l-amber-500',
    };
    return colors[type as keyof typeof colors] || 'border-l-blue-500';
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.notifications')}</CardTitle>
      </CardHeader>
      <CardContent>
        {recentNotifications.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>No new notifications</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="space-y-3">
              {recentNotifications.map((notification: any) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 bg-muted/30 rounded-lg border-l-4 ${getBorderColor(notification.type)}`}
                  >
                    <Icon className={`h-4 w-4 mt-1 ${getNotificationColor(notification.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
