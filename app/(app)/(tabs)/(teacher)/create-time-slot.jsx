import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Stack, router} from 'expo-router';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format, parseISO} from 'date-fns';
import {Ionicons} from '@expo/vector-icons';

import {ConfirmationModal, SelectionModal} from '../../../../components';
import {apiRequest, handleApiError} from "../../../../util/apiService";
import {useSelector} from "react-redux";

// Дни недели
const weekDays = [
  {id: '0', name: 'Понедельник'},
  {id: '1', name: 'Вторник'},
  {id: '2', name: 'Среда'},
  {id: '3', name: 'Четверг'},
  {id: '4', name: 'Пятница'},
  {id: '5', name: 'Суббота'},
  {id: '6', name: 'Воскресенье'},
];

const timeToUTC = (timeStr) => {
  // Парсим строку в объект Date
  const date = new Date(timeStr);

  // Получаем время в UTC
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

  // Формируем строку в формате HH:mm:ss.SSSZ
  return `${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

const CreateTimeSlotScreen = () => {
  const id = useSelector(state => state.session.id);
  const defaultStartTime = new Date();
  defaultStartTime.setHours(10, 0, 0, 0);

  const defaultEndTime = new Date();
  defaultEndTime.setHours(11, 0, 0, 0);

  const [selectedWeekDay, setSelectedWeekDay] = useState(weekDays[0].id);
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);

  const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
  const [isWeekDayModalVisible, setIsWeekDayModalVisible] = useState(false);

  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const handleStartTimeConfirm = (time) => {
    setStartTime(time);
    setStartTimePickerVisible(false);

    // Если выбранное время начала больше времени окончания, 
    // установим время окончания на 1 час позже времени начала
    if (time >= endTime) {
      const newEndTime = new Date(time);
      newEndTime.setHours(time.getHours() + 1);
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeConfirm = (time) => {
    setEndTime(time);
    setEndTimePickerVisible(false);

    // Если выбранное время окончания меньше времени начала,
    // установим время начала на 1 час раньше времени окончания
    if (time <= endTime) {
      const newStartTime = new Date(time);
      newStartTime.setHours(time.getHours() - 1);
      setStartTime(newStartTime);
    }
  };

  const handleCreateTimeSlot = () => {
    setConfirmationVisible(true);
  };

  const handleConfirm = async () => {
    try {
      setConfirmationVisible(false);
      const creationResponse = await apiRequest({
        method: 'POST',
        url: '/slots/',
        data: {
          teacher_id: id,
          day_of_week: selectedWeekDay,
          start_time: timeToUTC(startTime),
          end_time: timeToUTC(endTime),
        },
      })
      Alert.alert("Создание слота", "Новый слот был успешно добавлен", [{text: "OK"}])
      router.back();
    } catch (error) {
      handleApiError(error)
    }
  };

  // Получение названия выбранного дня недели
  const getSelectedWeekDayName = () => {
    const day = weekDays.find(d => d.id === selectedWeekDay);
    return day ? day.name : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Создание свободного слота',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>День недели</Text>
          <TouchableOpacity
            style={styles.selectInput}
            onPress={() => setIsWeekDayModalVisible(true)}
          >
            <Text style={styles.selectText}>{getSelectedWeekDayName()}</Text>
            <Ionicons name="chevron-down" size={20} color="#666"/>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Время начала</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setStartTimePickerVisible(true)}
          >
            <Text style={styles.timeText}>{format(startTime, 'HH:mm')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Время окончания</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setEndTimePickerVisible(true)}
          >
            <Text style={styles.timeText}>{format(endTime, 'HH:mm')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateTimeSlot}
        >
          <Text style={styles.buttonText}>Добавить слот</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно выбора времени начала */}
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={() => setStartTimePickerVisible(false)}
        date={startTime}
        locale="ru"
        minuteInterval={5}
        pickerContainerStyleIOS={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        timePickerModeAndroid={"default"}
        cancelTextIOS={"Отменить"}
        confirmTextIOS={"Подтвердить"}
      />

      {/* Модальное окно выбора времени окончания */}
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={() => setEndTimePickerVisible(false)}
        date={endTime}
        locale="ru"
        minuteInterval={5}
        pickerContainerStyleIOS={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        timePickerModeAndroid={"default"}
        cancelTextIOS={"Отменить"}
        confirmTextIOS={"Подтвердить"}
      />

      {/* Модальное окно подтверждения */}
      <ConfirmationModal
        visible={confirmationVisible}
        onClose={() => setConfirmationVisible(false)}
        onConfirm={handleConfirm}
        title="Создание слота"
        message="Создать свободный временной слот с указанными параметрами?"
        confirmText="Создать"
        cancelText="Отменить"
      />

      {/* Модальное окно выбора дня недели */}
      <SelectionModal
        visible={isWeekDayModalVisible}
        onClose={() => setIsWeekDayModalVisible(false)}
        onSelect={setSelectedWeekDay}
        title="Выберите день недели"
        items={weekDays}
        selectedValue={selectedWeekDay}
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
  section: {
    marginBottom: 24,
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
  timeText: {
    fontSize: 18,
    fontFamily: 'os-regular',
    color: '#333',
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
});

export default CreateTimeSlotScreen;
