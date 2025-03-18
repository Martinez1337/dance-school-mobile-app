import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {format, parseISO, isAfter} from 'date-fns';
import {ru} from "date-fns/locale";
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';

import {filterLessonsByDate} from "../../../util/sortData";
import {CustomCalendar, LessonListItem} from "../../../components";

const lessonsData = [
  {
    id: "1",
    name: "Основы танго",
    description: "Первое занятие по основам танго.",
    lessonType: "Individual",
    groupId: null,
    startTime: "2025-03-10T17:00:00.000Z",
    finishTime: "2025-03-10T18:00:00.000Z",
  },
  {
    id: "2",
    name: "Урок по контемпорари",
    description: "Групповое занятие по контемпорари танцу.",
    lessonType: "Group",
    groupId: "123",
    startTime: "2025-03-11T15:00:00.000Z",
    finishTime: "2025-03-11T16:30:00.000Z",
  },
]

const TimeTableTab = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});

  const filteredLessons = filterLessonsByDate(lessonsData, selectedDate);

  useEffect(() => {
    const marks = {};

    lessonsData.forEach(lesson => {
      const date = format(parseISO(lesson.startTime), 'yyyy-MM-dd', {locale: ru});
      if (isAfter(parseISO(lesson.startTime), new Date())) {
        marks[date] = {marked: true, dotColor: "#d903e4"};
      }
    });

    setMarkedDates(marks);
  }, []);

  const handleLessonPress = (lesson) => {
    router.push({
      pathname: '/(app)/(shared)/lesson/[id]',
      params: { id: lesson.id }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: "Расписание",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(app)/(shared)/my-groups')}
              style={{marginLeft: 20}}
            >
              <Ionicons name="people-outline" size={24} color="black"/>
            </TouchableOpacity>
          )
        }}
      />
      <CustomCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        markedDates={markedDates}
      />
      <View style={styles.lessonContainer}>
        {
          filteredLessons.length > 0 ? (
            <FlashList
              data={filteredLessons}
              keyExtractor={(item) => item.startTime}
              estimatedItemSize={100}
              renderItem={({item}) => (
                <LessonListItem item={item} onPress={handleLessonPress}/>
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
