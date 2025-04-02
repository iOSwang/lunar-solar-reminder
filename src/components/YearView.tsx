
import React from 'react';
import { getMonthCalendar } from '@/utils/calendar';
import { Card } from "@/components/ui/card";

interface YearViewProps {
  year: number;
  onSelectMonth: (month: number) => void;
}

const YearView: React.FC<YearViewProps> = ({ year, onSelectMonth }) => {
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", 
                      "七月", "八月", "九月", "十月", "十一月", "十二月"];

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const days = getMonthCalendar(year, month);
        const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
        
        return (
          <Card 
            key={month}
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onSelectMonth(month)}
          >
            <div className="bg-calendar-lightGold py-2 text-center font-medium">
              {monthNames[month - 1]}
            </div>
            
            <div className="grid grid-cols-7 text-[10px] py-1">
              {weekdays.map((day, index) => (
                <div 
                  key={index} 
                  className="text-center text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-1 p-1 text-[10px]">
              {days.map((day, index) => (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center"
                >
                  {day && (
                    <span 
                      className={day.hasEvent ? "text-calendar-red font-medium" : ""}
                    >
                      {day.solar.day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default YearView;
