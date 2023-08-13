export type CalendarDateType = {
  day: number;
  month: number;
  year: number;
};

export type CalendarDateToRender = CalendarDateType & {
  // isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
};

type CalendarWeek = CalendarDateToRender[];

// --------------------------------------------------------------------------------

export function calendarDateFromDate(date: Date): CalendarDateType {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function dateFromCalendarDate(date: CalendarDateType): Date {
  return new Date(date.year, date.month - 1, date.day);
}

// --------------------------------------------------------------------------------

function addDay(date: CalendarDateType, day: number): CalendarDateType {
  var d = dateFromCalendarDate(date);
  d.setDate(d.getDate() + day);
  return calendarDateFromDate(d);
}

export function addMonth(date: CalendarDateType, month: number): CalendarDateType {
  var d = dateFromCalendarDate(date);
  d.setMonth(d.getMonth() + month);
  return calendarDateFromDate(d);
}

// --------------------------------------------------------------------------------

export function sameMonth(a: CalendarDateType, b: CalendarDateType): boolean {
  return a.month === b.month && a.year === b.year;
}

export function sameDay(a: CalendarDateType, b: CalendarDateType): boolean {
  return sameMonth(a, b) && a.day === b.day;
}

export function isToday(a: CalendarDateType): boolean {
  return sameDay(a, calendarDateFromDate(new Date()));
}

export function isSelected(a: CalendarDateType, b: CalendarDateType): boolean {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}

// --------------------------------------------------------------------------------

const Sunday = 1;

function getFirstDateOfTheWeekFor(date: CalendarDateType): CalendarDateType {
  let current = date;

  while (dateFromCalendarDate(current).getDay() !== Sunday) {
    current = addDay(current, -1);
  }

  return current;
}

export function getCalendar(month: number, year: number, value?: Date): Array<CalendarWeek> {
  let selectedDate: CalendarDateType | undefined = undefined;
  if (value) selectedDate = calendarDateFromDate(value);

  const firstDayOfTheMonth: CalendarDateType = { year, month, day: 1 };

  let firstDayForRender = getFirstDateOfTheWeekFor(firstDayOfTheMonth);

  const calendar: Array<CalendarWeek> = [];

  for (let i = 0; i < 6; i++) {
    const week: CalendarWeek = [];
    calendar.push(week);
    for (let j = 0; j < 7; j++) {
      week.push({
        ...firstDayForRender,
        isToday: isToday(firstDayForRender),
        isSelected: selectedDate ? isSelected(firstDayForRender, selectedDate) : false,
      });

      firstDayForRender = addDay(firstDayForRender, 1);
    }
  }

  return calendar;
}
