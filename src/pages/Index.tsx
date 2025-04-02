
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import DayView from '@/components/DayView';
import MonthView from '@/components/MonthView';
import YearView from '@/components/YearView';
import AddReminderDialog from '@/components/AddReminderDialog';

type CalendarView = 'day' | 'month' | 'year';

const Index = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<CalendarView>('day');
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  const handleBackClick = () => {
    if (view === 'day') {
      setView('month');
    } else if (view === 'month') {
      setView('year');
    }
  };

  const getHeaderTitle = () => {
    switch (view) {
      case 'day':
        return '今日';
      case 'month':
        return `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月`;
      case 'year':
        return `${selectedDate.getFullYear()}年`;
      default:
        return '';
    }
  };

  const handleAddReminder = () => {
    setIsAddReminderOpen(true);
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setView('day');
  };

  const handleSelectMonth = (month: number) => {
    const newDate = new Date(selectedDate.getFullYear(), month - 1, 1);
    setSelectedDate(newDate);
    setView('month');
  };

  // Update header title when selected date changes
  useEffect(() => {
    // Force header title to update when date changes
    const title = getHeaderTitle();
  }, [selectedDate]);

  return (
    <div className="h-screen flex flex-col bg-calendar-cream overflow-hidden">
      <Header
        title={getHeaderTitle()}
        onBack={handleBackClick}
        showBackButton={view !== 'year'}
      />
      
      <div className="flex-1 overflow-hidden">
        {view === 'day' && (
          <DayView
            date={selectedDate}
            onAddReminder={handleAddReminder}
          />
        )}
        
        {view === 'month' && (
          <MonthView
            year={selectedDate.getFullYear()}
            month={selectedDate.getMonth() + 1}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        )}
        
        {view === 'year' && (
          <YearView
            year={selectedDate.getFullYear()}
            onSelectMonth={handleSelectMonth}
          />
        )}
      </div>

      <AddReminderDialog
        isOpen={isAddReminderOpen}
        onClose={() => setIsAddReminderOpen(false)}
        date={selectedDate}
      />
    </div>
  );
};

export default Index;
