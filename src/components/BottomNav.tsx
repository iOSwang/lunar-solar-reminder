
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Calendar,
      label: '日历',
      path: '/',
    },
    {
      icon: Bell,
      label: '提醒',
      path: '/reminders',
    },
    {
      icon: User,
      label: '我的',
      path: '/profile',
    },
  ];

  return (
    <div className="h-16 border-t bg-white flex">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-1 flex-col items-center justify-center',
              isActive ? 'text-calendar-red' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
