import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CustomCalendar, SlotCard, TeacherFilterModal, ConfirmationModal, TeacherProfileModal } from '../../../../components';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import users from '../../../../scratch-data/users.json';

const slotsData = [
  {
    id: 1,
    startTime: '2025-03-21T10:00:00.000Z',
    endTime: '2025-03-21T11:00:00.000Z',
    danceType: 'Хип-хоп',
    teacherName: 'Сергей Иванов',
    teacherImage: { uri: 'https://randomuser.me/api/portraits/men/12.jpg' },
  },
  {
    id: 2,
    startTime: '2025-03-22T12:00:00.000Z',
    endTime: '2025-03-22T13:00:00.000Z',
    danceType: 'Бальные танцы',
    teacherName: 'Екатерина Власова',
    teacherImage: { uri: 'https://randomuser.me/api/portraits/women/12.jpg' },
  },
  {
    id: 3,
    startTime: '2025-03-20T14:00:00.000Z',
    endTime: '2025-03-20T15:00:00.000Z',
    danceType: 'Контемпорари',
    teacherName: 'Андрей Павлов',
    teacherImage: { uri: 'https://randomuser.me/api/portraits/men/15.jpg' },
  },
  {
    id: 4,
    startTime: '2025-03-21T16:00:00.000Z',
    endTime: '2025-03-21T17:00:00.000Z',
    danceType: 'Контемпорари',
    teacherName: 'Андрей Павлов',
    teacherImage: { uri: 'https://randomuser.me/api/portraits/men/15.jpg' },
  },
  {
    id: 5,
    startTime: '2025-03-22T18:00:00.000Z',
    endTime: '2025-03-22T19:00:00.000Z',
    danceType: 'Контемпорари',
    teacherName: 'Андрей Павлов',
    teacherImage: { uri: 'https://randomuser.me/api/portraits/men/15.jpg' },
  },
];

const teachers = users.filter(user => user.role === 'Teacher');

export default function ScheduleSlots() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [selectedTeacherData, setSelectedTeacherData] = useState(null);

  useEffect(() => {
    const marks = {};
    slotsData.forEach(slot => {
      const date = format(parseISO(slot.startTime), 'yyyy-MM-dd', { locale: ru });
      if (isAfter(parseISO(slot.startTime), new Date())) {
        marks[date] = { marked: true, dotColor: '#d903e4' };
      }
    });
    setMarkedDates(marks);
  }, [slotsData]);

  const filteredSlots = slotsData.filter(slot =>
    format(parseISO(slot.startTime), 'yyyy-MM-dd') === selectedDate &&
    (selectedTeachers.length === 0 || selectedTeachers.includes(slot.teacherName))
  );

  const toggleTeacherSelection = (teacher) => {
    setSelectedTeachers(prev =>
      prev.includes(teacher) ? prev.filter(t => t !== teacher) : [...prev, teacher]
    );
  };

  const handleTeacherPress = (teacherId) => {
    const teacher = users.find(u => u.id === teacherId);
    if (!teacher) return;
    setSelectedTeacherData(teacher);
    setTeacherProfileVisible(true);
    setFilterModalVisible(false);
  };

  const handleConfirmSlot = () => {
    setModalVisible(false);
    // Логика подачи заявки
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setFilterModalVisible(true)} 
              style={styles.headerButton}
            >
              <Ionicons 
                name={selectedTeachers.length > 0 ? "filter" : "filter-outline"} 
                size={24} 
                color={selectedTeachers.length > 0 ? "#d903e4" : "black"} 
              />
              {selectedTeachers.length > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{selectedTeachers.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <CustomCalendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        markedDates={markedDates}
      />
      
      {filteredSlots.length > 0 ? (
        <FlashList
          data={filteredSlots}
          renderItem={({ item }) => (
            <SlotCard item={item} selectedSlot={selectedSlot} setSelectedSlot={setSelectedSlot} />
          )}
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={100}
        />
      ) : (
        <Text style={styles.noSlotsText}>Нет доступных слотов</Text>
      )}
    
      <TouchableOpacity
        style={[styles.applyButton, !selectedSlot && styles.disabledButton]}
        onPress={() => setModalVisible(true)}
        disabled={!selectedSlot}
      >
        <Text style={styles.applyButtonText}>Подать заявку</Text>
      </TouchableOpacity>

      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSlot}
        title="Подать заявку"
        message="Вы уверены, что хотите подать заявку на данный слот?"
        confirmText="Да"
        cancelText="Нет"
      />

      <TeacherFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        teachers={teachers}
        selectedTeachers={selectedTeachers}
        onTeacherSelect={toggleTeacherSelection}
        onTeacherPress={handleTeacherPress}
        onReset={() => setSelectedTeachers([])}
      />

      <TeacherProfileModal
        visible={teacherProfileVisible}
        onClose={() => setTeacherProfileVisible(false)}
        teacher={selectedTeacherData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  applyButton: {
    backgroundColor: '#000',
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "os-bold",
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  noSlotsText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    fontFamily: "os-regular",
    color: '#333',
  },
  headerButton: {
    marginRight: 16,
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
