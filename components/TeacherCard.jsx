import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TeacherCard = ({ teacher, onPress }) => {
  return (
    <TouchableOpacity 
        style={styles.teacherCard}
        onPress={onPress}
    >
      <Image
        source={{ uri: teacher.photo }}
        style={styles.teacherPhoto}
      />
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>
          {teacher.firstName} {teacher.lastName}
        </Text>
        {teacher.description && (
          <Text style={styles.teacherDescription}>
            {teacher.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
    
  )
}

const styles = StyleSheet.create({
  teacherCard: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fdfdfd',
    padding: 12,
  },
  teacherPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  teacherInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'os-bold',
  },
  teacherDescription: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'os-regular',
  },
})

export default TeacherCard;