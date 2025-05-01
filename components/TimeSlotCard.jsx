import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from "@expo/vector-icons";


const TimeSlotCard = ({slot}) => {
  const getDayOfWeek = (dayNum) => {
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    return days[dayNum];
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dayOfWeek}>{getDayOfWeek(slot.day_of_week)}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.timeContainer}>
          <Ionicons name="time-outline" size={18} color="#666"/>
          <Text style={styles.timeText}>
            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    marginHorizontal: 5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(158, 150, 150, .1)'
  },
  cardHeader: {
    marginBottom: 12,
  },
  dayOfWeek: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
  },
})

export default TimeSlotCard;