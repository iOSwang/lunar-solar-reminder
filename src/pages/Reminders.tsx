import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllReminders, deleteReminder, Reminder } from '@/utils/reminderService';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Trash2, Calendar } from "lucide-react";
import { Link } from 'react-router-dom';

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load all reminders
    loadReminders();
    
    // Listen for changes to reminders
    window.addEventListener('storage', loadReminders);
    
    return () => {
      window.removeEventListener('storage', loadReminders);
    };
  }, []);
  
  const loadReminders = () => {
    setReminders(getAllReminders());
  };
  
  const handleDeleteReminder = (reminder: Reminder) => {
    if (deleteReminder(reminder.id)) {
      toast({
        title: "提醒已删除",
        description: reminder.title,
      });
      loadReminders();
    }
  };
  
  const formatReminderDate = (date: Date) => {
    const now = new Date();
    const reminderDate = new Date(date);
    
    // If same day, just show time
    if (
      reminderDate.getDate() === now.getDate() &&
      reminderDate.getMonth() === now.getMonth() &&
      reminderDate.getFullYear() === now.getFullYear()
    ) {
      return '今天';
    }
    
    // If same year, show month and day
    if (reminderDate.getFullYear() === now.getFullYear()) {
      return format(reminderDate, 'MM月dd日');
    }
    
    // Otherwise, show year, month and day
    return format(reminderDate, 'yyyy年MM月dd日');
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <div className="bg-calendar-lightGold p-3 border-b sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-lg font-medium">所有提醒</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <Calendar className="h-4 w-4 mr-1" />
              返回日历
            </Link>
          </Button>
        </div>
        
        <div className="p-3">
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className="overflow-hidden">
                  <div className="bg-calendar-red text-white text-xs px-3 py-1 flex justify-between">
                    <span>{formatReminderDate(reminder.date)}</span>
                    <span>{format(new Date(reminder.createdAt), 'MM-dd HH:mm')}</span>
                  </div>
                  <div className="p-3 flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{reminder.title}</span>
                        {reminder.notificationType === 'sms' ? (
                          <Bell className="h-3 w-3 text-amber-500" />
                        ) : (
                          <Mail className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                      {reminder.content && (
                        <div className="text-sm text-muted-foreground mt-1">{reminder.content}</div>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => handleDeleteReminder(reminder)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-10">
              暂无提醒事项
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default Reminders;
