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

    // Sample technicians data
    this.technicians.set(1, {
      id: 1,
      firstName: "أحمد",
      lastName: "محمد",
      username: "ahmed_tech",
      telegramId: "@ahmed_tech",
      phoneNumber: "+966501234567",
      isActive: true,
      joinedAt: new Date(),
    });

    this.technicians.set(2, {
      id: 2,
      firstName: "محمد",
      lastName: "علي",
      username: "mohammed_fix",
      telegramId: "@mohammed_fix",
      phoneNumber: "+966507654321",
      isActive: true,
      joinedAt: new Date(),
    });

    this.technicians.set(3, {
      id: 3,
      firstName: "خالد",
      lastName: "السعد",
      username: "khalid_repair",
      telegramId: "@khalid_repair",
      phoneNumber: "+966509876543",
      isActive: false,
      joinedAt: new Date(),
    });

    // Sample tasks data
    this.tasks.set(1, {
      id: 1,
      taskNumber: "T-2024-001",
      title: "إصلاح تكييف مركزي",
      description: "إصلاح وحدة التكييف المركزي في المكتب الرئيسي - مشكلة في ضاغط الهواء",
      clientName: "شركة الأعمال المتقدمة",
      clientPhone: "+966501111111",
      location: "الرياض - حي العليا - مجمع الأعمال",
      mapUrl: "https://maps.google.com/?q=24.7136,46.6753",
      technicianId: 1,
      status: "in_progress",
      scheduledDate: "2024-06-19",
      scheduledTimeFrom: "09:00",
      scheduledTimeTo: "12:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.tasks.set(2, {
      id: 2,
      taskNumber: "T-2024-002",
      title: "صيانة نظام تبريد",
      description: "صيانة دورية لنظام التبريد في المستودع الرئيسي",
      clientName: "مؤسسة التجارة الشاملة",
      clientPhone: "+966502222222",
      location: "جدة - حي الروضة - شارع الأمير سلطان",
      mapUrl: "https://maps.google.com/?q=21.5433,39.1728",
      technicianId: 2,
      status: "completed",
      scheduledDate: "2024-06-18",
      scheduledTimeFrom: "14:00",
      scheduledTimeTo: "17:00",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
    });

    this.tasks.set(3, {
      id: 3,
      taskNumber: "T-2024-003",
      title: "تركيب وحدة تكييف جديدة",
      description: "تركيب وحدة تكييف سبليت في المكتب الإداري",
      clientName: "مكتب الاستشارات الهندسية",
      clientPhone: "+966503333333",
      location: "الدمام - حي الفيصلية - مجمع المكاتب",
      mapUrl: "https://maps.google.com/?q=26.3927,50.0410",
      technicianId: null,
      status: "pending",
      scheduledDate: "2024-06-20",
      scheduledTimeFrom: "10:00",
      scheduledTimeTo: "15:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.tasks.set(4, {
      id: 4,
      taskNumber: "T-2024-004",
      title: "إصلاح عطل كهربائي",
      description: "إصلاح عطل في الدائرة الكهربائية لوحدة التكييف",
      clientName: "مطعم الأصالة",
      clientPhone: "+966504444444",
      location: "الخبر - الكورنيش - بجانب مارينا مول",
      mapUrl: "https://maps.google.com/?q=26.2172,50.1971",
      technicianId: 1,
      status: "sent",
      scheduledDate: "2024-06-19",
      scheduledTimeFrom: "16:00",
      scheduledTimeTo: "18:00",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample invoices data
    this.invoices.set(1, {
      id: 1,
      invoiceNumber: "INV-2024-001",
      taskId: 2,
      technicianId: 2,
      amount: "450.00",
      status: "paid",
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(),
    });

    this.invoices.set(2, {
      id: 2,
      invoiceNumber: "INV-2024-002",
      taskId: 1,
      technicianId: 1,
      amount: "1300.00",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.invoices.set(3, {
      id: 3,
      invoiceNumber: "INV-2024-003",
      taskId: 4,
      technicianId: 1,
      amount: "275.00",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample notifications
    this.notifications.set(1, {
      id: 1,
      message: "تم تعيين مهمة جديدة: إصلاح تكييف مركزي",
      type: "task_assigned",
      isRead: false,
      createdAt: new Date(),
    });

    this.notifications.set(2, {
      id: 2,
      message: "تم دفع فاتورة رقم INV-2024-001 بمبلغ 450 ريال",
      type: "payment_received",
      isRead: false,
      createdAt: new Date(Date.now() - 3600000),
    });

    this.notifications.set(3, {
      id: 3,
      message: "تم إكمال مهمة صيانة نظام التبريد بنجاح",
      type: "task_completed",
      isRead: true,
      createdAt: new Date(Date.now() - 7200000),
    });

    // Bot settings
    this.botSettings = {
      id: 1,
      botToken: "",
      isActive: false,
      googleMapsApiKey: null,
      updatedAt: new Date(),
    };

    this.currentId = 10;
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
      lastName: insertTechnician.lastName || null,
      username: insertTechnician.username || null,
      phoneNumber: insertTechnician.phoneNumber || null,
      isActive: insertTechnician.isActive || true,
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
      mapUrl: insertTask.mapUrl || null,
      technicianId: insertTask.technicianId || null,
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
      isActive: settings.isActive || false,
      googleMapsApiKey: settings.googleMapsApiKey || null,
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
