import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useEffect, useState, useMemo } from "react";
import { format, isAfter, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomCalendar, GroupLessonCard, GroupFilterModal } from '../../../../components';
import { FlashList } from '@shopify/flash-list';
import lessons from '../../../../scratch-data/lessons.json';
import groups from '../../../../scratch-data/groups.json';
import users from '../../../../scratch-data/users.json';

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

export default function ScheduleGroups() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    const marks = {};
    lessonsData.forEach(lesson => {
      const date = format(parseISO(lesson.startTime), 'yyyy-MM-dd', { locale: ru });
      if (isAfter(parseISO(lesson.startTime), new Date())) {
        marks[date] = { marked: true, dotColor: '#d903e4' };
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
      
      return dateMatches && teacherMatches && levelMatches && groupMatches;
    });
  }, [selectedDate, selectedTeachers, selectedLevels, selectedGroups]);

  const handleLessonPress = (lesson) => {
    router.push({
      pathname: "/(app)/(shared)/lesson/[id]",
      params: { id: lesson.id }
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

  const resetFilters = () => {
    setSelectedTeachers([]);
    setSelectedLevels([]);
    setSelectedGroups([]);
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
    }
  };

  const totalFiltersCount = selectedTeachers.length + selectedLevels.length + selectedGroups.length;

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
        renderItem={({ item }) => (
          <GroupLessonCard 
            item={item}
            onPress={handleLessonPress}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={200}
        ListHeaderComponent={<View style={{ height: 15 }} />}
        ListEmptyComponent={() => (
          <Text style={styles.noLessonsText}>
            В этот день нет групповых занятий
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