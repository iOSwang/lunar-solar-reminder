
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bell, Mail } from "lucide-react";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { addReminder } from '@/utils/reminderService';

interface AddReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

const AddReminderDialog: React.FC<AddReminderDialogProps> = ({ 
  isOpen, 
  onClose,
  date 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notificationType, setNotificationType] = useState<'sms' | 'email'>('sms');
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "请输入提醒标题",
        variant: "destructive"
      });
      return;
    }
    
    // Save the reminder using our service
    addReminder({
      title,
      content,
      date,
      notificationType
    });
    
    toast({
      title: "提醒已添加",
      description: `${format(date, 'yyyy-MM-dd')} - ${title}`
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setNotificationType('sms');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加提醒 - {format(date, 'yyyy年MM月dd日')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">提醒标题</Label>
            <Input 
              id="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入提醒标题"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">提醒内容</Label>
            <Textarea 
              id="content" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入提醒内容（可选）"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>提醒方式</Label>
            <RadioGroup 
              value={notificationType}
              onValueChange={(value: 'sms' | 'email') => setNotificationType(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="flex items-center">
                  <Bell className="h-4 w-4 mr-2" />
                  短信提醒
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  邮件提醒
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" className="bg-calendar-red hover:bg-calendar-darkRed">
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;
