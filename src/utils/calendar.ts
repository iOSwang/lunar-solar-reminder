
import { Solar, Lunar, HolidayUtil } from 'lunar-javascript';

// Get Solar (Gregorian) calendar info
export function getSolarInfo(date: Date = new Date()) {
  const solar = Solar.fromDate(date);
  return {
    year: solar.getYear(),
    month: solar.getMonth(),
    day: solar.getDay(),
    weekday: solar.getWeek(),
    weekdayInChinese: "日一二三四五六".charAt(solar.getWeek()),
  };
}

// Get Lunar calendar info
export function getLunarInfo(date: Date = new Date()) {
  const lunar = Lunar.fromDate(date);
  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    yearInGanZhi: lunar.getYearInGanZhi(),
    monthInGanZhi: lunar.getMonthInGanZhi(),
    dayInGanZhi: lunar.getDayInGanZhi(),
    yearInChinese: lunar.getYearInChinese(),
    monthInChinese: lunar.getMonthInChinese(),
    dayInChinese: lunar.getDayInChinese(),
    festivals: getFestivals(date),
    jieQi: lunar.getJieQi(),
  };
}

// Get festivals and holidays
function getFestivals(date: Date) {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromDate(date);
  
  const solarFestivals = HolidayUtil.getSolarHoliday(
    solar.getMonth(),
    solar.getDay()
  );
  
  const lunarFestivals = HolidayUtil.getLunarHoliday(
    lunar.getMonth(),
    lunar.getDay()
  );
  
  return {
    solar: solarFestivals ? [solarFestivals] : [],
    lunar: lunarFestivals ? [lunarFestivals] : [],
  };
}

// Get auspicious and inauspicious activities for the day
export function getDayActivities(date: Date = new Date()) {
  const lunar = Lunar.fromDate(date);
  // These would typically come from traditional almanacs
  // This is a simplified version
  const dayInGanZhi = lunar.getDayInGanZhi();
  
  // Simple mapping based on the Heavenly Stem of the day
  const stem = dayInGanZhi.charAt(0);
  const branch = dayInGanZhi.charAt(1);
  
  let auspicious = [];
  let inauspicious = [];
  
  // Very simplified version - in a real app, these would come from traditional references
  switch(stem) {
    case '甲':
    case '丙':
    case '戊':
    case '庚':
    case '壬':
      auspicious = ['出行', '上任', '会友', '上书', '远行'];
      inauspicious = ['动土', '祭祀', '安葬', '行船'];
      break;
    default:
      auspicious = ['祭祀', '祈福', '修造', '动土', '嫁娶'];
      inauspicious = ['远行', '开市', '安床', '破土'];
  }
  
  return {
    auspicious,
    inauspicious
  };
}

// Generate calendar data for a month
export function getMonthCalendar(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  
  // Get the day of the week (0-6) of the first day of the month
  const firstDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add empty days for the beginning of the calendar
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const lunar = Lunar.fromDate(date);
    
    days.push({
      date,
      solar: {
        day,
        month,
        year
      },
      lunar: {
        day: lunar.getDay(),
        month: lunar.getMonth(),
        year: lunar.getYear(),
        dayInChinese: lunar.getDayInChinese(),
      },
      hasEvent: false, // Will be updated when events are implemented
    });
  }
  
  return days;
}

// Generate calendar data for a year
export function getYearCalendar(year: number) {
  const months = [];
  
  for (let month = 1; month <= 12; month++) {
    months.push({
      month,
      days: getMonthCalendar(year, month)
    });
  }
  
  return months;
}
