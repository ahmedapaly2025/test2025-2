import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTechnicianSchema, 
  insertTaskSchema, 
  insertInvoiceSchema, 
  insertBotSettingsSchema,
  insertNotificationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    // Simple auth check - in production, use proper JWT or session management
    const auth = req.headers.authorization;
    if (!auth || auth !== 'Bearer admin') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // In production, return a proper JWT token
      res.json({ 
        user: { id: user.id, username: user.username, role: user.role },
        token: 'admin' // Simple token for demo
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      const technicians = await storage.getTechnicians();
      const invoices = await storage.getInvoices();
      
      const activeTasks = tasks.filter(task => ['sent', 'accepted', 'in_progress'].includes(task.status)).length;
      const activeTechnicians = technicians.filter(tech => tech.isActive).length;
      const pendingInvoices = invoices.filter(invoice => invoice.status === 'pending').length;
      const monthlyRevenue = invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);

      res.json({
        activeTasks,
        totalTechnicians: technicians.length,
        activeTechnicians,
        pendingInvoices,
        monthlyRevenue
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Technicians routes
  app.get("/api/technicians", requireAuth, async (req, res) => {
    try {
      const technicians = await storage.getTechnicians();
      res.json(technicians);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/technicians", requireAuth, async (req, res) => {
    try {
      const result = insertTechnicianSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid data', errors: result.error.errors });
      }

      const technician = await storage.createTechnician(result.data);
      
      // Create notification
      await storage.createNotification({
        type: 'technician_added',
        message: `New technician ${technician.firstName} ${technician.lastName} added`
      });

      res.status(201).json(technician);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/technicians/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const technician = await storage.updateTechnician(id, req.body);
      
      if (!technician) {
        return res.status(404).json({ message: 'Technician not found' });
      }

      res.json(technician);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete("/api/technicians/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTechnician(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Technician not found' });
      }

      res.json({ message: 'Technician deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Tasks routes
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/tasks", requireAuth, async (req, res) => {
    try {
      const result = insertTaskSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid data', errors: result.error.errors });
      }

      const task = await storage.createTask(result.data);
      
      // Create notification
      await storage.createNotification({
        type: 'task_created',
        message: `New task ${task.taskNumber} created: ${task.title}`
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Create notification for status changes
      if (req.body.status) {
        await storage.createNotification({
          type: 'task_status_changed',
          message: `Task ${task.taskNumber} status changed to ${req.body.status}`
        });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete("/api/tasks/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Invoices routes
  app.get("/api/invoices", requireAuth, async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post("/api/invoices", requireAuth, async (req, res) => {
    try {
      const result = insertInvoiceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid data', errors: result.error.errors });
      }

      const invoice = await storage.createInvoice(result.data);
      
      // Create notification
      await storage.createNotification({
        type: 'invoice_created',
        message: `New invoice ${invoice.invoiceNumber} created`
      });

      res.status(201).json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/invoices/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.updateInvoice(id, req.body);
      
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Bot settings routes
  app.get("/api/bot-settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getBotSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/bot-settings", requireAuth, async (req, res) => {
    try {
      const result = insertBotSettingsSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid data', errors: result.error.errors });
      }

      const settings = await storage.updateBotSettings(result.data);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Notifications routes
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/notifications/unread", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getUnreadNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markNotificationAsRead(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
