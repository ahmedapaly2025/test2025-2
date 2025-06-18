import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useAudioNotifications } from '@/hooks/use-audio-notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import TechnicianForm from '@/components/forms/technician-form';
import {
  Dialog,
  DialogContent,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, Phone, AtSign } from 'lucide-react';

export default function Technicians() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { playNotification } = useAudioNotifications();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewTechnicianOpen, setIsNewTechnicianOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState(null);

  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ['/api/technicians'],
  });

  const createTechnicianMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/technicians', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsNewTechnicianOpen(false);
      toast({ title: 'Success', description: 'Technician added successfully' });
      playNotification('general');
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to add technician',
        variant: 'destructive' 
      });
    },
  });

  const updateTechnicianMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/technicians/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      setEditingTechnician(null);
      toast({ title: 'Success', description: 'Technician updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update technician',
        variant: 'destructive' 
      });
    },
  });

  const deleteTechnicianMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/technicians/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/technicians'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: 'Success', description: 'Technician deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to delete technician',
        variant: 'destructive' 
      });
    },
  });

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const filteredTechnicians = technicians.filter((tech: any) =>
    tech.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.telegramId.includes(searchTerm)
  );

  const toggleTechnicianStatus = (technicianId: number, currentStatus: boolean) => {
    updateTechnicianMutation.mutate({ 
      id: technicianId, 
      data: { isActive: !currentStatus } 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
        <div className="h-64 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.technicians')}</h1>
          <p className="text-muted-foreground">Manage your team of technicians</p>
        </div>
        <Dialog open={isNewTechnicianOpen} onOpenChange={setIsNewTechnicianOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('actions.add_technician')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Technician</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <TechnicianForm
                onSubmit={(data) => createTechnicianMutation.mutate(data)}
                isLoading={createTechnicianMutation.isPending}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">
                  {technicians.filter((t: any) => t.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <UserX className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">
                  {technicians.filter((t: any) => !t.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Inactive Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Plus className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{technicians.length}</p>
                <p className="text-sm text-muted-foreground">Total Technicians</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technician</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Telegram</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTechnicians.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      {t('common.no_data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTechnicians.map((technician: any) => (
                    <TableRow key={technician.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="gradient-bg text-white">
                              {getInitials(technician.firstName, technician.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {technician.firstName} {technician.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {technician.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {technician.phoneNumber ? (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{technician.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No phone</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                              {technician.telegramId}
                            </span>
                          </div>
                          {technician.username && (
                            <div className="flex items-center space-x-1">
                              <AtSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {technician.username}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={technician.isActive ? "default" : "secondary"}
                          className={technician.isActive ? "bg-emerald-500" : ""}
                        >
                          {technician.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(technician.joinedAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleTechnicianStatus(technician.id, technician.isActive)}
                          >
                            {technician.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingTechnician(technician)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Technician</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {technician.firstName} {technician.lastName}? 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteTechnicianMutation.mutate(technician.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

      {/* Edit Technician Dialog */}
      <Dialog open={!!editingTechnician} onOpenChange={() => setEditingTechnician(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Technician</DialogTitle>
          </DialogHeader>
          {editingTechnician && (
            <TechnicianForm
              initialData={editingTechnician}
              onSubmit={(data) => updateTechnicianMutation.mutate({ 
                id: (editingTechnician as any).id, 
                data 
              })}
              isLoading={updateTechnicianMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
