import {View, Text, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import {useLocalSearchParams, useRouter, Stack} from 'expo-router';
import {useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Ionicons} from '@expo/vector-icons';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';

import lessons from '../../../../scratch-data/lessons.json';
import users from '../../../../scratch-data/users.json';
import groups from '../../../../scratch-data/groups.json';
import classrooms from '../../../../scratch-data/classrooms.json';
import subscriptions from '../../../../scratch-data/subscriptions.json';
import {TeacherCard, TeacherProfileModal, ConfirmationModal} from '../../../../components';
import {useSelector} from "react-redux";

const parseTime = (timeData) => format(parseISO(timeData), 'HH:mm', {locale: ru})

export default function LessonScreen() {
  const router = useRouter();
  const {id} = useLocalSearchParams();

  const userRole = useSelector(state => state.session.role);
  const [role, setRole] = useState(userRole);

  const [lessonData, setLessonData] = useState(null);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [hasValidSubscription, setHasValidSubscription] = useState(false);
  const [isStudentInGroup, setIsStudentInGroup] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);

  const currentUserId = 'e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a';

  useEffect(() => {
    setRole(userRole);
  }, [userRole])

  useEffect(() => {
    const lesson = lessons.find(l => l.id === Number(id));
    if (!lesson) {
      router.back();
      return;
    }

    const group = lesson.groupId ? groups.find(g => g.id === lesson.groupId) : null;
    const classroom = classrooms.find(c => c.id === lesson.classroomId);
    const teachers = Array.isArray(lesson.teacherId)
      ? lesson.teacherId.map(tid => users.find(u => u.id === tid)).filter(Boolean)
      : [users.find(u => u.id === lesson.teacherId)].filter(Boolean);

    // Проверяем наличие действующего абонемента
    const userSubscriptions = subscriptions.filter(s => s.userId === currentUserId);
    const hasValid = userSubscriptions.some(sub => {
      const now = new Date();
      const endDate = parseISO(sub.endTime);
      return endDate > now && !sub.terminated;
    });
    setHasValidSubscription(hasValid);

    // Проверяем, числится ли студент в группе
    const studentInGroup = group?.students?.some(studentId => studentId === currentUserId) || false;
    setIsStudentInGroup(studentInGroup);

    setLessonData({
      ...lesson,
      group,
      classroom,
      teachers,
      hasNeighbors: classroom?.hasNeighbors || false,
      currentStudents: group?.students?.length || 0,
      maxStudents: group?.maxStudentCapacity || 0,
    });
  }, [id]);

  if (!lessonData) {
    return null;
  }

  const showJoinButton =
    lessonData.group &&
    lessonData.currentStudents < lessonData.maxStudents &&
    role === "Student" &&
    !isStudentInGroup;

  const showCancelButton =
    lessonData.group &&
    role === "Student" &&
    isStudentInGroup;

  const handleJoinGroup = () => {
    console.log('Joining group:', lessonData.group.id);
  };

  const handleCancelLesson = () => {
    console.log('Cancelling lesson for group:', lessonData.group.id);
    setCancelModalVisible(false);
    // Здесь будет логика отмены занятия
  };

  const handleGoToSubscriptions = () => {
    router.push('/(app)/(shared)/subscriptions');
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Информация о занятии",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.section}>
        <Text style={styles.title}>{lessonData.name}</Text>
        <Text style={styles.description}>{lessonData.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Тип занятия:</Text>
          <Text style={styles.value}>{lessonData.lessonType}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Стиль танца:</Text>
          <Text style={styles.value}>{lessonData.danceType}</Text>
        </View>

        {lessonData.group && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Уровень:</Text>
              <Text style={styles.value}>{lessonData.group.level}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Группа:</Text>
              <Text style={styles.value}>{lessonData.group.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Участники:</Text>
              <Text style={styles.value}>
                {lessonData.currentStudents} / {lessonData.maxStudents}
              </Text>
            </View>
          </>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Время:</Text>
          <Text style={styles.value}>
            {`${parseTime(lessonData.startTime)} - ${parseTime(lessonData.finishTime)}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Зал:</Text>
          <Text style={styles.value}>
            {lessonData.classroom.name}
            {lessonData.hasNeighbors && ' 👥'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Преподаватели</Text>
        <FlashList
          data={lessonData.teachers}
          renderItem={({item}) => (
            <TeacherCard
              teacher={item}
              onPress={() => {
                setSelectedTeacher(item);
                setTeacherProfileVisible(true)
              }}/>
          )}
          estimatedItemSize={100}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
        <TeacherProfileModal
          visible={teacherProfileVisible}
          onClose={() => {
            setTeacherProfileVisible(false)
            setSelectedTeacher(null)
          }}
          teacher={selectedTeacher}
        />
      </View>

      {showJoinButton && (
        <View style={styles.buttonContainer}>
          {hasValidSubscription ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleJoinGroup}
            >
              <Text style={styles.buttonText}>Вступить в группу</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handleGoToSubscriptions}
            >
              <Text style={styles.buttonText}>Приобрести абонемент</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {showCancelButton && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setCancelModalVisible(true)}
          >
            <Text style={styles.buttonText}>Отменить занятие</Text>
          </TouchableOpacity>
        </View>
      )}

      <ConfirmationModal
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={handleCancelLesson}
        title="Отмена занятия"
        message="Вы уверены, что хотите отменить это занятие? Это действие нельзя будет отменить."
        confirmText="Да, отменить"
        cancelText="Нет, вернуться"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'os-bold',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontFamily: 'os-regular',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'os-regular',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'os-regular',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'os-bold',
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    backgroundColor: '#d903e4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'os-bold',
  },
});
