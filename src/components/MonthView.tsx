
import React, { useState, useEffect } from 'react';
import { getMonthCalendar } from '@/utils/calendar';
import { Card } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [monthsToShow, setMonthsToShow] = useState<{year: number, month: number}[]>([]);
  
  // Generate the months to display when currentYear or currentMonth changes
  useEffect(() => {
    // Create an array with previous, current, and next month
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
    
    // Add another month before and after for smoother scrolling
    const prevPrevMonth = prevMonth === 1 ? 12 : prevMonth - 1;
    const prevPrevYear = prevMonth === 1 ? prevYear - 1 : prevYear;
    
    const nextNextMonth = nextMonth === 12 ? 1 : nextMonth + 1;
    const nextNextYear = nextMonth === 12 ? nextYear + 1 : nextYear;
    
    setMonthsToShow([
      { year: prevPrevYear, month: prevPrevMonth },
      { year: prevYear, month: prevMonth },
      { year: currentYear, month: currentMonth },
      { year: nextYear, month: nextMonth },
      { year: nextNextYear, month: nextNextMonth }
    ]);
  }, [currentYear, currentMonth]);
  
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
  
  // Handle scroll detection to change months
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPosition = e.currentTarget.scrollTop;
    const scrollHeight = e.currentTarget.scrollHeight;
    const clientHeight = e.currentTarget.clientHeight;
    
    // If scrolled near the top, load previous month
    if (scrollPosition < 100) {
      handlePrevMonth();
    }
    
    // If scrolled near the bottom, load next month
    if (scrollPosition + clientHeight > scrollHeight - 100) {
      handleNextMonth();
    }
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
  const renderMonthGrid = (year: number, month: number) => {
    const monthData = getMonthCalendar(year, month);
    const monthYear = `${year}年${month}月`;
    
    return (
      <div className="p-3 mb-6" key={`${year}-${month}`}>
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
            {monthData.map((day, index) => (
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

  return (
    <ScrollArea 
      className="h-full" 
      onScroll={handleScroll}
    >
      <div className="pb-8">
        {monthsToShow.map(({year, month}) => renderMonthGrid(year, month))}
      </div>
    </ScrollArea>
  );
};

export default MonthView;
