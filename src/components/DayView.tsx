
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSolarInfo, getLunarInfo, getDayActivities } from '@/utils/calendar';
import { Separator } from "@/components/ui/separator";
import { Bell, Mail } from "lucide-react";

interface DayViewProps {
  date: Date;
  onAddReminder: () => void;
}

const DayView: React.FC<DayViewProps> = ({ date, onAddReminder }) => {
  const solar = getSolarInfo(date);
  const lunar = getLunarInfo(date);
  const activities = getDayActivities(date);
  
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-calendar-red text-white p-6 rounded-b-3xl shadow-lg">
        <div className="text-center mb-4">
          <div className="text-sm opacity-80">{solar.year}年{solar.month}月</div>
          <div className="text-6xl font-bold mb-1">{solar.day}</div>
          <div className="text-sm">{weekdays[solar.weekday]}</div>
        </div>
        
        <Card className="bg-white/10 backdrop-blur-sm text-white border-0 p-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xs opacity-80">农历</div>
              <div className="text-lg font-medium">{lunar.monthInChinese}月{lunar.dayInChinese}</div>
              <div className="text-xs">{lunar.yearInChinese}年</div>
            </div>
            <div className="text-center border-l border-white/30">
              <div className="text-xs opacity-80">干支</div>
              <div className="text-lg font-medium">{lunar.dayInGanZhi}</div>
              <div className="text-xs">{lunar.yearInGanZhi}年</div>
            </div>
          </div>
          
          {lunar.jieQi && (
            <div className="mt-3 pt-3 border-t border-white/30 text-center">
              <span className="px-2 py-1 rounded-full bg-calendar-gold/30 text-xs">
                今日节气：{lunar.jieQi}
              </span>
            </div>
          )}
        </Card>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <Card className="mb-4 overflow-hidden">
          <div className="bg-calendar-lightGold px-4 py-2 font-medium">宜忌</div>
          <div className="p-4">
            <div className="mb-3">
              <div className="text-xs text-muted-foreground mb-1">宜</div>
              <div className="flex flex-wrap gap-2">
                {activities.auspicious.map((item, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">忌</div>
              <div className="flex flex-wrap gap-2">
                {activities.inauspicious.map((item, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-4">
          <div className="bg-calendar-lightGold px-4 py-2 font-medium">当日提醒</div>
          <div className="p-4 text-center text-muted-foreground">
            暂无提醒事项
          </div>
        </Card>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <Button 
          onClick={onAddReminder}
          className="w-full bg-calendar-red hover:bg-calendar-darkRed text-white"
        >
          添加提醒
        </Button>
      </div>
    </div>
  );
};

export default DayView;
