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

const CustomCalendar = ({selectedDate, setSelectedDate, markedDates}) => {
    return (
        <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
                ...markedDates,
                [selectedDate]: {selected: true, selectedColor: '#d903e4'},
            }}
            monthFormat={'MMMM yyyy'}
            firstDay={1} // Понедельник первым днем недели
            theme={{
                todayTextColor: "#d903e4",
                arrowColor: "#d903e4",
                textDayFontFamily: "os-regular",
                textMonthFontFamily: "os-bold",
                textDayHeaderFontFamily: "os-bold-it",
            }}
        />
    )
}

export default CustomCalendar;
