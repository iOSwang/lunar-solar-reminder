
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSolarInfo, getLunarInfo, getDayActivities } from '@/utils/calendar';
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Clock, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRemindersForDate, deleteReminder, Reminder } from '@/utils/reminderService';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

interface DayViewProps {
  date: Date;
  onAddReminder: () => void;
}

const DayView: React.FC<DayViewProps> = ({ date, onAddReminder }) => {
  const solar = getSolarInfo(date);
  const lunar = getLunarInfo(date);
  const activities = getDayActivities(date);
  const reminders = getRemindersForDate(date);
  const { toast } = useToast();
  
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  const handleDeleteReminder = (reminder: Reminder) => {
    if (deleteReminder(reminder.id)) {
      toast({
        title: "提醒已删除",
        description: reminder.title,
      });
      // Force rerender
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <div className="bg-calendar-red text-white px-4 py-4 rounded-b-2xl shadow-md mb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">{solar.year}年{solar.month}月{solar.day}日 {solar.hour.toString().padStart(2, '0')}:{solar.minute.toString().padStart(2, '0')}</div>
              <div className="text-xl font-bold">{weekdays[solar.weekday]} ({lunar.timeInGanZhi.timeName}时)</div>
            </div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm text-white border-0 p-3 mt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs opacity-80">农历</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-medium">{lunar.monthInChinese}月{lunar.dayInChinese}</span>
                  <span className="text-xs">({lunar.yearInChinese}年)</span>
                </div>
              </div>
              <div className="border-l border-white/30 pl-3">
                <div className="text-xs opacity-80">天干地支</div>
                <div className="text-xs">
                  <div>日: {lunar.dayInGanZhi}</div>
                  <div>时: {lunar.timeInGanZhi.ganZhi}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="px-4 pb-4 space-y-4">
          <Card className="shadow-sm">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              干支信息
            </div>
            <div className="p-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-medium">年干支:</div>
                <div>{lunar.yearInGanZhi}</div>
              </div>
              <div>
                <div className="font-medium">月干支:</div>
                <div>{lunar.monthInGanZhi}</div>
              </div>
              <div>
                <div className="font-medium">日干支:</div>
                <div>{lunar.dayInGanZhi}</div>
              </div>
              <div>
                <div className="font-medium">时干支:</div>
                <div>{lunar.timeInGanZhi.ganZhi}</div>
              </div>
              <div className="col-span-2">
                <div className="font-medium">当前时辰:</div>
                <div>{lunar.timeInGanZhi.timeName} ({lunar.timeInGanZhi.hourRange})</div>
              </div>
            </div>
          </Card>
          
          {lunar.jieQi && (
            <Card className="shadow-sm">
              <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">节气</div>
              <div className="p-3 flex items-center justify-center">
                <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm">
                  {lunar.jieQi}
                </span>
              </div>
            </Card>
          )}

          <Card className="shadow-sm">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">宜忌</div>
            <div className="p-3">
              <div className="mb-3">
                <div className="text-xs text-muted-foreground mb-2">宜</div>
                <div className="flex flex-wrap gap-2">
                  {activities.auspicious.map((item, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">忌</div>
                <div className="flex flex-wrap gap-2">
                  {activities.inauspicious.map((item, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Festival information */}
          {(lunar.festivals.solar.length > 0 || 
            lunar.festivals.lunar.length > 0 || 
            lunar.festivals.other.length > 0) && (
            <Card className="shadow-sm">
              <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">节日</div>
              <div className="p-3">
                <div className="flex flex-wrap gap-2">
                  {lunar.festivals.solar.map((festival, index) => (
                    <span key={`solar-${index}`} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                  {lunar.festivals.lunar.map((festival, index) => (
                    <span key={`lunar-${index}`} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                  {lunar.festivals.other.map((festival, index) => (
                    <span key={`other-${index}`} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Card className="shadow-sm">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm flex items-center justify-between">
              <span>当日提醒</span>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={onAddReminder}>
                添加
              </Button>
            </div>
            <div className="p-3">
              {reminders.length > 0 ? (
                <div className="space-y-2">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="bg-slate-50 p-3 rounded-lg flex justify-between items-start">
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
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(reminder.createdAt), 'MM-dd HH:mm')} 创建
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
                <div className="text-center text-muted-foreground text-sm py-3">
                  暂无提醒事项
                </div>
              )}
            </div>
          </Card>
        </div>
        
        <div className="p-4 border-t mt-auto">
          <Button 
            onClick={onAddReminder}
            className="w-full bg-calendar-red hover:bg-calendar-darkRed text-white"
          >
            添加提醒
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};

export default DayView;
