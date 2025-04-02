
import React from 'react';
import { getMonthCalendar } from '@/utils/calendar';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface MonthViewProps {
  year: number;
  month: number;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ 
  year, 
  month, 
  selectedDate,
  onSelectDate 
}) => {
  const days = getMonthCalendar(year, month);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };
  
  const isSelected = (date: Date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 bg-calendar-lightGold">
          {weekdays.map((day, index) => (
            <div 
              key={index} 
              className="py-2 text-center font-medium text-sm"
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 p-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "aspect-square p-1",
                day === null ? "pointer-events-none" : "cursor-pointer"
              )}
              onClick={() => day && onSelectDate(day.date)}
            >
              {day && (
                <div 
                  className={cn(
                    "flex flex-col items-center justify-center h-full rounded-full",
                    isToday(day.date) && "border border-calendar-red",
                    isSelected(day.date) && "bg-calendar-red text-white"
                  )}
                >
                  <div className="text-sm font-medium">{day.solar.day}</div>
                  <div className="text-[10px] opacity-80">{day.lunar.dayInChinese}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MonthView;
