
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getSolarInfo, getLunarInfo, getDayActivities } from '@/utils/calendar';
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="h-full">
      <div className="flex flex-col min-h-full">
        <div className="bg-calendar-red text-white p-4 rounded-b-2xl shadow-md">
          <div className="text-center mb-3">
            <div className="text-sm opacity-80">{solar.year}年{solar.month}月</div>
            <div className="text-5xl font-bold mb-1">{solar.day}</div>
            <div className="text-sm">{weekdays[solar.weekday]}</div>
            <div className="text-xs mt-1">{solar.hour.toString().padStart(2, '0')}:{solar.minute.toString().padStart(2, '0')}</div>
          </div>
          
          <Card className="bg-white/10 backdrop-blur-sm text-white border-0 p-3 mb-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs opacity-80">农历</div>
                <div className="text-base font-medium">{lunar.monthInChinese}月{lunar.dayInChinese}</div>
                <div className="text-xs">{lunar.yearInChinese}年</div>
              </div>
              <div className="text-center border-l border-white/30">
                <div className="text-xs opacity-80">干支</div>
                <div className="text-base font-medium">{lunar.dayInGanZhi}</div>
                <div className="text-xs">{lunar.yearInGanZhi}年</div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex-1 p-3 overflow-y-auto">
          <Card className="mb-3">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              时辰
            </div>
            <div className="p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">当前时辰：</span>
                <span className="text-sm">{lunar.timeInGanZhi.timeName} ({lunar.timeInGanZhi.hourRange})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">时辰干支：</span>
                <span className="text-sm">{lunar.timeInGanZhi.ganZhi}</span>
              </div>
            </div>
          </Card>
          
          {lunar.jieQi && (
            <Card className="mb-3">
              <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">节气</div>
              <div className="p-3 flex items-center justify-center">
                <span className="px-4 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm">
                  {lunar.jieQi}
                </span>
              </div>
            </Card>
          )}

          <Card className="mb-3">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">宜忌</div>
            <div className="p-3">
              <div className="mb-2">
                <div className="text-xs text-muted-foreground mb-1">宜</div>
                <div className="flex flex-wrap gap-1.5">
                  {activities.auspicious.map((item, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">忌</div>
                <div className="flex flex-wrap gap-1.5">
                  {activities.inauspicious.map((item, index) => (
                    <span 
                      key={index}
                      className="px-2 py-0.5 bg-red-50 text-red-700 rounded-full text-xs"
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
            <Card className="mb-3">
              <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">节日</div>
              <div className="p-3">
                <div className="flex flex-wrap gap-1.5">
                  {lunar.festivals.solar.map((festival, index) => (
                    <span key={`solar-${index}`} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                  {lunar.festivals.lunar.map((festival, index) => (
                    <span key={`lunar-${index}`} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                  {lunar.festivals.other.map((festival, index) => (
                    <span key={`other-${index}`} className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs">
                      {festival}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}

          <Card className="mb-3">
            <div className="bg-calendar-lightGold px-3 py-2 font-medium text-sm">当日提醒</div>
            <div className="p-3 text-center text-muted-foreground text-sm">
              暂无提醒事项
            </div>
          </Card>
        </div>
        
        <div className="p-3 border-t">
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
