import React, {useCallback, useEffect, useState} from "react";
import {SafeAreaView, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import {format, isAfter, parseISO} from "date-fns";
import {useLocalSearchParams, router} from 'expo-router';
import {Stack} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {formatInTimeZone} from "date-fns-tz";
import {ru} from "date-fns/locale";

import {CustomCalendar, GroupFilterModal, LessonsList} from '../../../../components';
import {createPaginatedFetcher} from "../../../../util/apiService";
import {globalStyles} from "../../../../styles/globalStyles";
import {usePaginatedData, useFilters} from "../../../../util/hooks";
import {getDatesMonthInterval} from "../../../../util/dates";

const fetchLevels = createPaginatedFetcher({
  url: '/levels/search',
  defaultParams: {
    terminated: false
  }
});

const fetchTeachers = createPaginatedFetcher({
  url: '/teachers/search/full-info',
  defaultParams: {
    terminated: false
  }
});

const fetchGroups = createPaginatedFetcher({
  url: '/groups/search',
  defaultParams: {
    terminated: false
  }
});

const fetchSubTemplates = createPaginatedFetcher({
  url: '/subscriptionTemplates/search',
  defaultParams: {
    is_expired: false
  }
});

const fetchLessonTypes = createPaginatedFetcher({
  url: '/lessonTypes/search/full-info',
  defaultParams: {
    is_group: true,
    terminated: false
  }
});

const fetchGroupLessons = createPaginatedFetcher({
  url: '/lessons/search/group',
  defaultParams: {
    is_group: true,
    in_group: false,
    terminated: false
  }
});

const ScheduleGroups = () => {
  const params = useLocalSearchParams();
  const filters = useFilters();
  const [loading, setLoading] = useState(true);

  const lessons = usePaginatedData(fetchGroupLessons, 'lessons');
  const teachers = usePaginatedData(fetchTeachers, 'teachers');
  const levels = usePaginatedData(fetchLevels, 'levels');
  const groups = usePaginatedData(fetchGroups, 'groups');
  const lessonTypes = usePaginatedData(fetchLessonTypes, 'lesson_types');
  const subTemplates = usePaginatedData(fetchSubTemplates, 'subscription_templates');

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Загрузка начальных данных
  useEffect(() => {
    const fetchInitialData = async () => {
      const {dateFrom, dateTo} = getDatesMonthInterval(selectedDate);

      await Promise.all([
        lessons.loadMoreAsync({additionalParams: {
            date_from: dateFrom,
            date_to: dateTo,
            lesson_type_ids: params?.danceId ? [params.danceId] : undefined
          }
        }),
        teachers.loadMore(),
        levels.loadMore(),
        groups.loadMore(),
        lessonTypes.loadMore(),
        subTemplates.loadMore(),
      ]);

      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // Установка фильтра по типу танца, если он указан в параметрах маршрута
  useEffect(() => {
    if (params.danceId && lessonTypes.state.data.some(lt => lt.id === params.danceId)) {
      filters.toggleDanceType(params.danceId);
    }
  }, [params.danceId, lessonTypes.state]);

  useEffect(() => {
    if (!lessons.state.data) {
      return;
    }

    const marks = {};
    if (lessons.state.data.length >= 0) {
      lessons.state.data.forEach(lesson => {
        const date = format(parseISO(lesson.start_time), 'yyyy-MM-dd', {locale: ru});
        if (isAfter(parseISO(lesson.start_time), new Date())) {
          marks[date] = {marked: true, dotColor: "#d903e4"};
        }
      });

      const filtered = lessons.state.data.filter(lesson =>
        format(parseISO(lesson.start_time), 'yyyy-MM-dd') === selectedDate
      );

      setFilteredLessons(filtered);
    }

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      marked: false,
    };

    setMarkedDates(marks);
  }, [selectedDate, lessons.state]);

  const handleMonthChange = useCallback(async (dateData) => {
    const date = new Date(parseISO(dateData.dateString));
    date.setUTCDate(1);

    const dateString = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    setSelectedDate(dateString);

    const {dateFrom, dateTo} = getDatesMonthInterval(dateString);

    await lessons.reset();

    await lessons.loadMoreAsync({additionalParams: {
        date_from: dateFrom,
        date_to: dateTo,
        teacher_ids: filters.selectedTeachers,
        level_ids: filters.selectedLevels,
        group_ids: filters.selectedGroups,
        lesson_type_ids: filters.selectedDanceTypes,
        subscription_template_ids: filters.selectedSubscriptionTypes
      }});
  }, [filters]);

  // Обработчик применения фильтров
  const handleApplyFilters = useCallback(async (newFilters) => {
    setFilterModalVisible(false);

    filters.setSelectedTeachers(newFilters.teachers);
    filters.setSelectedLevels(newFilters.levels);
    filters.setSelectedGroups(newFilters.groups);
    filters.setSelectedDanceTypes(newFilters.lessonTypes);
    filters.setSelectedSubscriptionTypes(newFilters.subscriptionTypes);

    const date = new Date(parseISO(selectedDate));
    date.setUTCDate(1);

    const dateString = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    const {dateFrom, dateTo} = getDatesMonthInterval(dateString);

    await lessons.reset();
    await lessons.loadMoreAsync({
      additionalParams: {
        date_from: dateFrom,
        date_to: dateTo,
        teacher_ids: newFilters.teachers,
        level_ids: newFilters.levels,
        group_ids: newFilters.groups,
        lesson_type_ids: newFilters.lessonTypes,
        subscription_template_ids: newFilters.subscriptionTypes
      }
    });
  }, [selectedDate, lessons, filters]);

  const handleLessonPress = (lesson) => {
    router.push({
      pathname: "/(app)/(shared)/lesson/[id]",
      params: {id: lesson.id}
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </SafeAreaView>
    )
  }

  const filterData = {
    teachers: {
      items: teachers.state.data,
      selectedItems: filters.selectedTeachers,
      onItemSelect: filters.toggleTeacher,
      onEndReached: teachers.loadMore,
      loading: teachers.state.loading,
      hasMore: teachers.state.hasMore
    },
    levels: {
      items: levels.state.data,
      selectedItems: filters.selectedLevels,
      onItemSelect: filters.toggleLevel,
      onEndReached: levels.loadMore,
      loading: levels.state.loading,
      hasMore: levels.state.hasMore
    },
    groups: {
      items: groups.state.data,
      selectedItems: filters.selectedGroups,
      onItemSelect: filters.toggleGroup,
      onEndReached: groups.loadMore,
      loading: groups.state.loading,
      hasMore: groups.state.hasMore
    },
    lessonTypes: {
      items: lessonTypes.state.data,
      selectedItems: filters.selectedDanceTypes,
      onItemSelect: filters.toggleDanceType,
      onEndReached: lessonTypes.loadMore,
      loading: lessonTypes.state.loading,
      hasMore: lessonTypes.state.hasMore
    },
    subscriptionTypes: {
      items: subTemplates.state.data,
      selectedItems: filters.selectedSubscriptionTypes,
      onItemSelect: filters.toggleSubscriptionType,
      onEndReached: subTemplates.loadMore,
      loading: subTemplates.state.loading,
      hasMore: subTemplates.state.hasMore
    }
  };

  const totalFiltersCount = filters.selectedTeachers.length + filters.selectedLevels.length +
    filters.selectedGroups.length + filters.selectedDanceTypes.length + filters.selectedSubscriptionTypes.length;

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setFilterModalVisible(true)}
              style={styles.headerButton}
            >
              <Ionicons
                name={totalFiltersCount > 0 ? "filter" : "filter-outline"}
                size={24}
                color={totalFiltersCount > 0 ? "#d903e4" : "black"}
              />
              {totalFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{totalFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <CustomCalendar
        onDayPress={(dateData) => setSelectedDate(dateData.dateString)}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
      />

      <View style={styles.lessonContainer}>
        <LessonsList
          lessons={filteredLessons}
          onLessonPress={handleLessonPress}
          onEndReached={lessons.loadMore}
          refreshing={lessons.state.loading}
          onRefresh={async () => {
            const {dateFrom, dateTo} = getDatesMonthInterval(selectedDate);
            await lessons.reset();
            await lessons.loadMoreAsync({additionalParams: {
                date_from: dateFrom,
                date_to: dateTo,
                teacher_ids: filters.selectedTeachers,
                level_ids: filters.selectedLevels,
                group_ids: filters.selectedGroups,
                lesson_type_ids: filters.selectedDanceTypes,
                subscription_template_ids: filters.selectedSubscriptionTypes
            }});
          }}
        />
      </View>

      <GroupFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onReset={filters.resetFilters}
        onApply={handleApplyFilters}
        filters={filterData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  lessonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15,
    borderTopWidth: 1,
    borderColor: "rgba(158, 150, 150, .1)",
  },
  noLessonsText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    fontFamily: "os-regular",
    color: '#333',
  },
  headerButton: {
    marginRight: 8,
    marginLeft: 10,
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
  loadingFooter: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ScheduleGroups;