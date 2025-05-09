import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native';
import { Image } from 'expo-image';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const SlotInfoModal = ({
  visible,
  onClose,
  slot,
  onSelectSlot,
  onTeacherPress
}) => {
  if (!slot) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Информация о слоте</Text>
              
              <View style={styles.slotInfo}>
                <Text style={styles.dateTime}>
                  {format(parseISO(slot.start_time), 'dd MMMM yyyy', { locale: ru })}
                </Text>
                <Text style={styles.timeRange}>
                  {`${format(parseISO(slot.start_time), 'HH:mm')} - ${format(parseISO(slot.finish_time), 'HH:mm')}`}
                </Text>
                {/*<Text style={styles.danceType}>{slot.danceType}</Text>*/}
              </View>

              <View style={styles.teacherSection}>
                <Text style={styles.sectionTitle}>Преподаватель</Text>
                <TouchableOpacity 
                  style={styles.teacherInfo}
                  onPress={() => onTeacherPress && onTeacherPress(slot.teacher?.id)}
                  activeOpacity={0.7}
                >
                  <Image
                    source={slot.teacher?.user?.photo_url}
                    style={styles.teacherImage}
                    placeholder={require("../../assets/images/user-profile-placeholder.jpg")}
                    contentFit={'cover'}
                    placeholderContentFit={"cover"}
                  />
                  <View style={styles.teacherNameContainer}>
                    <Text style={styles.teacherName}>
                      {slot?.teacher?.user?.last_name} {slot?.teacher?.user?.first_name} {slot?.teacher?.user?.middle_name}
                    </Text>
                    <Text style={styles.viewProfileText}>Посмотреть профиль</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  onSelectSlot(slot);
                  onClose();
                }}
              >
                <Text style={styles.selectButtonText}>Выбрать слот</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: "os-bold",
  },
  slotInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 18,
    fontFamily: "os-regular",
    marginBottom: 6,
  },
  timeRange: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: "os-bold",
    marginBottom: 10,
  },
  danceType: {
    fontSize: 16,
    color: '#666',
    fontFamily: "os-regular",
  },
  teacherSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "os-semibold",
    marginBottom: 12,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  teacherImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  teacherNameContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 16,
    fontFamily: "os-regular",
    marginBottom: 4,
  },
  viewProfileText: {
    fontSize: 14,
    color: '#d903e4',
    fontFamily: "os-regular",
  },
  selectButton: {
    backgroundColor: '#d903e4',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "os-bold",
  },
});

export default SlotInfoModal;