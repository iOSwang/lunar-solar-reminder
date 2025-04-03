
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getUserProfile, updateUserProfile } from '@/utils/userService';
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, Save, Trash2, Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllReminders, deleteReminder, Reminder } from '@/utils/reminderService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Profile = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user profile
    const profile = getUserProfile();
    setPhone(profile.phone);
    setEmail(profile.email);
    
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

  const handleSaveProfile = () => {
    updateUserProfile({
      phone,
      email
    });
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
    <div className="flex flex-col h-full">
      <Header title="我的" onBack={() => navigate('/')} />
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col min-h-full p-4">
          <div className="pb-4 flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-calendar-red flex items-center justify-center text-white">
              <User size={40} />
            </div>
          </div>
          
          <Card className="mb-4">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">提醒方式</div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  提醒号码
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号码"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  提醒邮箱
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入电子邮箱"
                  type="email"
                />
              </div>
              
              <Button 
                onClick={handleSaveProfile}
                className="w-full bg-calendar-red hover:bg-calendar-darkRed text-white"
              >
                <Save className="h-4 w-4 mr-1" />
                保存个人信息
              </Button>
            </div>
          </Card>
          
          <Card>
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">所有提醒</div>
            <div className="p-3">
              {reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="bg-slate-50 p-2 rounded flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{reminder.title}</span>
                          {reminder.notificationType === 'sms' ? (
                            <Bell className="h-3 w-3 text-amber-500" />
                          ) : (
                            <Mail className="h-3 w-3 text-blue-500" />
                          )}
                        </div>
                        {reminder.content && (
                          <div className="text-xs text-muted-foreground mt-1">{reminder.content}</div>
                        )}
                        <div className="text-xs text-muted-foreground mt-0.5 flex justify-between">
                          <span>{formatReminderDate(reminder.date)}</span>
                          <span>{format(new Date(reminder.createdAt), 'MM-dd HH:mm')} 创建</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => handleDeleteReminder(reminder)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm py-4">
                  暂无提醒事项
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Profile;
