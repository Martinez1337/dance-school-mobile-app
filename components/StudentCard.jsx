import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Image} from 'expo-image';


const StudentCard = ({student, onDelete, isTeacher}) => {
  const fullName = `${student.user.last_name} ${student.user.first_name} ${student.user.middle_name || ''}`.trim();

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Image
          source={{uri: student.user.photo}}
          style={styles.avatar}
          placeholder={require("../assets/images/user-profile-placeholder.jpg")}
          contentFit={'cover'}
          placeholderContentFit={"cover"}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.level}>Уровень: {student.level.name || 'Не указан'}</Text>
        </View>
        {isTeacher && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30"/>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontFamily: 'os-medium',
    color: '#333',
    marginBottom: 4,
  },
  level: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
});

export default StudentCard; 