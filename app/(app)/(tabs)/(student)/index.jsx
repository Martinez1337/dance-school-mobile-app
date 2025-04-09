import {View, Text, StyleSheet,TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import { useSession } from '../../../../context/ctx';
import { useState } from 'react';
import {FlashList} from "@shopify/flash-list";
import DanceListItem from '../../../../components/DanceListItem';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const danceTypes = [
  { id: '1', name: 'Аргентинское танго', image: { uri: 'https://images.unsplash.com/photo-1545959570-a94084071b5d' }, description: 'Классический стиль аргентинского танго' },
  { id: '2', name: 'Милонга', image: { uri: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7' }, description: 'Быстрый и ритмичный стиль танго' },
  { id: '3', name: 'Вальс-танго', image: { uri: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea' }, description: 'Танго в ритме вальса' },
  { id: '4', name: 'Танго нуэво', image: { uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e' }, description: 'Современная интерпретация танго' },
  { id: '5', name: 'Электро-танго', image: { uri: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff' }, description: 'Танго под электронную музыку' },
  { id: '6', name: 'Салонное танго', image: { uri: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434' }, description: 'Элегантный социальный стиль танго' }
];

export default function StudentDashboard() {
  const { session } = useSession();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDance, setSelectedDance] = useState(null);
  const router = useRouter();

  const renderItem = ({ item }) => (
    <DanceListItem item={item} onPress={() => {
      setSelectedDance(item);
      setModalVisible(true);
    }} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Выберите стиль танца</Text>
      <FlashList
        data={danceTypes}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите тип занятия</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.option}
              onPress={() => {
                setModalVisible(false);
                router.push('schedule-slots');
              }}
            >
              <Ionicons name="person-outline" size={24} color="#d903e4" />
              <Text style={styles.optionText}>Индивидуальное занятие</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setModalVisible(false); 
                router.push('schedule-groups');
              }}
            >
              <Ionicons name="people-outline" size={24} color="#d903e4" />
              <Text style={styles.optionText}>Групповое занятие</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontFamily: 'os-bold',
    paddingVertical: 5,
    marginLeft: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'os-bold',
  },
  closeButton: {
    padding: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'os-regular',
  },
  separator: {
    height: 1,
    backgroundColor: '#e1e1e1',
    marginHorizontal: 10,
  },
});
