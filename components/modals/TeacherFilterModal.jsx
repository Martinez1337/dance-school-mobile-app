import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, Button, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { Checkbox } from 'expo-checkbox';

const TeacherFilterModal = ({ 
  visible, 
  onClose, 
  teachers, 
  selectedTeachers, 
  onTeacherSelect,
  onTeacherPress,
  onReset 
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.filterModalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.filterModalView}>
              <Text style={styles.filterTitle}>Выберите преподавателей</Text>
              <ScrollView style={styles.filterList}>
                {teachers.map(teacher => (
                  <View key={teacher.id} style={styles.teacherCard}>
                    <TouchableOpacity
                      onPress={() => onTeacherPress(teacher.id)}
                      style={styles.teacherCardContent}
                    >
                      <Image source={{uri: teacher.photo}} style={styles.teacherImage} />
                      <Text style={styles.teacherName}>
                        {teacher.firstName} {teacher.lastName}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => onTeacherSelect(teacher.firstName + ' ' + teacher.lastName)}
                    >
                      <Checkbox
                        value={selectedTeachers.includes(teacher.firstName + ' ' + teacher.lastName)}
                        onValueChange={() => onTeacherSelect(teacher.firstName + ' ' + teacher.lastName)}
                        color={selectedTeachers.includes(teacher.firstName + ' ' + teacher.lastName) ? '#d903e4' : undefined}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.modalButtons}>
                <Button title="Применить" onPress={onClose} color="#d903e4" />
                <Button title="Сбросить" onPress={onReset} color="#666" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  filterModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: "os-regular",
  },
  filterList: {
    maxHeight: '80%',
  },
  teacherCard: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teacherCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "os-regular",
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  checkboxContainer: {
    padding: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 16,
  },
}); 

export default TeacherFilterModal;