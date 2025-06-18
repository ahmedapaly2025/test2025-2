import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ClipboardList, 
  Euro,
  Calendar,
  Download,
  FileSpreadsheet
} from 'lucide-react';

export default function Reports() {
  const { t } = useLanguage();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['/api/tasks'],
  });

  const { data: technicians = [], isLoading: techniciansLoading } = useQuery({
    queryKey: ['/api/technicians'],
  });

  const { data: invoices = [], isLoading: invoicesLoading } = useQuery({
    queryKey: ['/api/invoices'],
  });

  const isLoading = tasksLoading || techniciansLoading || invoicesLoading;

  // Calculate statistics
  const tasksByStatus = {
    pending: tasks.filter((t: any) => t.status === 'pending').length,
    sent: tasks.filter((t: any) => t.status === 'sent').length,
    accepted: tasks.filter((t: any) => t.status === 'accepted').length,
    rejected: tasks.filter((t: any) => t.status === 'rejected').length,
    in_progress: tasks.filter((t: any) => t.status === 'in_progress').length,
    completed: tasks.filter((t: any) => t.status === 'completed').length,
  };

  const technicianStats = technicians.map((tech: any) => {
    const techTasks = tasks.filter((t: any) => t.technicianId === tech.id);
    const completedTasks = techTasks.filter((t: any) => t.status === 'completed').length;
    const techInvoices = invoices.filter((i: any) => i.technicianId === tech.id);
    const revenue = techInvoices
      .filter((i: any) => i.status === 'paid')
      .reduce((sum: number, i: any) => sum + parseFloat(i.amount), 0);

    return {
      id: tech.id,
      name: `${tech.firstName} ${tech.lastName}`,
      totalTasks: techTasks.length,
      completedTasks,
      revenue,
      isActive: tech.isActive,
    };
  });

  // Chart data
  const statusChartData = [
    { name: 'Pending', value: tasksByStatus.pending, color: '#f59e0b' },
    { name: 'Sent', value: tasksByStatus.sent, color: '#3b82f6' },
    { name: 'Accepted', value: tasksByStatus.accepted, color: '#10b981' },
    { name: 'Rejected', value: tasksByStatus.rejected, color: '#ef4444' },
    { name: 'In Progress', value: tasksByStatus.in_progress, color: '#8b5cf6' },
    { name: 'Completed', value: tasksByStatus.completed, color: '#059669' },
  ].filter(item => item.value > 0);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthTasks = tasks.filter((task: any) => {
      const taskDate = new Date(task.createdAt);
      return taskDate.getMonth() === date.getMonth() && 
             taskDate.getFullYear() === date.getFullYear();
    }).length;

    const monthRevenue = invoices
      .filter((invoice: any) => {
        const invoiceDate = new Date(invoice.createdAt);
        return invoiceDate.getMonth() === date.getMonth() && 
               invoiceDate.getFullYear() === date.getFullYear() &&
               invoice.status === 'paid';
      })
      .reduce((sum: number, invoice: any) => sum + parseFloat(invoice.amount), 0);

    return {
      month: date.toLocaleDateString('en', { month: 'short' }),
      tasks: monthTasks,
      revenue: monthRevenue,
    };
  }).reverse();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const totalRevenue = invoices
    .filter((i: any) => i.status === 'paid')
    .reduce((sum: number, i: any) => sum + parseFloat(i.amount), 0);

  const avgTasksPerTechnician = technicians.length > 0 
    ? Math.round(tasks.length / technicians.length * 100) / 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.reports')}</h1>
          <p className="text-muted-foreground">Analytics and insights for your business</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{tasks.length}</p>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{technicians.length}</p>
                <p className="text-sm text-muted-foreground">Technicians</p>
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold">{avgTasksPerTechnician}</p>
                <p className="text-sm text-muted-foreground">Avg Tasks/Tech</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Tasks Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Tasks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Technician Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Technician Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Technician</TableHead>
                  <TableHead>Total Tasks</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {technicianStats.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No technician data available
                    </TableCell>
                  </TableRow>
                ) : (
                  technicianStats
                    .sort((a, b) => b.completedTasks - a.completedTasks)
                    .map((tech) => {
                      const successRate = tech.totalTasks > 0 
                        ? Math.round((tech.completedTasks / tech.totalTasks) * 100) 
                        : 0;
                      
                      return (
                        <TableRow key={tech.id}>
                          <TableCell className="font-medium">{tech.name}</TableCell>
                          <TableCell>{tech.totalTasks}</TableCell>
                          <TableCell>{tech.completedTasks}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-12 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-emerald-500 h-2 rounded-full"
                                  style={{ width: `${successRate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{successRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell>€{tech.revenue.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={tech.isActive ? "default" : "secondary"}>
                              {tech.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
