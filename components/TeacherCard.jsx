import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';

const TeacherCard = ({ teacher, onPress }) => {
  return (
    <TouchableOpacity 
        style={styles.teacherCard}
        onPress={onPress}
    >
      <Image
        style={styles.teacherPhoto}
        source={{ uri: teacher.user.photo_url }}
        placeholder={require("../assets/images/user-profile-placeholder.jpg")}
        contentFit={'cover'}
        placeholderContentFit={"cover"}
      />
      <View style={styles.teacherInfo}>
        <Text style={styles.teacherName}>
          {teacher.user.last_name} {teacher.user.first_name} {teacher.user.middle_name}
        </Text>
        {teacher.user.description && (
          <Text style={styles.teacherDescription}>
            {teacher.user.description}
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