import { 
  users, technicians, tasks, invoices, botSettings, notifications,
  type User, type InsertUser,
  type Technician, type InsertTechnician,
  type Task, type InsertTask,
  type Invoice, type InsertInvoice,
  type BotSettings, type InsertBotSettings,
  type Notification, type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Technicians
  getTechnicians(): Promise<Technician[]>;
  getTechnician(id: number): Promise<Technician | undefined>;
  getTechnicianByTelegramId(telegramId: string): Promise<Technician | undefined>;
  createTechnician(technician: InsertTechnician): Promise<Technician>;
  updateTechnician(id: number, technician: Partial<Technician>): Promise<Technician | undefined>;
  deleteTechnician(id: number): Promise<boolean>;

  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  getTasksByTechnician(technicianId: number): Promise<Task[]>;
  getTasksByStatus(status: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Invoices
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  getInvoicesByTechnician(technicianId: number): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  deleteInvoice(id: number): Promise<boolean>;

  // Bot Settings
  getBotSettings(): Promise<BotSettings | undefined>;
  updateBotSettings(settings: InsertBotSettings): Promise<BotSettings>;

  // Notifications
  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<boolean>;
  getUnreadNotifications(): Promise<Notification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private technicians: Map<number, Technician>;
  private tasks: Map<number, Task>;
  private invoices: Map<number, Invoice>;
  private botSettings: BotSettings | undefined;
  private notifications: Map<number, Notification>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.technicians = new Map();
    this.tasks = new Map();
    this.invoices = new Map();
    this.notifications = new Map();
    this.currentId = 1;

    // Initialize with default admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "admin123", // In production, this should be hashed
      role: "admin",
      createdAt: new Date(),
    });
    this.currentId = 2;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || 'admin',
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Technicians
  async getTechnicians(): Promise<Technician[]> {
    return Array.from(this.technicians.values());
  }

  async getTechnician(id: number): Promise<Technician | undefined> {
    return this.technicians.get(id);
  }

  async getTechnicianByTelegramId(telegramId: string): Promise<Technician | undefined> {
    return Array.from(this.technicians.values()).find(tech => tech.telegramId === telegramId);
  }

  async createTechnician(insertTechnician: InsertTechnician): Promise<Technician> {
    const id = this.currentId++;
    const technician: Technician = { 
      ...insertTechnician, 
      id, 
      joinedAt: new Date() 
    };
    this.technicians.set(id, technician);
    return technician;
  }

  async updateTechnician(id: number, update: Partial<Technician>): Promise<Technician | undefined> {
    const technician = this.technicians.get(id);
    if (!technician) return undefined;
    
    const updated = { ...technician, ...update };
    this.technicians.set(id, updated);
    return updated;
  }

  async deleteTechnician(id: number): Promise<boolean> {
    return this.technicians.delete(id);
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByTechnician(technicianId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.technicianId === technicianId);
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.status === status);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const taskNumber = `TK-${String(id).padStart(6, '0')}`;
    const task: Task = { 
      ...insertTask, 
      id, 
      taskNumber,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, update: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updated = { ...task, ...update, updatedAt: new Date() };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Invoices
  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoicesByTechnician(technicianId: number): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(invoice => invoice.technicianId === technicianId);
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    const id = this.currentId++;
    const invoiceNumber = `INV-${String(id).padStart(6, '0')}`;
    const invoice: Invoice = { 
      ...insertInvoice, 
      id, 
      invoiceNumber,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.invoices.set(id, invoice);
    return invoice;
  }

  async updateInvoice(id: number, update: Partial<Invoice>): Promise<Invoice | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updated = { ...invoice, ...update, updatedAt: new Date() };
    this.invoices.set(id, updated);
    return updated;
  }

  async deleteInvoice(id: number): Promise<boolean> {
    return this.invoices.delete(id);
  }

  // Bot Settings
  async getBotSettings(): Promise<BotSettings | undefined> {
    return this.botSettings;
  }

  async updateBotSettings(settings: InsertBotSettings): Promise<BotSettings> {
    const botSettings: BotSettings = {
      id: 1,
      ...settings,
      updatedAt: new Date()
    };
    this.botSettings = botSettings;
    return botSettings;
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.currentId++;
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      isRead: false,
      createdAt: new Date() 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    this.notifications.set(id, { ...notification, isRead: true });
    return true;
  }

  async getUnreadNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => !notification.isRead)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
