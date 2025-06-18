import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import SettingsForm from '@/components/forms/settings-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, Map, Shield, Database, Activity } from 'lucide-react';

export default function Settings() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/bot-settings'],
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest('PUT', '/api/bot-settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bot-settings'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: 'Success', description: 'Settings updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update settings',
        variant: 'destructive' 
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const isOnline = settings?.botToken && settings?.isActive;
  const hasGoogleMaps = !!settings?.googleMapsApiKey;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>
        <p className="text-muted-foreground">Configure your bot and integrations</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                <Bot className={`h-6 w-6 ${isOnline ? 'text-emerald-500' : 'text-red-500'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Bot Status</p>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${hasGoogleMaps ? 'bg-blue-500/20' : 'bg-gray-500/20'}`}>
                <Map className={`h-6 w-6 ${hasGoogleMaps ? 'text-blue-500' : 'text-gray-500'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Maps API</p>
                <Badge variant={hasGoogleMaps ? "default" : "secondary"}>
                  {hasGoogleMaps ? 'Connected' : 'Not Set'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Security</p>
                <Badge variant="default">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Activity className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">{stats?.activeTechnicians || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Telegram Bot Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Connection Status</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">{isOnline ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">API Requests (24h)</span>
              <span className="text-sm font-medium">127/1000</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Webhook Status</span>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Last Update</span>
              <span className="text-sm text-muted-foreground">
                {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>System Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Tasks</span>
              <span className="text-sm font-medium">47</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Technicians</span>
              <span className="text-sm font-medium">{stats?.activeTechnicians || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Invoices</span>
              <span className="text-sm font-medium">{stats?.pendingInvoices || 0}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">System Health</span>
              <Badge variant="default" className="bg-emerald-500">
                Excellent
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Form */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm
            initialData={settings}
            onSubmit={(data) => updateSettingsMutation.mutate(data)}
            isLoading={updateSettingsMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
