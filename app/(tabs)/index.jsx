import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {format, parseISO, isAfter} from 'date-fns';
import {ru} from "date-fns/locale";

import {filterLessonsByDate} from "../../lib/sortData";
import {CustomCalendar, LessonListItem} from "../../components";

const lessonsData = [
    {
        name: "Основы хип-хопа",
        description: "Первое занятие по основам хип-хопа.",
        lessonType: "Individual",
        startTime: "2024-08-20T17:00:00.000Z",
        finishTime: "2024-08-20T18:00:00.000Z",
    },
    {
        name: "Урок по контемпорари",
        description: "Групповое занятие по контемпорари танцу.",
        lessonType: "Group",
        startTime: "2024-08-16T15:00:00.000Z",
        finishTime: "2024-08-16T16:30:00.000Z",
    },
]

const TimeTableTab = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState({});

    const filteredLessons = filterLessonsByDate(lessonsData, selectedDate);

    useEffect(() => {
        const marks = {};

        lessonsData.forEach(lesson => {
            const date = format(parseISO(lesson.startTime), 'yyyy-MM-dd', {locale: ru});
            if (isAfter(parseISO(lesson.startTime), new Date())) {
                marks[date] = { marked: true, dotColor: "#d903e4" };
            }
        });

        setMarkedDates(marks);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <CustomCalendar
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                markedDates={markedDates}
            />
            <View style={styles.lessonContainer}>
                {filteredLessons.length > 0 ? (
                    <FlashList
                        data={filteredLessons}
                        keyExtractor={(item) => item.startTime}
                        estimatedItemSize={100}
                        renderItem={({item}) => (
                            <LessonListItem item={ item }/>
                        )}
                    />
                ) : (
                    <Text style={styles.noLessonsText}>Нет занятий на этот день</Text>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    lessonContainer: {
        flex: 1,
        paddingHorizontal: 20,
        marginTop: 15,
        borderTopWidth: 1,
        borderColor: "rgba(158, 150, 150, .5)",
    },
    noLessonsText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
});

export default TimeTableTab;
