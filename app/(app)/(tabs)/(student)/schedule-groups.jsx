import {useEffect, useState, useMemo} from "react";
import {SafeAreaView, Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {format, isAfter, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import {useRouter, useLocalSearchParams} from 'expo-router';
import {Stack} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';

import {CustomCalendar, GroupLessonCard, GroupFilterModal} from '../../../../components';

import lessons from '../../../../scratch-data/lessons.json';
import groups from '../../../../scratch-data/groups.json';
import users from '../../../../scratch-data/users.json';
import subscriptionTemplates from "../../../../scratch-data/subscription-templates.json";

const uniqueLevels = [...new Set(groups.map(group => group.level))].filter(Boolean);
const teachers = users.filter(user => user.role === 'Teacher');

const lessonsData = lessons
  .filter(lesson => lesson.lessonType === "Group")
  .map(lesson => {
    const group = groups.find(group => group.id === lesson.groupId);
    const classroom = require('../../../../scratch-data/classrooms.json').find(classroom => classroom.id === lesson.classroomId);
    const teacher = teachers.find(teacher => teacher.id === lesson.teacherId);
    return {
      ...lesson,
      level: group?.level || 'Не указан',
      groupName: group?.name || 'Не указана',
      classroomName: classroom?.name || 'Не указана',
      teacherId: teacher?.id,
      groupId: group?.id,
    };
  });

const danceTypes = [
  {
    id: '1',
    name: 'Аргентинское танго',
    image: {uri: 'https://images.unsplash.com/photo-1545959570-a94084071b5d'},
    description: 'Классический стиль аргентинского танго'
  },
  {
    id: '2',
    name: 'Милонга',
    image: {uri: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7'},
    description: 'Быстрый и ритмичный стиль танго'
  },
  {
    id: '3',
    name: 'Вальс-танго',
    image: {uri: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea'},
    description: 'Танго в ритме вальса'
  },
  {
    id: '4',
    name: 'Танго нуэво',
    image: {uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e'},
    description: 'Современная интерпретация танго'
  },
  {
    id: '5',
    name: 'Электро-танго',
    image: {uri: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff'},
    description: 'Танго под электронную музыку'
  },
  {
    id: '6',
    name: 'Салонное танго',
    image: {uri: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434'},
    description: 'Элегантный социальный стиль танго'
  }
];

const subscriptionTypes = subscriptionTemplates.map(template => ({
  id: template.id,
  name: template.name,
  lessonType: template.lessonType
}));

export default function ScheduleGroups() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDanceTypes, setSelectedDanceTypes] = useState([]);
  const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState([]);

  useEffect(() => {
    if (params.danceId) {
      const danceExists = danceTypes.some(dance => dance.id === params.danceId);
      if (danceExists) {
        setSelectedDanceTypes([params.danceId]);
      }
    }
  }, [params.danceId]);

  useEffect(() => {
    const marks = {};
    lessonsData.forEach(lesson => {
      const date = format(parseISO(lesson.startTime), 'yyyy-MM-dd', {locale: ru});
      if (isAfter(parseISO(lesson.startTime), new Date())) {
        marks[date] = {marked: true, dotColor: '#d903e4'};
      }
    });
    setMarkedDates(marks);
  }, []);

  const filteredLessons = useMemo(() => {
    return lessonsData.filter(lesson => {
      const dateMatches = format(parseISO(lesson.startTime), 'yyyy-MM-dd') === selectedDate;
      const teacherMatches = selectedTeachers.length === 0 || selectedTeachers.includes(lesson.teacherId);
      const levelMatches = selectedLevels.length === 0 || selectedLevels.includes(lesson.level);
      const groupMatches = selectedGroups.length === 0 || selectedGroups.includes(lesson.groupId);
      const danceTypeMatches = selectedDanceTypes.length === 0 || selectedDanceTypes.includes(lesson.danceTypeId || '');
      const subscriptionTypeMatches = selectedSubscriptionTypes.length === 0 || selectedSubscriptionTypes.includes(lesson.subscriptionTypeId || '');

      return dateMatches && teacherMatches && levelMatches && groupMatches && danceTypeMatches && subscriptionTypeMatches;
    });
  }, [selectedDate, selectedTeachers, selectedLevels, selectedGroups, selectedDanceTypes, selectedSubscriptionTypes]);

  const handleLessonPress = (lesson) => {
    router.push({
      pathname: "/(app)/(shared)/lesson/[id]",
      params: {id: lesson.id}
    });
  };

  const toggleTeacherSelection = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const toggleLevelSelection = (level) => {
    setSelectedLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleGroupSelection = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleDanceTypeSelection = (danceTypeId) => {
    setSelectedDanceTypes(prev =>
      prev.includes(danceTypeId)
        ? prev.filter(id => id !== danceTypeId)
        : [...prev, danceTypeId]
    );
  };

  const toggleSubscriptionTypeSelection = (subscriptionTypeId) => {
    setSelectedSubscriptionTypes(prev =>
      prev.includes(subscriptionTypeId)
        ? prev.filter(id => id !== subscriptionTypeId)
        : [...prev, subscriptionTypeId]
    );
  }

  const resetFilters = () => {
    setSelectedTeachers([]);
    setSelectedLevels([]);
    setSelectedGroups([]);
    setSelectedDanceTypes([]);
    setSelectedSubscriptionTypes([]);
  };

  const filterData = {
    teachers: {
      items: teachers,
      selectedItems: selectedTeachers,
      onItemSelect: toggleTeacherSelection
    },
    levels: {
      items: uniqueLevels,
      selectedItems: selectedLevels,
      onItemSelect: toggleLevelSelection
    },
    groups: {
      items: groups,
      selectedItems: selectedGroups,
      onItemSelect: toggleGroupSelection
    },
    danceTypes: {
      items: danceTypes,
      selectedItems: selectedDanceTypes,
      onItemSelect: toggleDanceTypeSelection
    },
    subscriptionTypes: {
      items: subscriptionTypes,
      selectedItems: selectedSubscriptionTypes,
      onItemSelect: toggleSubscriptionTypeSelection
    }
  };

  const totalFiltersCount = selectedTeachers.length + selectedLevels.length +
    selectedGroups.length + selectedDanceTypes.length + selectedSubscriptionTypes.length;

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
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        markedDates={markedDates}
      />

      <FlashList
        data={filteredLessons}
        renderItem={({item}) => (
          <GroupLessonCard
            item={item}
            onPress={handleLessonPress}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={200}
        ListHeaderComponent={<View style={{height: 15}}/>}
        ListEmptyComponent={() => (
          <Text style={styles.noLessonsText}>
            В этот день нет подходящих групповых занятий
          </Text>
        )}
      />

      <GroupFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onReset={resetFilters}
        onApply={() => setFilterModalVisible(false)}
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
}); 