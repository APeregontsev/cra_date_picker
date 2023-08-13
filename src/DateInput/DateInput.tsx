import { FC, memo, useMemo, useState } from "react";
import style from "./style.module.scss";
import classNames from "classnames";
import { addMonth, getCalendar, CalendarDateType, dateFromCalendarDate, calendarDateFromDate } from "./Date";

type DateInputProps = {
  value: Date | undefined;
  setValue: (value: Date | undefined) => void;
  shadow3d?: boolean;
  nightTheme?: boolean;
};

const DateInput: FC<DateInputProps> = ({ value, setValue, nightTheme, shadow3d }) => {
  // states

  const [isOpen, setIsOpen] = useState(false);

  const [month, setMonth] = useState(() => {
    return new Date().getMonth() + 1;
  });

  const [year, setYear] = useState(() => {
    return new Date().getFullYear();
  });

  // Getting calendar for rendering

  const calendar = useMemo(() => {
    return getCalendar(month, year, value);
  }, [month, year, value]);

  function shiftMonth(by: number) {
    const firstDayOfTneCurrentMonth = { day: 1, month, year };
    const firstDayOfTneTargetMonth = addMonth(firstDayOfTneCurrentMonth, by);
    setMonth(firstDayOfTneTargetMonth.month);
    setYear(firstDayOfTneTargetMonth.year);
  }

  // Placeholder for DateInput field: selected Date or dd / mm / yyyy

  let placeholder: string;

  if (value == undefined) {
    placeholder = "dd / mm / yyyy";
  } else {
    const selectedDate = calendarDateFromDate(value);
    placeholder =
      selectedDate.day.toString().padStart(2, "0") +
      " / " +
      selectedDate.month.toString().padStart(2, "0") +
      " / " +
      selectedDate.year;
  }

  // Text for Calendat Current Date display

  const currentPeriod = new Date(year + "," + month + "," + 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  function onSelectDay(day: CalendarDateType) {
    setValue(dateFromCalendarDate(day));
  }

  // Event Handlers for Buttons as DIVs - not to loose focus on click

  function prevHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    shiftMonth(-1);
  }
  function nextHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    e.stopPropagation();
    shiftMonth(1);
  }

  console.log("!!!!!!!!!!!!!!!!!!!!!!!! weeksForRender", calendar);

  // styles

  const daysPlateStyles = classNames(style.daysPlate, { [style.show]: isOpen });
  const calendarWrapperStyles = classNames(style.calendarWrapper, {
    [style.noShadow3d]: !shadow3d,
  });

  return (
    <div
      tabIndex={0}
      className={style.container}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
    >
      <span>{placeholder}</span>

      <div className={daysPlateStyles}>
        <div className={calendarWrapperStyles}>
          <div
            className={style.controlWrapper}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className={style.controlBtnPrev} onClick={prevHandler} />
            <div className={style.currentDate}>{currentPeriod}</div>
            <div className={style.controlBtnNext} onClick={nextHandler} />
          </div>
          <table>
            <thead>
              <tr className={classNames({ [style.noShadow3d]: shadow3d })}>
                <th>Mo</th>
                <th>Tu</th>
                <th>We</th>
                <th>Th</th>
                <th>Fr</th>
                <th className={style.weekRed}>Sa</th>
                <th className={style.weekRed}>Su</th>
              </tr>
            </thead>

            <tbody>
              {calendar.map((week, index) => {
                return (
                  <tr key={index}>
                    {week.map((day, index) => {
                      return (
                        <td
                          className={classNames(
                            { [style.today]: day.isToday },
                            { [style.otherMonth]: day.month !== month },
                            { [style.weekend]: index >= 5 },
                            { [style.selectedDay]: day.isSelected }
                          )}
                          key={day.day + index}
                          onClick={() => onSelectDay(day)}
                        >
                          {day.day}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(DateInput);
