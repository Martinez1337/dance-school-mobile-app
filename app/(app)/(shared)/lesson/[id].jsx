import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import {useLocalSearchParams, router, Stack, useFocusEffect} from 'expo-router';
import React, {useCallback, useEffect, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Ionicons} from '@expo/vector-icons';
import {format, parseISO} from 'date-fns';
import {useSelector} from "react-redux";
import {ru} from 'date-fns/locale';

import {
  TeacherCard,
  TeacherProfileModal,
  ConfirmationModal,
  SubscriptionSelectionModal,
  StudentCard
} from '../../../../components';
import {apiRequest, handleApiError} from "../../../../util/apiService";

const parseTime = (timeData) => format(parseISO(timeData), 'HH:mm', {locale: ru});

const fetchLesson = async (id) => {
  try {
    return await apiRequest({
      method: 'GET',
      url: `/lessons/full-info/${id}`,
    })
  } catch (error) {
    handleApiError(error)
    router.back()
  }
}

const cancelLesson = async (subId, lessonId) => {
  try {
    return await apiRequest({
      method: 'PATCH',
      url: `/subscriptions/lessons/cancel/${subId}/${lessonId}`,
    })
  } catch (error) {
    handleApiError(error)
  }
}

const joinLesson = async (subId, lessonId) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: `/subscriptions/lessons/${subId}/${lessonId}`,
    })

    return !!response
  } catch (error) {
    handleApiError(error)
    return false;
  }
}



const LessonScreen = () => {
  const {id} = useLocalSearchParams();

  const userSession = useSelector(state => state.session);
  const [role, setRole] = useState(userSession.role);

  const [isLoading, setIsLoading] = useState(true)
  const [lessonData, setLessonData] = useState(null);
  const [isStudentsExpanded, setIsStudentsExpanded] = useState(false);

  const [hasValidSubscription, setHasValidSubscription] = useState(false);
  const [isStudentInGroup, setIsStudentInGroup] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

  useEffect(() => {
    setRole(userSession.role);
  }, [userSession])

  useFocusEffect(useCallback(() => {
    console.log(id)
    fetchLesson(id)
      .then((result) => {
        setLessonData(result)
        setIsLoading(false)
      })
  }, []))

  useEffect(() => {
    if (!lessonData) {
      return;
    }

    if (lessonData.group && role === "student") {
      const isCurrentStudentParticipating = lessonData.actual_students
        ?.some(student => student.id === userSession.id)
      const hasSubscription = lessonData.fitting_subscriptions?.length > 0;
      const isCurrentStudentInGroup = lessonData.group.students?.some(student => student.id === userSession.id)

      setIsParticipating(isCurrentStudentParticipating)
      setHasValidSubscription(hasSubscription)
      setIsStudentInGroup(isCurrentStudentInGroup)
    }
  }, [lessonData])

  if (isLoading && !lessonData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </View>
    )
  }

  const handleGoToSubscriptions = () => {
    router.push('/(app)/(shared)/subscriptions');
  };
  
  const handleGoToGroup = () => {
    if (lessonData.group) {
      router.push(`/group/${lessonData.group.id}`);
    }
  };
  
  const handleSelectSubscription = async (subscription) => {
    const success = await joinLesson(subscription.id, lessonData.id);
    if (success) {
      Alert.alert(
        "Участие подтверждено",
        `Вы будете участвовать в занятии используя выбранный абонемент`,
        [{ text: "ОК" }]
      );
      fetchLesson(id).then((result) => setLessonData(result))
    } else {
      Alert.alert(
        "Ошибка",
        `Не удалось записаться на занятия используя выбранный абонемент`,
        [{ text: "ОК" }]
      );
    }
  };

  const handleCancelLesson = async () => {
    console.log('Cancelling lesson for group:', lessonData.group.id);
    setCancelModalVisible(false);
    await cancelLesson(lessonData.used_subscription?.id, lessonData.id);
    Alert.alert(
      "Участие отменено",
      `Вы отменили участие в занятии с использованием выбранного абонемента`,
      [{ text: "ОК" }]
    );
    fetchLesson(id).then((result) => setLessonData(result))
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 20, paddingTop: 5}}
    >
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
          <Text style={styles.value}>
            {
              lessonData.lesson_type.is_group ? "Групповое занятие" : "Индивидуальное занятие"
            }
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Стиль танца:</Text>
          <Text style={styles.value}>{lessonData.lesson_type.dance_style.name}</Text>
        </View>

        {lessonData.lesson_type.is_group && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Уровень:</Text>
              <Text style={styles.value}>{lessonData.group.level.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Участники:</Text>
              <Text style={styles.value}>
                {lessonData.actual_students?.length} / {lessonData.group.max_capacity}
              </Text>
            </View>
          </>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Время:</Text>
          <Text style={styles.value}>
            {`${parseTime(lessonData?.start_time)} - ${parseTime(lessonData?.finish_time)}`}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Зал:</Text>
          <View style={styles.groupNameContainer}>
            <Text style={styles.value}>
              {lessonData.classroom?.name}
            </Text>
            {
              lessonData.are_neighbours_allowed &&
              <Ionicons name="person-add-outline" size={20} color="black" />
            }
          </View>
        </View>
      </View>

      {isParticipating && (
        <View style={styles.participatingContainer}>
          <View style={styles.participatingHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.participatingText}>Вы будете участвовать в занятии</Text>
          </View>
          {lessonData.used_subscription && (
            <Text style={styles.participatingDetails}>
              Абонемент: {lessonData.used_subscription.subscription_template?.name}
            </Text>
          )}
        </View>
      )}

      {lessonData.lesson_type.is_group && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Информация о группе</Text>
          <TouchableOpacity style={styles.groupCard} onPress={handleGoToGroup}>
            <View style={styles.groupCardHeader}>
              <Ionicons name="people" size={24} color="#d903e4" />
              <Text style={styles.groupName}>{lessonData.group.name}</Text>
            </View>
            <Text style={styles.groupDescription}>
              {lessonData.group.description || 'Нет описания'}
            </Text>
            <View style={styles.groupCardFooter}>
              <Text style={styles.groupMeta}>
                Участники: {lessonData.group.students.length} / {lessonData.group.max_capacity}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      )}

      {lessonData.lesson_type.is_group && !isParticipating && !hasValidSubscription && role === 'student' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGoToSubscriptions}
          >
            <Text style={styles.buttonText}>Приобрести абонемент</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Преподаватели</Text>
        <View style={{flex: 1}}>
          <FlashList
            data={lessonData.actual_teachers}
            renderItem={({item}) => (
              <TeacherCard
                teacher={item}
                onPress={() => {
                  setSelectedTeacher(item);
                  setTeacherProfileVisible(true)
                }}/>
            )}
            estimatedItemSize={150}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
        <TeacherProfileModal
          visible={teacherProfileVisible}
          onClose={async () => {
            await setTeacherProfileVisible(false)
            await setSelectedTeacher(null)
          }}
          teacher={selectedTeacher}
        />
      </View>

      <View style={styles.section}>
        <View style={[styles.accordionHeader, isStudentsExpanded && styles.accordionHeaderExpanded]}>
          <Text style={styles.sectionTitle}>Участники занятия</Text>
          <TouchableOpacity onPress={() => setIsStudentsExpanded(!isStudentsExpanded)}>
            <Ionicons
              name={isStudentsExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {isStudentsExpanded && (
          <View style={styles.studentsList}>
            {lessonData.actual_students && lessonData.actual_students.length > 0 ? (
              lessonData.actual_students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  isTeacher={false}
                />
              ))
            ) : (
              <Text style={styles.noStudentsText}>
                Пока никто не записался на это занятие
              </Text>
            )}
          </View>
        )}
      </View>

      {lessonData.lesson_type.is_group && isStudentInGroup && !isParticipating && role === 'student' && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.participateButton}
            onPress={() => setSubscriptionModalVisible(true)}
          >
            <Text style={styles.buttonText}>Буду участвовать</Text>
          </TouchableOpacity>
        </View>
      )}

      {isParticipating && isStudentInGroup && role === 'student' && (
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
        onClose={async () => await setCancelModalVisible(false)}
        onConfirm={handleCancelLesson}
        title="Отмена занятия"
        message="Вы уверены, что хотите отменить это занятие?"
        confirmText="Да, отменить"
        cancelText="Нет, вернуться"
      />

      <SubscriptionSelectionModal
        visible={subscriptionModalVisible}
        onClose={() => setSubscriptionModalVisible(false)}
        onSelect={handleSelectSubscription}
        title="Выберите абонемент для занятия"
        subscriptions={lessonData.fitting_subscriptions}
      />
    </ScrollView>
  );
}

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
  section: {
    flex: 1,
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
  groupNameContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  participateButton: {
    backgroundColor: '#4CAF50',
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
  groupCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eeeeee',
  },
  groupCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginLeft: 8,
    flex: 1,
  },
  groupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontFamily: 'os-regular',
  },
  groupCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupMeta: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'os-regular',
  },
  participatingContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  participatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participatingText: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  participatingDetails: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
    marginLeft: 32,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderExpanded: {
    marginBottom: 16
  },
  studentsList: {
    marginTop: 8,
  },
  noStudentsText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'os-regular',
    textAlign: 'center',
  },
});

export default LessonScreen;
