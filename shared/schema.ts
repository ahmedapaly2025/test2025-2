import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const technicians = pgTable("technicians", {
  id: serial("id").primaryKey(),
  telegramId: text("telegram_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  username: text("username"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  taskNumber: text("task_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  location: text("location").notNull(),
  mapUrl: text("map_url"),
  technicianId: integer("technician_id").references(() => technicians.id),
  status: text("status").notNull().default("pending"), // pending, sent, accepted, rejected, in_progress, completed, paid
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTimeFrom: text("scheduled_time_from").notNull(),
  scheduledTimeTo: text("scheduled_time_to").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  taskId: integer("task_id").references(() => tasks.id).notNull(),
  technicianId: integer("technician_id").references(() => technicians.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, sent, paid
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const botSettings = pgTable("bot_settings", {
  id: serial("id").primaryKey(),
  botToken: text("bot_token").notNull(),
  googleMapsApiKey: text("google_maps_api_key"),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // task_created, task_accepted, task_rejected, task_completed, etc.
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertTechnicianSchema = createInsertSchema(technicians).pick({
  telegramId: true,
  firstName: true,
  lastName: true,
  username: true,
  phoneNumber: true,
  isActive: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  clientName: true,
  clientPhone: true,
  location: true,
  mapUrl: true,
  technicianId: true,
  scheduledDate: true,
  scheduledTimeFrom: true,
  scheduledTimeTo: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).pick({
  taskId: true,
  technicianId: true,
  amount: true,
});

export const insertBotSettingsSchema = createInsertSchema(botSettings).pick({
  botToken: true,
  googleMapsApiKey: true,
  isActive: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  type: true,
  message: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Technician = typeof technicians.$inferSelect;
export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type BotSettings = typeof botSettings.$inferSelect;
export type InsertBotSettings = z.infer<typeof insertBotSettingsSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
