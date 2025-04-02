
import { toast } from "@/hooks/use-toast";

export interface Reminder {
  id: string;
  title: string;
  content: string;
  date: Date;
  notificationType: 'sms' | 'email';
  createdAt: Date;
}

// In-memory storage, in a real app this would be a database
const STORAGE_KEY = 'calendar_reminders';

// Helper to sort reminders by creation date (newest first)
const sortReminders = (reminders: Reminder[]): Reminder[] => {
  return [...reminders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// Load reminders from localStorage
const loadReminders = (): Reminder[] => {
  try {
    const savedReminders = localStorage.getItem(STORAGE_KEY);
    if (savedReminders) {
      const parsed = JSON.parse(savedReminders);
      // Convert string dates back to Date objects
      return parsed.map((r: any) => ({
        ...r,
        date: new Date(r.date),
        createdAt: new Date(r.createdAt)
      }));
    }
  } catch (error) {
    console.error('Failed to load reminders:', error);
    toast({
      title: "读取提醒失败",
      description: "无法加载您的提醒事项",
      variant: "destructive"
    });
  }
  return [];
};

// Save reminders to localStorage
const saveReminders = (reminders: Reminder[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Failed to save reminders:', error);
    toast({
      title: "保存提醒失败",
      variant: "destructive"
    });
  }
};

// Get all reminders
export const getAllReminders = (): Reminder[] => {
  return sortReminders(loadReminders());
};

// Get reminders for a specific date
export const getRemindersForDate = (date: Date): Reminder[] => {
  const reminders = loadReminders();
  const filtered = reminders.filter(r => 
    r.date.getFullYear() === date.getFullYear() &&
    r.date.getMonth() === date.getMonth() &&
    r.date.getDate() === date.getDate()
  );
  return sortReminders(filtered);
};

// Add a new reminder
export const addReminder = (reminder: Omit<Reminder, 'id' | 'createdAt'>): Reminder => {
  const reminders = loadReminders();
  const newReminder: Reminder = {
    ...reminder,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date()
  };
  
  reminders.push(newReminder);
  saveReminders(reminders);
  
  return newReminder;
};

// Delete a reminder
export const deleteReminder = (id: string): boolean => {
  const reminders = loadReminders();
  const filteredReminders = reminders.filter(r => r.id !== id);
  
  if (filteredReminders.length !== reminders.length) {
    saveReminders(filteredReminders);
    return true;
  }
  return false;
};
