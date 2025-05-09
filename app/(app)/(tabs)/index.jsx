import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {format, parseISO, isAfter} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';
import {ru} from "date-fns/locale";
import {Ionicons} from '@expo/vector-icons';
import {router, Tabs} from 'expo-router';
import {useSelector} from "react-redux";

import {CustomCalendar, LessonListItem} from "../../../components";
import {apiRequest, handleApiError} from "../../../util/apiService";
import {getDatesMonthInterval} from "../../../util/dates";

const fetchLessons = async (role, date) => {
  const {dateFrom, dateTo} = getDatesMonthInterval(date)
  try {
    return await apiRequest({
      method: 'POST',
      url: role === 'student'
        ? '/lessons/search/student'
        : '/lessons/search/teacher',
      data: {
        date_from: dateFrom,
        date_to: dateTo,
        is_confirmed: true
      }
    })
  } catch (error) {
    handleApiError(error)
  }
};

const TimeTableTab = () => {
  const role = useSelector((state) => state.session.role);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [lessons, setLessons] = useState(null);
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchLessons(role, selectedDate)
      .then((result) => setLessons(result.lessons))
  }, []);

  useEffect(() => {
    if (!lessons) {
      return;
    }

    const marks = {};
    if (lessons.length >= 0) {
      // Отмечаем будущие занятие маркерами
      lessons.forEach(lesson => {
        const date = format(parseISO(lesson.start_time), 'yyyy-MM-dd', {locale: ru});
        if (isAfter(parseISO(lesson.start_time), new Date())) {
          marks[date] = {marked: true, dotColor: "#d903e4"};
        }
      });
      // Фильтруем занятия по выбранной дате
      const filtered = lessons.filter(lesson =>
        format(parseISO(lesson.start_time), 'yyyy-MM-dd') === selectedDate
      );
      setFilteredLessons(filtered);
    }

    // Убираем маркер с выбранной даты
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      marked: false,
    };

    setMarkedDates(marks);
  }, [selectedDate, lessons]);

  const handleLessonPress = (lesson) => {
    router.push({
      pathname: '/(app)/(shared)/lesson/[id]',
      params: {id: lesson.id}
    });
  };

  const onRefreshHandler = async () => {
    setIsRefreshing(true);
    const result = await fetchLessons(role, selectedDate);
    setLessons(result.lessons)
    setIsRefreshing(false);
  }

  const handleDayPress = useCallback((dateData) => {
    setSelectedDate(dateData.dateString);
  }, [])

  const handleMonthChange = useCallback((dateData) => {
    const date = new Date(parseISO(dateData.dateString));
    date.setUTCDate(1);

    const dateString = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    setSelectedDate(dateString);
    fetchLessons(role, dateString)
      .then((result) => setLessons(result.lessons));
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: 'Расписание',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(shared)/my-groups')}
              style={{marginLeft: 20, marginBottom: 5.5}}
            >
              <Ionicons name="people-outline" size={24} color="black"/>
            </TouchableOpacity>
          )
        }}
      />

      <CustomCalendar
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
      />

      <View style={styles.lessonContainer}>
        <FlashList
          data={filteredLessons}
          keyExtractor={(item) => item.id}
          estimatedItemSize={200}
          refreshing={isRefreshing}
          onRefresh={onRefreshHandler}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <LessonListItem
              item={item}
              onPress={handleLessonPress}
            />
          )}
          ListHeaderComponent={<View style={{height: 15}}/>}
          ListEmptyComponent={() => (
            <Text style={styles.noLessonsText}>
              Нет занятий на этот день
            </Text>
          )}
        />
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
    borderColor: "rgba(158, 150, 150, .1)",
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
