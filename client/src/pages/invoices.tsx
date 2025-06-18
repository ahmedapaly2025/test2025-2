import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useAudioNotifications } from '@/hooks/use-audio-notifications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Eye, Send, Euro, FileText, CheckCircle, Clock } from 'lucide-react';

export default function Invoices() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { playNotification } = useAudioNotifications();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [newInvoiceData, setNewInvoiceData] = useState({
    taskId: '',
    technicianId: '',
    amount: '',
  });

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['/api/invoices'],
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const { data: technicians = [] } = useQuery({
    queryKey: ['/api/technicians'],
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/invoices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      setIsNewInvoiceOpen(false);
      setNewInvoiceData({ taskId: '', technicianId: '', amount: '' });
      toast({ title: 'Success', description: 'Invoice created successfully' });
      playNotification('general');
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to create invoice',
        variant: 'destructive' 
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest('PUT', `/api/invoices/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({ title: 'Success', description: 'Invoice updated successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update invoice',
        variant: 'destructive' 
      });
    },
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'status-pending',
      sent: 'status-sent',
      paid: 'status-paid',
    };
    return colors[status as keyof typeof colors] || 'status-pending';
  };

  const getTaskInfo = (taskId: number) => {
    const task = tasks.find((t: any) => t.id === taskId);
    return task ? `${task.taskNumber} - ${task.title}` : 'Unknown Task';
  };

  const getTechnicianName = (technicianId: number) => {
    const technician = technicians.find((t: any) => t.id === technicianId);
    return technician ? `${technician.firstName} ${technician.lastName}` : 'Unknown';
  };

  const filteredInvoices = invoices.filter((invoice: any) =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTaskInfo(invoice.taskId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTechnicianName(invoice.technicianId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInvoice = () => {
    if (!newInvoiceData.taskId || !newInvoiceData.technicianId || !newInvoiceData.amount) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    createInvoiceMutation.mutate({
      taskId: parseInt(newInvoiceData.taskId),
      technicianId: parseInt(newInvoiceData.technicianId),
      amount: newInvoiceData.amount,
    });
  };

  const handleStatusChange = (invoiceId: number, newStatus: string) => {
    updateInvoiceMutation.mutate({ id: invoiceId, data: { status: newStatus } });
  };

  const completedTasks = tasks.filter((task: any) => task.status === 'completed');
  const totalRevenue = invoices
    .filter((invoice: any) => invoice.status === 'paid')
    .reduce((sum: number, invoice: any) => sum + parseFloat(invoice.amount), 0);

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
          <h1 className="text-3xl font-bold">{t('nav.invoices')}</h1>
          <p className="text-muted-foreground">Manage invoices and payments</p>
        </div>
        <Dialog open={isNewInvoiceOpen} onOpenChange={setIsNewInvoiceOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('actions.create_invoice')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="task">Task</Label>
                <Select 
                  value={newInvoiceData.taskId} 
                  onValueChange={(value) => setNewInvoiceData({...newInvoiceData, taskId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a completed task" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedTasks.map((task: any) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        {task.taskNumber} - {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="technician">Technician</Label>
                <Select 
                  value={newInvoiceData.technicianId} 
                  onValueChange={(value) => setNewInvoiceData({...newInvoiceData, technicianId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {technicians.map((tech: any) => (
                      <SelectItem key={tech.id} value={tech.id.toString()}>
                        {tech.firstName} {tech.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="amount">Amount (€)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newInvoiceData.amount}
                  onChange={(e) => setNewInvoiceData({...newInvoiceData, amount: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button 
                  onClick={handleCreateInvoice}
                  disabled={createInvoiceMutation.isPending}
                  className="flex-1"
                >
                  {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewInvoiceOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{invoices.length}</p>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">
                  {invoices.filter((i: any) => i.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">
                  {invoices.filter((i: any) => i.status === 'paid').length}
                </p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Euro className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
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
                placeholder="Search invoices..."
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
                  <TableHead>Invoice</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {t('common.no_data')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvoices.map((invoice: any) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {invoice.id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getTaskInfo(invoice.taskId)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTechnicianName(invoice.technicianId)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          €{parseFloat(invoice.amount).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border ${getStatusColor(invoice.status)}`}
                        >
                          {t(`status.${invoice.status}` as any)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(invoice.id, 'sent')}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(invoice.id, 'paid')}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
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
