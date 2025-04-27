import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity} from 'react-native';
import {Stack, router, useLocalSearchParams} from 'expo-router';
import {useSelector} from "react-redux";
import {Ionicons} from '@expo/vector-icons';

import {ConfirmationModal, StudentCard, TeacherCard, TeacherProfileModal} from '../../../../components';
import groups from '../../../../scratch-data/groups.json';
import users from '../../../../scratch-data/users.json';

const GroupScreen = () => {
  const {id} = useLocalSearchParams();
  const userRole = useSelector(state => state.session.role);
  const userId = useSelector(state => state.user.id);

  const [group, setGroup] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [role, setRole] = useState(userRole);
  const [isUserInGroup, setIsUserInGroup] = useState(false);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isLeaveConfirmVisible, setIsLeaveConfirmVisible] = useState(false);

  useEffect(() => {
    setRole(userRole)
  }, [userRole])

  useEffect(() => {
    const foundGroup = groups.find(g => g.id === id);
    if (foundGroup) {
      const studentsWithDetails = foundGroup.students.map(student => {
        const fullStudentInfo = users.find(user => user.id === student.id);
        return {
          ...student,
          photo: fullStudentInfo?.photo,
          level: fullStudentInfo?.level
        };
      });

      // Получить информацию о преподавателях
      let teachersData = [];
      if (foundGroup.teacher) {
        const mainTeacher = users.find(user => user.id === foundGroup.teacher.id);
        if (mainTeacher) {
          teachersData.push(mainTeacher);
        }
      }
      
      // Если есть другие преподаватели
      if (foundGroup.additionalTeachers) {
        const additionalTeachersData = foundGroup.additionalTeachers
          .map(teacherId => users.find(user => user.id === teacherId))
          .filter(Boolean);
        teachersData = [...teachersData, ...additionalTeachersData];
      }

      // Проверяем, является ли текущий пользователь участником группы
      const isCurrentUserInGroup = studentsWithDetails.some(student => student.id === userId);
      setIsUserInGroup(isCurrentUserInGroup);

      setGroup({
        ...foundGroup,
        students: studentsWithDetails,
        teachers: teachersData,
        // Добавляем стили танцев если их нет
        danceStyles: foundGroup.danceStyles || ['Аргентинское танго', 'Контемпорари']
      });
    }
  }, [id, userId]);

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Группа не найдена</Text>
      </SafeAreaView>
    );
  }

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setIsConfirmationVisible(true);
  };

  const handleConfirmDelete = () => {
    console.log('Удаление студента:', studentToDelete.id);

    // Обновляем состояние группы, удаляя студента
    const updatedStudents = group.students.filter(s => s.id !== studentToDelete.id);
    setGroup({
      ...group,
      students: updatedStudents
    });

    setIsConfirmationVisible(false);
    setStudentToDelete(null);

    // Показываем уведомление
    Alert.alert(
      "Успешно",
      `Ученик ${studentToDelete.firstName} ${studentToDelete.lastName} удален из группы`,
      [{text: "OK"}]
    );
  };

  const handleTeacherPress = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherProfileVisible(true);
  };

  const handleLeaveGroup = () => {
    setIsLeaveConfirmVisible(true);
  };

  const confirmLeaveGroup = () => {
    console.log('Выход из группы:', id);
    
    // Обновляем состояние группы, удаляя текущего пользователя
    const updatedStudents = group.students.filter(s => s.id !== userId);
    setGroup({
      ...group,
      students: updatedStudents
    });
    
    setIsUserInGroup(false);
    setIsLeaveConfirmVisible(false);
    
    // Показываем уведомление
    Alert.alert(
      "Успешно",
      "Вы вышли из группы",
      [{text: "OK"}]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: group.name,
          headerTitleStyle: {
            fontSize: 20,
            fontFamily: 'os-regular',
          },
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о группе</Text>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>
              {group.students.length}/{group.maxStudentCapacity} учеников
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>Уровень: {group.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>
              Преподаватель: {group.teacher?.firstName} {group.teacher?.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="musical-notes-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>
              Стили танца: {group.danceStyles.join(', ')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>Описание: {group.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Преподаватели</Text>
          {group.teachers && group.teachers.length > 0 ? (
            group.teachers.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onPress={() => handleTeacherPress(teacher)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>Информация о преподавателях отсутствует</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ученики</Text>
          {group.students.length > 0 ? (
            group.students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onDelete={() => handleDeleteStudent(student)}
                isTeacher={role === "teacher"}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>В группе пока нет учеников</Text>
          )}
        </View>

        {isUserInGroup && role === "Student" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.leaveButton}
              onPress={handleLeaveGroup}
            >
              <Text style={styles.leaveButtonText}>Выйти из группы</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={isConfirmationVisible}
        onClose={() => setIsConfirmationVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Удалить ученика?"
        message={`Вы уверены, что хотите удалить ${studentToDelete?.firstName} ${studentToDelete?.lastName} из группы?`}
        confirmText="Удалить"
        cancelText="Отменить"
      />

      <ConfirmationModal
        visible={isLeaveConfirmVisible}
        onClose={() => setIsLeaveConfirmVisible(false)}
        onConfirm={confirmLeaveGroup}
        title="Выход из группы"
        message="Вы уверены, что хотите выйти из этой группы?"
        confirmText="Выйти"
        cancelText="Отменить"
      />

      <TeacherProfileModal
        visible={teacherProfileVisible}
        onClose={() => {
          setTeacherProfileVisible(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'os-bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  leaveButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'os-bold',
  }
});

export default GroupScreen;
