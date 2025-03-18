import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import React from 'react'
import {format, parseISO} from "date-fns";

const LessonListItem = ({item, onPress}) => {
  return (
    <TouchableOpacity style={styles.lessonItem} onPress={() => onPress(item)}>
      <Text style={styles.lessonTitle}>{item.name}</Text>
      <Text style={styles.lessonType}>
        {item.lessonType === 'Individual' ? 'Индивидуальное занятие' : 'Групповое занятие'}
      </Text>
      <Text style={styles.lessonTime}>
        {format(parseISO(item.startTime), 'HH:mm')} - {format(parseISO(item.finishTime), 'HH:mm')}
      </Text>
      <Text style={styles.lessonDescription}>{item.description}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  lessonItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  lessonTitle: {
    fontSize: 18,
    fontFamily: "os-bold"
  },
  lessonType: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: "os-regular",
    color: '#555',
  },
  lessonTime: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: "os-regular",
    color: '#555',
  },
  lessonDescription: {
    marginTop: 10,
    fontSize: 14,
    color: '#777',
    fontFamily: "os-regular",
  },
});

export default LessonListItem;
