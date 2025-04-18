import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

import { ConfirmationModal, SelectionModal } from '../../../../components';
import users from '../../../../scratch-data/users.json';

// Упрощенный массив студентов для тестирования
const simpleStudents = users
  .filter(user => user.role === 'Student')
  .map((user, index) => ({
    id: String(index + 1),
    firstName: user.firstName,
    lastName: user.lastName,
    middleName: user.middleName,
  }));

// Временные данные для демонстрации
const danceStyles = [
  'Бальные танцы',
  'Хип-хоп',
  'Современные танцы',
  'Контемпорари',
  'Латиноамериканские танцы'
];

const halls = [
  { id: '1', name: 'Зал 1' },
  { id: '2', name: 'Зал 2' },
  { id: '3', name: 'Зал 3' },
];

const CreateIndividualLessonScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

  const [selectedHall, setSelectedHall] = useState(halls[0].id);
  const [allowNeighbors, setAllowNeighbors] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(simpleStudents[0]?.id || '');
  const [selectedDanceStyle, setSelectedDanceStyle] = useState(danceStyles[0]);
  const [description, setDescription] = useState('');

  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [isHallModalVisible, setIsHallModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isDanceStyleModalVisible, setIsDanceStyleModalVisible] = useState(false);

  useEffect(() => {
    // Установим начальное значение студента после загрузки компонента
    if (simpleStudents.length > 0) {
      setSelectedStudent(String(simpleStudents[0].id));
    }
  }, []);

  const handleStartDateConfirm = (date) => {
    const newStartDate = new Date(date);
    newStartDate.setHours(startDate.getHours(), startDate.getMinutes());
    setStartDate(newStartDate);
    setStartDatePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    const newStartDate = new Date(startDate);
    newStartDate.setHours(time.getHours(), time.getMinutes());
    setStartDate(newStartDate);
    setStartTimePickerVisible(false);

    const newEndDate = new Date(newStartDate);
    newEndDate.setHours(newStartDate.getHours() + 1);
    setEndDate(newEndDate);
  };

  const handleEndDateConfirm = (date) => {
    const newEndDate = new Date(date);
    newEndDate.setHours(endDate.getHours(), endDate.getMinutes());
    setEndDate(newEndDate);
    setEndDatePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    const newEndDate = new Date(endDate);
    newEndDate.setHours(time.getHours(), time.getMinutes());
    setEndDate(newEndDate);
    setEndTimePickerVisible(false);
  };

  const handleCreateLesson = () => {
    setConfirmationVisible(true);
  };

  const handleConfirm = () => {
    setConfirmationVisible(false);
    console.log({
      startDate,
      endDate,
      hallId: selectedHall,
      studentId: selectedStudent,
      danceStyle: selectedDanceStyle,
      description
    });
    router.back();
  };

  // Получение названия выбранного зала
  const getSelectedHallName = () => {
    const hall = halls.find(h => h.id === selectedHall);
    return hall ? hall.name : '';
  };

  // Получение имени выбранного студента
  const getSelectedStudentName = () => {
    const student = simpleStudents.find(s => s.id === selectedStudent);
    if (!student) return 'Выберите ученика';
    return `${student.lastName} ${student.firstName} ${student.middleName || ''}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Создание индивидуального занятия',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Время занятия</Text>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Дата начала</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setStartDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>{format(startDate, 'dd.MM.yyyy', { locale: ru })}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Время начала</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setStartTimePickerVisible(true)}
              >
                <Text style={styles.dateText}>{format(startDate, 'HH:mm')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Дата окончания</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setEndDatePickerVisible(true)}
              >
                <Text style={styles.dateText}>{format(endDate, 'dd.MM.yyyy', { locale: ru })}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeColumn}>
              <Text style={styles.label}>Время окончания</Text>
              <TouchableOpacity
                style={styles.input}
                onPress={() => setEndTimePickerVisible(true)}
              >
                <Text style={styles.dateText}>{format(endDate, 'HH:mm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Зал</Text>
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

        <View style={styles.section}>
          <Text style={styles.label}>Ученик</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsStudentModalVisible(true)}
          >
            <Text style={styles.selectText}>{getSelectedStudentName()}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Вид танца</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsDanceStyleModalVisible(true)}
          >
            <Text style={styles.selectText}>{selectedDanceStyle}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Описание</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            placeholder="Введите описание занятия"
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateLesson}
        >
          <Text style={styles.buttonText}>Создать занятие</Text>
        </TouchableOpacity>
      </View>

      {/* Модальные окна для выбора даты и времени */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleStartDateConfirm}
        onCancel={() => setStartDatePickerVisible(false)}
        date={startDate}
        locale="ru"
      />

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={() => setStartTimePickerVisible(false)}
        date={startDate}
        locale="ru"
      />

      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleEndDateConfirm}
        onCancel={() => setEndDatePickerVisible(false)}
        date={endDate}
        locale="ru"
        minimumDate={startDate}
      />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={() => setEndTimePickerVisible(false)}
        date={endDate}
        locale="ru"
      />

      {/* Модальное окно подтверждения */}
      <ConfirmationModal
        visible={confirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        onConfirm={handleConfirm}
        title="Создать занятие?"
        message="Вы уверены, что хотите создать индивидуальное занятие с указанными параметрами?"
        confirmText="Создать"
        cancelText="Отменить"
      />

      {/* Модальное окно выбора зала */}
      <SelectionModal
        visible={isHallModalVisible}
        onClose={() => setIsHallModalVisible(false)}
        onSelect={setSelectedHall}
        title="Выберите зал"
        items={halls}
        selectedValue={selectedHall}
        labelExtractor={(item) => item.name}
        valueExtractor={(item) => item.id}
      />

      {/* Модальное окно выбора ученика */}
      <SelectionModal
        visible={isStudentModalVisible}
        onClose={() => setIsStudentModalVisible(false)}
        onSelect={setSelectedStudent}
        title="Выберите ученика"
        items={simpleStudents}
        selectedValue={selectedStudent}
        labelExtractor={(item) => `${item.lastName} ${item.firstName} ${item.middleName || ''}`}
        valueExtractor={(item) => item.id}
      />

      {/* Модальное окно выбора вида танца */}
      <SelectionModal
        visible={isDanceStyleModalVisible}
        onClose={() => setIsDanceStyleModalVisible(false)}
        onSelect={setSelectedDanceStyle}
        title="Выберите вид танца"
        items={danceStyles}
        selectedValue={selectedDanceStyle}
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
    marginBottom: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeColumn: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontFamily: 'os-regular',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#d903e4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 18,
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
  }
});

export default CreateIndividualLessonScreen;
