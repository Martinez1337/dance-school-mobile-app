import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useSession } from '../../../../context/ctx';
import { ConfirmationModal, StudentCard } from '../../../../components';

import groups from '../../../../scratch-data/groups.json';
import users from '../../../../scratch-data/users.json';

const GroupScreen = () => {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [currentUserId, setCurrentUserId] = useState('db8754e3-efc5-4af0-9e72-0d96e5a3d523'); // Для теста используем ID учителя
  const { session } = useSession();
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    setIsTeacher(session === "Teacher");
  }, [session]);
  
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

      setGroup({
        ...foundGroup,
        students: studentsWithDetails
      });
    }
  }, [id]);

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
      [{ text: "OK" }]
    );
  };

  const handleStudentPress = (student) => {
    console.log('Переход на профиль студента:', student.id);
    router.push(`/profile/${student.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: group.name,
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о группе</Text>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              {group.students.length}/{group.maxStudentCapacity} учеников
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Уровень: {group.level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <Text style={styles.infoText}>
              Преподаватель: {group.teacher.firstName} {group.teacher.lastName}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color="#666" />
            <Text style={styles.infoText}>Описание: {group.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ученики</Text>
          {group.students.length > 0 ? (
            group.students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onPress={() => handleStudentPress(student)}
                onDelete={() => handleDeleteStudent(student)}
                isTeacher={isTeacher}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>В группе пока нет учеников</Text>
          )}
        </View>
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
  }
});

export default GroupScreen;
