import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const LessonRequestCard = ({ request, onPress }) => {
  const student = request.actual_students[0]
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(request)}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {student.user.last_name} {student.user.first_name} {student.user.middle_name}
        </Text>
        <Text style={styles.date}>
          {format(parseISO(request.start_time), 'd MMMM', { locale: ru })}
        </Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {format(parseISO(request.start_time), 'HH:mm')} - {format(parseISO(request.finish_time), 'HH:mm')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.danceStyle}>{request.lesson_type.dance_style.name}</Text>
        <Text style={styles.level}>{student.level.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontFamily: 'os-bold',
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
  },
  timeContainer: {
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    fontFamily: 'os-semibold',
    color: '#d903e4',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  danceStyle: {
    fontSize: 14,
    fontFamily: 'os-regular',
  },
  level: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
  },
});

export default LessonRequestCard; 