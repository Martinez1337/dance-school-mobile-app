import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView} from 'react-native';
import {Image} from 'expo-image';
import {Stack, useLocalSearchParams, router, Link} from 'expo-router';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';
import {Ionicons} from '@expo/vector-icons';

import {ConfirmationModal, SelectionModal} from '../../../../components';
import {apiRequest, handleApiError} from "../../../../util/apiService";

const fetchClassrooms = async (startDate, endDate, allowNeighbors) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/classrooms/search/available',
      data: {
        date_from: startDate.toISOString(),
        date_to: endDate.toISOString(),
        are_neighbours_allowed: allowNeighbors,
        terminated: false
      },
    })
  } catch (error) {
    handleApiError(error)
  }
};

const LessonRequestScreen = () => {
  const params = useLocalSearchParams();
  const requestData = JSON.parse(params.request);
  const student = requestData.actual_students[0];

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isClassroomModalVisible, setIsClassroomModalVisible] = useState(false);
  const [classroomList, setClassroomList] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    fetchClassrooms(
      new Date(parseISO(requestData.start_time)),
      new Date(parseISO(requestData.finish_time)),
      requestData.are_neighbours_allowed
    ).then((response) => setClassroomList(response.classrooms))
  }, []);

  const handleAction = (type) => {
    setActionType(type);
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    setConfirmationVisible(false);
    if (actionType === 'accept' && !selectedClassroom) {
      return;
    }

    try {
      await apiRequest({
        method: 'PATCH',
        url: `/lessons/request/${requestData.id}`,
        data: actionType === 'accept' ? {
          is_confirmed: true,
          classroom_id: selectedClassroom
        } : {
          is_confirmed: false,
        }
      })
    } catch (error) {
      handleApiError(error);
    }

    router.back();
  };

  const getSelectedHallName = () => {
    const classroom = classroomList?.find(c => c.id === selectedClassroom);
    return classroom ? classroom.name : 'Выберите зал';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Заявка на занятие',
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.studentInfo}>
          <Image
            source={{uri: student.photo}}
            style={styles.studentPhoto}
            placeholder={require("../../../../assets/images/user-profile-placeholder.jpg")}
            contentFit={'cover'}
            placeholderContentFit={"cover"}
          />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>
              {student.user.last_name} {student.user.first_name} {student.user.middle_name}
            </Text>
            <Text style={styles.studentLevel}>
              Уровень: {student.level.name}
            </Text>
            <Text style={styles.contactInfo}>
              {student.user.phone_number}
            </Text>
            <Text style={styles.contactInfo}>
              {student.user.email}
            </Text>
          </View>
        </View>

        <View style={styles.lessonInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={24} color="#666"/>
            <Text style={styles.infoText}>{requestData.lesson_type.dance_style.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={24} color="#666"/>
            <Text style={styles.infoText}>
              {format(parseISO(requestData.start_time), 'd MMMM, HH:mm', {locale: ru})} -
              {format(parseISO(requestData.finish_time), ' HH:mm', {locale: ru})}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="chatbubble-outline" size={24} color="#666"/>
            {
              student.user.messenger_url
                ? <Link style={[styles.infoText, {color: "#4484f5"}]} href={student.user.messenger_url}>{student.user.messenger_url}</Link>
                : <Text style={styles.infoText}>Не указано</Text>
            }
          </View>
        </View>

        <Text style={styles.sectionTitle}>Доступный зал</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsClassroomModalVisible(true)}
          >
            <Text style={styles.selectText}>{getSelectedHallName()}</Text>
            <Ionicons name="chevron-down" size={20} color="#666"/>
          </TouchableOpacity>
        </View>

      {/*  <TouchableOpacity*/}
      {/*    style={styles.neighborsToggle}*/}
      {/*    onPress={() => setAllowNeighbors(!allowNeighbors)}*/}
      {/*  >*/}
      {/*    <View style={[styles.checkbox, allowNeighbors && styles.checkboxChecked]}>*/}
      {/*      {allowNeighbors && <Ionicons name="checkmark" size={16} color="#fff"/>}*/}
      {/*    </View>*/}
      {/*    <Text style={styles.neighborsText}>*/}
      {/*      Согласен на присутствие других учеников в зале*/}
      {/*    </Text>*/}
      {/*  </TouchableOpacity>*/}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => handleAction('reject')}
        >
          <Text style={[styles.buttonText, styles.rejectButtonText]}>Отклонить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.acceptButton,
            (!selectedClassroom) && styles.buttonDisabled
          ]}
          onPress={() => handleAction('accept')}
          disabled={!selectedClassroom}
        >
          <Text style={styles.buttonText}>Принять</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={confirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        onConfirm={handleConfirm}
        title={actionType === 'accept' ? 'Принять заявку?' : 'Отклонить заявку?'}
        message={actionType === 'accept'
          ? 'Вы уверены, что хотите принять эту заявку?'
          : 'Вы уверены, что хотите отклонить эту заявку?'
        }
        confirmText={actionType === 'accept' ? 'Принять' : 'Отклонить'}
        cancelText={'Отмена'}
      />

      <SelectionModal
        visible={isClassroomModalVisible}
        onClose={() => setIsClassroomModalVisible(false)}
        onSelect={setSelectedClassroom}
        title="Выберите зал"
        items={classroomList}
        selectedValue={selectedClassroom}
        labelExtractor={(item) => item.name}
        valueExtractor={(item) => item.id}
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
  studentInfo: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  studentPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  studentDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginBottom: 4,
  },
  studentLevel: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#666',
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
    marginBottom: 2,
  },
  lessonInfo: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    marginLeft: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
  },
  neighborsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginLeft: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d903e4',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#d903e4',
  },
  neighborsText: {
    fontSize: 14,
    fontFamily: 'os-regular',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  rejectButton: {
    marginRight: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  acceptButton: {
    backgroundColor: '#d903e4',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#fff',
  },
  rejectButtonText: {
    color: '#ff3b30',
  },
});

export default LessonRequestScreen;
