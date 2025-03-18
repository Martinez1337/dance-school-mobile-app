import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const LessonRequestCard = ({ request, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(request)}>
      <View style={styles.header}>
        <Text style={styles.name}>
          {request.student.lastName} {request.student.firstName} {request.student.middleName}
        </Text>
        <Text style={styles.date}>
          {format(parseISO(request.startTime), 'd MMMM', { locale: ru })}
        </Text>
      </View>
      
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {format(parseISO(request.startTime), 'HH:mm')} - {format(parseISO(request.finishTime), 'HH:mm')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.danceStyle}>{request.danceStyle}</Text>
        <Text style={styles.level}>{request.student.level}</Text>
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