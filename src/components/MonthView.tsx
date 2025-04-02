
import React, { useState } from 'react';
import { getMonthCalendar } from '@/utils/calendar';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  const [currentYear, setCurrentYear] = useState(year);
  const [currentMonth, setCurrentMonth] = useState(month);
  
  // Generate data for previous, current, and next months
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  
  const prevMonthData = getMonthCalendar(prevYear, prevMonth);
  const currentMonthData = getMonthCalendar(currentYear, currentMonth);
  const nextMonthData = getMonthCalendar(nextYear, nextMonth);
  
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
  
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Render a month calendar grid
  const renderMonthGrid = (days: any[], monthYear: string) => (
    <div className="p-3">
      <div className="text-center text-muted-foreground text-sm mb-2">{monthYear}</div>
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

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center items-center py-2">
        <button 
          onClick={handlePrevMonth} 
          className="p-2 text-muted-foreground hover:text-calendar-red focus:outline-none"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="space-y-8 pb-8">
          {renderMonthGrid(
            prevMonthData, 
            `${prevYear}年${prevMonth}月`
          )}
          
          {renderMonthGrid(
            currentMonthData, 
            `${currentYear}年${currentMonth}月`
          )}
          
          {renderMonthGrid(
            nextMonthData, 
            `${nextYear}年${nextMonth}月`
          )}
        </div>
      </ScrollArea>
      
      <div className="flex justify-center items-center py-2">
        <button 
          onClick={handleNextMonth} 
          className="p-2 text-muted-foreground hover:text-calendar-red focus:outline-none"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MonthView;
