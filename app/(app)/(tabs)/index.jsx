import React, {useEffect, useState, useMemo} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {format, parseISO, isAfter} from 'date-fns';
import {ru} from "date-fns/locale";
import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';

import {filterLessonsByDate} from "../../../util/sortData";
import {CustomCalendar, LessonListItem, GroupFilterModal} from "../../../components";

import lessons from '../../../scratch-data/lessons.json';
import groups from '../../../scratch-data/groups.json';
import users from '../../../scratch-data/users.json';
import subscriptionTemplates from '../../../scratch-data/subscription-templates.json';

const uniqueLevels = [...new Set(groups.map(group => group.level))].filter(Boolean);

const teachers = users.filter(user => user.role === 'Teacher');

const danceTypes = [
  { id: '1', name: 'Хип-хоп' },
  { id: '2', name: 'Контемпорари' },
  { id: '3', name: 'Бальные танцы' },
  { id: '4', name: 'Латиноамериканские танцы' },
  { id: '5', name: 'Брейк-данс' },
  { id: '6', name: 'Джаз-фанк' },
  { id: '7', name: 'Фламенко' },
  { id: '8', name: 'Народные танцы' }
];

const subscriptionTypes = subscriptionTemplates.map(template => ({
  id: template.id,
  name: template.name,
  lessonType: template.lessonType
}));

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
  const [viewMode, setViewMode] = useState('personal');
  
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDanceTypes, setSelectedDanceTypes] = useState([]);
  const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState([]);

  const currentUserId = "db8754e3-efc5-4af0-9e72-0d96e5a3d523";

  const filteredLessons = useMemo(() => {
    const lessonsByDate = filterLessonsByDate(lessonsData, selectedDate);
    
    if (viewMode === 'personal') {
      return lessonsByDate.filter(lesson => {
        if (lesson.lessonType === 'Individual') {
          return lesson.studentId === currentUserId;
        }
        else if (lesson.lessonType === 'Group') {
          const group = enhancedGroups.find(g => g.id === lesson.groupId);
          return group && group.students && group.students.includes(currentUserId);
        }
        return false;
      });
    } 
    else if (viewMode === 'group') {
      return lessonsByDate.filter(lesson => {
        if (lesson.lessonType !== 'Group') return false;
        
        const teacherMatches = selectedTeachers.length === 0 || selectedTeachers.includes(lesson.teacherId);
        const levelMatches = selectedLevels.length === 0 || selectedLevels.includes(lesson.level);
        const groupMatches = selectedGroups.length === 0 || selectedGroups.includes(lesson.groupId);
        const danceTypeMatches = selectedDanceTypes.length === 0 || selectedDanceTypes.includes(lesson.danceTypeId);
        const subscriptionTypeMatches = selectedSubscriptionTypes.length === 0 || selectedSubscriptionTypes.includes(lesson.subscriptionTypeId);
        
        return teacherMatches && levelMatches && groupMatches && danceTypeMatches && subscriptionTypeMatches;
      });
    }
    
    return [];
  }, [selectedDate, viewMode, selectedTeachers, selectedLevels, selectedGroups, selectedDanceTypes, selectedSubscriptionTypes]);

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

  const toggleViewMode = () => {
    if (viewMode === 'personal') {
      setViewMode('group');
      resetFilters();
    } else {
      setViewMode('personal');
    }
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
  };

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

  const getViewModeIcon = () => {
    if (viewMode === 'personal') return 'person';
    return 'people';
  };

  const getHeaderTitle = () => {
    if (viewMode === 'personal') return "Моё расписание";
    return "Групповые занятия";
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerShown: true,
          headerTitle: getHeaderTitle(),
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
              {viewMode === 'group' && (
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
              )}
              <TouchableOpacity 
                onPress={toggleViewMode}
                style={styles.headerButton}
              >
                <Ionicons name={getViewModeIcon()} size={24} color="#d903e4"/>
              </TouchableOpacity>
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
          filteredLessons.length > 0 ? (
            <FlashList
              data={filteredLessons}
              keyExtractor={(item) => item.id || item.startTime}
              estimatedItemSize={100}
              renderItem={({item}) => (
                <LessonListItem item={item} onPress={handleLessonPress}/>
              )}
            />
          ) : (
            <Text style={styles.noLessonsText}>
              {viewMode === 'personal' 
                ? "Нет занятий на этот день" 
                : "Нет групповых занятий на этот день"}
            </Text>
          )
        }
      </View>

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
