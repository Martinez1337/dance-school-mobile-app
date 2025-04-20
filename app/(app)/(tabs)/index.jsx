import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {format, parseISO, isAfter} from 'date-fns';
import {ru} from "date-fns/locale";
import {Ionicons} from '@expo/vector-icons';
import {router, Tabs} from 'expo-router';

import {filterLessonsByDate} from "../../../util/sortData";
import {CustomCalendar, LessonListItem} from "../../../components";

import lessons from '../../../scratch-data/lessons.json';
import groups from '../../../scratch-data/groups.json';
import users from '../../../scratch-data/users.json';


// Обогащаем данные о группах информацией о записанных студентах
const enhancedGroups = groups.map(group => {
  const students = users
    .filter(user => user.role === 'Student')
    .slice(0, Math.floor(Math.random() * 10) + 1)
    .map(user => user.id);

  return {
    ...group,
    students: students
  };
});

// Обогащаем данные о занятиях информацией о студентах
const lessonsData = lessons.map(lesson => {
  if (lesson.lessonType === 'Individual') {
    const randomStudentIndex = Math.floor(Math.random() * users.filter(u => u.role === 'Student').length);
    const studentId = users.filter(u => u.role === 'Student')[randomStudentIndex].id;

    return {
      ...lesson,
      studentId: studentId
    };
  } else {
    return lesson;
  }
});

const TimeTableTab = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [filteredLessons, setFilteredLessons] = useState({});

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
      params: {id: lesson.id}
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: 'Расписание',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(shared)/my-groups')}
              style={{marginLeft: 20}}
            >
              <Ionicons name="people-outline" size={24} color="black"/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerRightContainer}>

            </View>
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
          lessonsData.length > 0 ? (
            <FlashList
              data={lessonsData}
              keyExtractor={(item) => item.id || item.startTime}
              estimatedItemSize={100}
              renderItem={({item}) => (
                <LessonListItem item={item} onPress={handleLessonPress}/>
              )}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noLessonsText}>
              {"Нет занятий на этот день"}
            </Text>
          )
        }
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
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  headerButton: {
    marginHorizontal: 5,
    padding: 5,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#d903e4',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: "os-regular",
  },
});

export default TimeTableTab;
