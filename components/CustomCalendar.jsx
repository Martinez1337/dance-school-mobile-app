import React from 'react'
import {Calendar, LocaleConfig} from "react-native-calendars";
import {
  MONTH_NAMES_RU,
  MONTH_NAMES_SHORT_RU,
  DAYS_NAMES_RU,
  DAYS_NAMES_SHORT_RU,
  TODAY_RU
} from "../constants";

LocaleConfig.locales['ru'] = {
  monthNames: MONTH_NAMES_RU,
  monthNamesShort: MONTH_NAMES_SHORT_RU,
  dayNames: DAYS_NAMES_RU,
  dayNamesShort: DAYS_NAMES_SHORT_RU,
  today: TODAY_RU,
};

LocaleConfig.defaultLocale = 'ru';

const CustomCalendar = ({markedDates, onDayPress, onMonthChange}) => {
  return (
    <Calendar
      onMonthChange={(dateData) => onMonthChange(dateData)}
      onDayPress={(dateData) => onDayPress(dateData)}
      markedDates={markedDates}
      monthFormat={'MMMM yyyy'}
      firstDay={1}
      minDate={"1996-05-10"}
      maxDate={"2030-05-30"}
      hideExtraDays={true}
      enableSwipeMonths={true}
      theme={{
        todayTextColor: "#d903e4",
        arrowColor: "#d903e4",
        selectedDayBackgroundColor: '#d903e4',
        selectedDayTextColor: '#ffffff',
        textDayFontFamily: "os-regular",
        textMonthFontFamily: "os-bold",
        textDayHeaderFontFamily: "os-bold-it",
      }}
    />
  )
}

export default CustomCalendar;
