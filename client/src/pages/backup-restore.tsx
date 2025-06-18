import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Download, 
  Upload, 
  Database, 
  Shield, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  RefreshCw,
  Trash2
} from 'lucide-react';

interface BackupRecord {
  id: string;
  name: string;
  createdAt: string;
  size: string;
  type: 'automatic' | 'manual';
  status: 'completed' | 'failed' | 'in_progress';
  description: string;
}

export default function BackupRestore() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  // Mock backup data - في التطبيق الحقيقي، هذا سيأتي من API
  const mockBackups: BackupRecord[] = [
    {
      id: '1',
      name: 'Daily_Backup_2025-06-18',
      createdAt: '2025-06-18T02:00:00Z',
      size: '2.4 MB',
      type: 'automatic',
      status: 'completed',
      description: 'Automatic daily backup including all data'
    },
    {
      id: '2',
      name: 'Manual_Backup_Pre_Update',
      createdAt: '2025-06-17T14:30:00Z',
      size: '2.3 MB',
      type: 'manual',
      status: 'completed',
      description: 'Manual backup before system update'
    },
    {
      id: '3',
      name: 'Weekly_Backup_2025-06-15',
      createdAt: '2025-06-15T03:00:00Z',
      size: '2.1 MB',
      type: 'automatic',
      status: 'completed',
      description: 'Weekly comprehensive backup'
    }
  ];

  const { data: systemStats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const createBackupMutation = useMutation({
    mutationFn: async (backupName: string) => {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      // Simulate backup progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setBackupProgress(i);
      }
      
      setIsBackingUp(false);
      return { success: true };
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Backup created successfully' });
      setIsBackupDialogOpen(false);
      setBackupProgress(0);
    },
    onError: (error: any) => {
      setIsBackingUp(false);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to create backup',
        variant: 'destructive' 
      });
    },
  });

  const handleCreateBackup = () => {
    const backupName = `Manual_Backup_${new Date().toISOString().split('T')[0]}`;
    createBackupMutation.mutate(backupName);
  };

  const handleDownloadBackup = (backupId: string) => {
    // Simulate download
    toast({ title: 'Download Started', description: 'Backup file download initiated' });
  };

  const handleRestoreBackup = (backupId: string) => {
    toast({ 
      title: 'Restore Initiated', 
      description: 'Backup restoration process started. This may take a few minutes.' 
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-700 border-emerald-200';
      case 'failed':
        return 'bg-red-500/20 text-red-700 border-red-200';
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Backup & Restore</h1>
        <p className="text-muted-foreground">Manage system backups and data recovery</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{(systemStats as any)?.totalTechnicians || 0}</p>
                <p className="text-sm text-muted-foreground">Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{(systemStats as any)?.activeTasks || 0}</p>
                <p className="text-sm text-muted-foreground">Active Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockBackups.length}</p>
                <p className="text-sm text-muted-foreground">Available Backups</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">Daily</p>
                <p className="text-sm text-muted-foreground">Backup Schedule</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Create Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Create a manual backup of all system data including tasks, technicians, and settings.
            </p>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Backups include all sensitive data. Store securely and follow data protection guidelines.
              </AlertDescription>
            </Alert>

            <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create System Backup</DialogTitle>
                  <DialogDescription>
                    This will create a complete backup of all system data.
                  </DialogDescription>
                </DialogHeader>
                
                {isBackingUp ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Creating backup... {backupProgress}%
                      </p>
                      <Progress value={backupProgress} className="w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Backup will include:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• All technician records</li>
                        <li>• Task history and data</li>
                        <li>• Invoice records</li>
                        <li>• Bot settings and configuration</li>
                        <li>• System notifications</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleCreateBackup} disabled={createBackupMutation.isPending}>
                        {createBackupMutation.isPending ? 'Creating...' : 'Create Backup'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsBackupDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Restore from Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Restore system data from a previous backup. This will replace current data.
            </p>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Warning: Restoring will overwrite all current data. Create a backup first.
              </AlertDescription>
            </Alert>

            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Backup File
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Backup History</span>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBackups.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No backups available
                    </TableCell>
                  </TableRow>
                ) : (
                  mockBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{backup.name}</p>
                          <p className="text-sm text-muted-foreground">{backup.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={backup.type === 'automatic' ? 'default' : 'secondary'}>
                          {backup.type === 'automatic' ? 'Auto' : 'Manual'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {new Date(backup.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(backup.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{backup.size}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(backup.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(backup.status)}
                            <span className="capitalize">{backup.status.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadBackup(backup.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRestoreBackup(backup.id)}
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
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
        </CardContent>
      </Card>
    </div>
  );
}