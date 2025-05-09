import {SafeAreaView, Text, StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {format, isAfter, parseISO} from 'date-fns';
import {formatInTimeZone} from "date-fns-tz";
import {ru} from 'date-fns/locale';
import {FlashList} from '@shopify/flash-list';
import {Stack, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

import {
  CustomCalendar,
  SlotCard,
  TeacherFilterModal,
  ConfirmationModal,
  TeacherProfileModal,
  SlotInfoModal
} from '../../../../components';
import {apiRequest, createPaginatedFetcher, handleApiError} from "../../../../util/apiService";
import {getDatesMonthInterval} from "../../../../util/dates";
import {usePaginatedData} from "../../../../util/hooks";
import {globalStyles} from "../../../../styles/globalStyles";

const fetchSlots = async (date, teachers, lessonTypeId) => {
  const {dateFrom, dateTo} = getDatesMonthInterval(date)
  try {
    return await apiRequest({
      method: 'POST',
      url: '/slots/search/available',
      data: {
        date_from: dateFrom,
        date_to: dateTo,
        teacher_ids: teachers,
        lesson_type_ids: [lessonTypeId]
      }
    })
  } catch (error) {
    handleApiError(error)
  }
};

const sendRequest = async (selectedSlot, selectedLessonType, allowNeighbours) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/lessons/request',
      data: {
        name: "Индивидуальное занятие",
        start_time: selectedSlot.start_time,
        finish_time: selectedSlot.finish_time,
        lesson_type_id: selectedLessonType.id,
        teacher_id: selectedSlot.teacher.id,
        are_neighbours_allowed: allowNeighbours
      }
    })

    return !!response;
  } catch (error) {
    handleApiError(error)
  }
}

const fetchTeachers = createPaginatedFetcher({
  url: '/teachers/search/full-info',
  defaultParams: {
    terminated: false
  }
});

export default function ScheduleSlots() {
  const params = useLocalSearchParams();
  const [slots, setSlots] = useState([])
  const teachers = usePaginatedData(fetchTeachers, 'teachers')

  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [filteredSlots, setFilteredSlots] = useState([])
  const [markedDates, setMarkedDates] = useState({});

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedTeacherData, setSelectedTeacherData] = useState(null);

  const [activeSlot, setActiveSlot] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [teacherProfileVisible, setTeacherProfileVisible] = useState(false);
  const [slotInfoModalVisible, setSlotInfoModalVisible] = useState(false);

  useEffect(() => {
    teachers.loadMoreAsync({additionalParams: {
        lesson_type_ids: params?.danceId ? [params.danceId] : undefined
      }
    }).then(() => {
      fetchSlots(selectedDate, teachers.state.data.map(teacher => teacher.id), params.danceId)
        .then(response => {
          setSlots(response);
          setLoading(false);
        })
    })
  }, []);

  useEffect(() => {
    if (!slots) {
      return;
    }

    const marks = {};
    if (slots.length >= 0) {
      // Маркировка всех будущих занятий
      slots.forEach(slot => {
        const date = format(parseISO(slot.start_time), 'yyyy-MM-dd', {locale: ru});
        if (isAfter(parseISO(slot.start_time), new Date())) {
          marks[date] = {marked: true, dotColor: "#d903e4"};
        }
      });

      // Фильтрация занятий с учетом выбранного дня
      const filtered = slots.filter(slot =>
        format(parseISO(slot.start_time), 'yyyy-MM-dd') === selectedDate
      );
      setFilteredSlots(filtered);
    }

    // Убираем маркер с выбранной даты и устанавливаем selected
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      marked: false,
    };

    setMarkedDates(marks);
  }, [selectedDate, slots, selectedSlot]);

  const handleDayPress = useCallback((dateData) => {
    setSelectedDate(dateData.dateString);
  }, [])

  const handleMonthChange = useCallback((dateData) => {
    const date = new Date(parseISO(dateData.dateString));
    date.setUTCDate(1);

    const dateString = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');
    setSelectedDate(dateString);

    if (selectedTeachers.length > 0) {
      fetchSlots(dateString, selectedTeachers, params.danceId)
        .then(response => {
          setSlots(response);
        })
    } else {
      fetchSlots(dateString, teachers.state.data.map(teacher => teacher.id), params.danceId)
        .then(response => {
          setSlots(response);
        })
    }
  }, [selectedTeachers, teachers, params.danceId]);

  const handleApplyFilters = useCallback(async (newSelectedTeachers) => {
    setFilterModalVisible(false);

    setSelectedTeachers(newSelectedTeachers);

    const date = new Date(parseISO(selectedDate));
    date.setUTCDate(1);

    const dateString = formatInTimeZone(date, 'UTC', 'yyyy-MM-dd');

    fetchSlots(dateString, newSelectedTeachers, params.danceId)
      .then(response => {
        setSlots(response);
      });
  }, [selectedDate, params.danceId]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </SafeAreaView>
    )
  }

  const handleConfirmRequest = async (allowNeighbours) => {
    setModalVisible(false);
    const success = await sendRequest(selectedSlot, {id: params.danceId}, allowNeighbours);
    if (success) {
      if (selectedTeachers.length > 0) {
        fetchSlots(selectedDate, selectedTeachers, params.danceId)
          .then(response => {
            setSlots(response);
          })
      } else {
        fetchSlots(selectedDate, teachers.state.data.map(teacher => teacher.id), params.danceId)
          .then(response => {
            setSlots(response);
          })
      }
      Alert.alert(
        "Заявка отправлена",
        `Заявка на выбранный слот успешно отправлена`,
        [{ text: "ОК" }]
      );
    }
  };

  const handleConfirmSlot = () => {
    setModalVisible(false);
  };

  const handleSlotPress = (slot) => {
    setActiveSlot(slot);
    setSlotInfoModalVisible(true);
  };

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setSlotInfoModalVisible(false);
  };

  const handleTeacherPress = (teacherId) => {
    const teacher = teachers.state.data.find(t => t.id === teacherId);

    if (teacher) {
      setSelectedTeacherData(teacher);
      setSlotInfoModalVisible(false);
      setTeacherProfileVisible(true);
    }
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
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
        markedDates={markedDates}
      />

      {filteredSlots.length > 0 ? (
        <FlashList
          data={filteredSlots}
          renderItem={({item}) => (
            <SlotCard
              item={item}
              selectedSlot={selectedSlot}
              onSlotPress={handleSlotPress}
            />
          )}
          keyExtractor={item => item.start_time}
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
        onConfirm={handleConfirmRequest}
        title="Подать заявку"
        message="Вы уверены, что хотите подать заявку на данный слот?"
        confirmText="Да"
        cancelText="Нет"
        askForNeighbours={true}
      />

      <TeacherFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        teachers={teachers}
        selectedTeachers={selectedTeachers}
        onReset={() => setSelectedTeachers([])}
        onConfirm={handleApplyFilters}
      />

      <SlotInfoModal
        visible={slotInfoModalVisible}
        onClose={() => setSlotInfoModalVisible(false)}
        slot={activeSlot}
        onSelectSlot={handleSelectSlot}
        onTeacherPress={handleTeacherPress}
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
