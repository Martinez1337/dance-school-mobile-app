import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import {Stack, router, useLocalSearchParams} from 'expo-router';
import {useDispatch, useSelector} from "react-redux";
import {Ionicons} from '@expo/vector-icons';

import {ConfirmationModal, StudentCard, TeacherCard, TeacherProfileModal} from '../../../../components';
import {apiRequest, handleApiError} from "../../../../util/apiService";
import {setSession} from "../../../../redux/slices/sessionSlice";
import {setUser} from "../../../../redux/slices/userSlice";
import {setLevel} from "../../../../redux/slices/levelSlice";

const fetchGroupInfo = async (id) => {
  try {
    console.log('group id', id);
    return await apiRequest({
      method: 'GET',
      url: `/groups/full-info/${id}`,
    })
  } catch (error) {
    handleApiError(error)
    router.back()
  }
}

const fetchUserInfo = async () => {
  try {
    const meResponse = await apiRequest({
      method: 'GET',
      url: '/auth/me'
    })
    console.log(`meResponse: ${JSON.stringify(meResponse)}`);
    return meResponse;
  } catch (error) {
    handleApiError(error)
  }
}

const deleteStudentFromGroup = async (groupId, studentId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/students/groups/${studentId}/${groupId}`
    })
  } catch (error) {
    handleApiError(error)
  }
}

const GroupScreen = () => {
  const dispatch = useDispatch();
  const {id} = useLocalSearchParams();
  const userRole = useSelector(state => state.session.role);
  const userId = useSelector(state => state.session.id);

  const [role, setRole] = useState(userRole);
  const [group, setGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isLeaveConfirmVisible, setIsLeaveConfirmVisible] = useState(false);

  useEffect(() => {
    setRole(userRole)
  }, [userRole])

  useEffect(() => {
    fetchGroupInfo(id)
      .then((response) => {
        setGroup(response)
        setIsLoading(false)
    });
  }, []);

  if (isLoading && !group) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </View>
    )
  }

  const isUserInGroup = group.students.some(student => student.id === userId)

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setIsConfirmationVisible(true);
  };

  const handleConfirmDelete = async () => {
    console.log('Удаление студента:', studentToDelete.id);

    setIsLoading(true)
    await deleteStudentFromGroup(group.id, studentToDelete.id)

    // Обновляем состояние группы, удаляя студента
    fetchGroupInfo(id)
      .then((response) => {
        setGroup(response)
        setIsLoading(false)
      });

    setIsConfirmationVisible(false);
    setStudentToDelete(null);

    // Показываем уведомление
    Alert.alert(
      "Успешно",
      `Ученик ${studentToDelete.user.first_name} ${studentToDelete.user.last_name} удален из группы`,
      [{text: "OK"}]
    );
  };

  const handleTeacherPress = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherProfileVisible(true);
  };

  const confirmLeaveGroup = async () => {
    console.log('Выход из группы:', id);

    setIsLoading(true)
    await deleteStudentFromGroup(group.id, userId)
    await fetchUserInfo()
      .then((response) => {
        dispatch(setSession(response))
        dispatch(setUser(response.user))
        if (response.level) {
          dispatch(setLevel(response.level))
        }
      })
    setIsLeaveConfirmVisible(false)

    // Показываем уведомление
    Alert.alert(
      "Успешно",
      "Вы вышли из группы",
      [{text: "OK"}]
    );
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: group?.name,
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
              {group.students?.length} / {group?.max_capacity} учеников
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={20} color="#666"/>
            <Text style={styles.infoText}>Уровень: {group.level.name}</Text>
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
          {group.students && group.students.length > 0 ? (
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

        {isUserInGroup && role === "student" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.leaveButton}
              onPress={() => setIsLeaveConfirmVisible(true)}
            >
              <Text style={styles.leaveButtonText}>Выйти из группы</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <ConfirmationModal
        visible={isConfirmationVisible}
        onClose={async () => await setIsConfirmationVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Удалить ученика?"
        message={`Вы уверены, что хотите удалить ${studentToDelete?.user.first_name} ${studentToDelete?.user.last_name} из группы?`}
        confirmText="Удалить"
        cancelText="Отменить"
      />

      <ConfirmationModal
        visible={isLeaveConfirmVisible}
        onClose={async () => await setIsLeaveConfirmVisible(false)}
        onConfirm={confirmLeaveGroup}
        title="Выход из группы"
        message="Вы уверены, что хотите выйти из этой группы?"
        confirmText="Выйти"
        cancelText="Отменить"
      />

      <TeacherProfileModal
        visible={teacherProfileVisible}
        onClose={async () => {
          await setTeacherProfileVisible(false);
          await setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
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
