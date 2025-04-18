import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

import { ConfirmationModal, SelectionModal } from '../../../../components';
import users from '../../../../scratch-data/users.json';

const mockRequest = {
  id: '1',
  student: users.find(user => user.role === 'Student'),
  startTime: '2024-03-20T14:00:00.000Z',
  finishTime: '2024-03-20T15:00:00.000Z',
  danceStyle: 'Бальные танцы',
  status: 'pending',
};

const halls = [
  { id: '1', name: 'Зал 1', available: true },
  { id: '2', name: 'Зал 2', available: true },
  { id: '3', name: 'Зал 3', available: false },
];

const LessonRequestScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedHall, setSelectedHall] = useState(null);
  const [allowNeighbors, setAllowNeighbors] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [isHallModalVisible, setIsHallModalVisible] = useState(false);

  const availableHalls = halls.filter(hall => hall.available);

  const handleAction = (type) => {
    setActionType(type);
    setConfirmationVisible(true);
  };

  const handleConfirm = () => {
    setConfirmationVisible(false);
    if (actionType === 'accept' && !selectedHall) {
      return;
    }
    router.back();
  };

  const getSelectedHallName = () => {
    const hall = halls.find(h => h.id === selectedHall);
    return hall ? hall.name : 'Выберите зал';
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
            source={{ uri: mockRequest.student.photo }}
            style={styles.studentPhoto}
          />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>
              {mockRequest.student.lastName} {mockRequest.student.firstName} {mockRequest.student.middleName}
            </Text>
            <Text style={styles.studentLevel}>
              Уровень: {mockRequest.student.level}
            </Text>
            <Text style={styles.contactInfo}>
              {mockRequest.student.phoneNumber}
            </Text>
            <Text style={styles.contactInfo}>
              {mockRequest.student.email}
            </Text>
          </View>
        </View>

        <View style={styles.lessonInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="musical-notes-outline" size={24} color="#666" />
            <Text style={styles.infoText}>{mockRequest.danceStyle}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={24} color="#666" />
            <Text style={styles.infoText}>
              {format(parseISO(mockRequest.startTime), 'd MMMM, HH:mm', { locale: ru })} -
              {format(parseISO(mockRequest.finishTime), ' HH:mm', { locale: ru })}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Доступный зал</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsHallModalVisible(true)}
          >
            <Text style={styles.selectText}>{getSelectedHallName()}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.neighborsToggle}
          onPress={() => setAllowNeighbors(!allowNeighbors)}
        >
          <View style={[styles.checkbox, allowNeighbors && styles.checkboxChecked]}>
            {allowNeighbors && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={styles.neighborsText}>
            Согласен на присутствие других учеников в зале
          </Text>
        </TouchableOpacity>
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
            (!selectedHall || !allowNeighbors) && styles.buttonDisabled
          ]}
          onPress={() => handleAction('accept')}
          disabled={!selectedHall || !allowNeighbors}
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
      />

      <SelectionModal
        visible={isHallModalVisible}
        onClose={() => setIsHallModalVisible(false)}
        onSelect={setSelectedHall}
        title="Выберите зал"
        items={availableHalls}
        selectedValue={selectedHall}
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

