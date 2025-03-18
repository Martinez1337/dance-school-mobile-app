import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

const TeacherProfileModal = ({ visible, onClose, teacher }) => {
  if (!teacher) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.teacherProfileModalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.teacherProfileModalView}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>

              <ScrollView style={styles.profileScrollView}>
                <View style={styles.header}>
                  <Image
                    source={{ uri: teacher.photo }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.name}>
                    {teacher.firstName} {teacher.lastName}
                  </Text>
                  <Text style={styles.role}>Преподаватель</Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Информация</Text>
                  <View style={styles.infoItem}>
                    <Ionicons name="mail-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>{teacher.email}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons name="call-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>
                      {teacher.phoneNumber || 'Не указан'}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Стили танцев</Text>
                  <View style={styles.tagContainer}>
                    {teacher.danceStyles?.map((style, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{style}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>О преподавателе</Text>
                  <Text style={styles.description}>
                    {teacher.description || 'Информация отсутствует'}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  teacherProfileModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  teacherProfileModalView: {
    width: '90%',
    height: '80%',
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
    zIndex: 1001,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  profileScrollView: {
    flex: 1,
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'os-regular',
    textAlign: 'center',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'os-regular',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: 'os-regular',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
    fontFamily: 'os-regular',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'os-regular',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'os-regular',
  },
});

export default TeacherProfileModal; 