import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import {Image} from 'expo-image';
import {Checkbox} from 'expo-checkbox';
import {useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";

const TeacherFilterModal = ({
  visible,
  onClose,
  teachers,
  selectedTeachers,
  onReset,
  onConfirm
}) => {
  const [localSelectedTeachers, setLocalSelectedTeachers] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (visible) {
      setLocalSelectedTeachers([...selectedTeachers]);
    }
  }, [visible, selectedTeachers]);

  const handleReset = () => {
    setLocalSelectedTeachers([]);
    onReset();
    setRefresh(prev => prev + 1);
  };

  const toggleLocalTeacher = (teacherId) => {
    setLocalSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId) 
        : [...prev, teacherId]
    );
  };

  const handleApply = () => {
    onConfirm(localSelectedTeachers);
  };

  const renderTeacher = (teacher) => (
    <View style={styles.teacherCard}>
      <TouchableOpacity
        onPress={() => toggleLocalTeacher(teacher.id)}
        style={styles.teacherCardContent}
      >
        <Image
          source={{uri: teacher.user?.photo_url}}
          style={styles.teacherImage}
          placeholder={require("../../assets/images/user-profile-placeholder.jpg")}
          contentFit={'cover'}
          placeholderContentFit={"cover"}
        />
        <Text style={styles.teacherName}>
          {teacher.user?.last_name} {teacher.user?.first_name} {teacher.user?.middle_name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleLocalTeacher(teacher.id)}
      >
        <Checkbox
          value={localSelectedTeachers.includes(teacher.id)}
          onValueChange={() => toggleLocalTeacher(teacher.id)}
          color={
            localSelectedTeachers.includes(teacher.id)
              ? '#d903e4'
              : undefined
          }
        />
      </TouchableOpacity>
    </View>
  );

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
              <View style={{flex: 1}}>
                <FlashList
                  data={teachers.state?.data || []}
                  renderItem={({item}) => renderTeacher(item)}
                  estimatedItemSize={150}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  ListFooterComponent={() => (
                    teachers.state?.loading && teachers.state?.hasMore ? (
                      <View style={styles.loadingFooter}>
                        <ActivityIndicator size="small" color="#d903e4"/>
                      </View>
                    ) : null
                  )}
                  onEndReached={() => {
                    if (teachers.state?.hasMore && !teachers.state?.loading) {
                      teachers.loadMoreAsync();
                    }
                  }}
                  onEndReachedThreshold={0.3}
                  extraData={[localSelectedTeachers, refresh]}
                  contentContainerStyle={{paddingBottom: 10}}
                />
              </View>
              <View style={styles.modalButtons}>
                <Button title="Применить" onPress={handleApply} color="#d903e4"/>
                <Button title="Сбросить" onPress={handleReset} color="#666"/>
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
    height: '60%',
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
    shadowOffset: {width: 0, height: 1},
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
  loadingFooter: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TeacherFilterModal;