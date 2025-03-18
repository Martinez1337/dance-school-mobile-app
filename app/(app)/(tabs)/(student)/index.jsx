import {View, Text, StyleSheet,TouchableOpacity, Modal, Button, SafeAreaView} from 'react-native';
import { useSession } from '../../../../context/ctx';
import { useState } from 'react';
import {FlashList} from "@shopify/flash-list";
import DanceListItem from '../../../../components/DanceListItem';
import { useRouter } from 'expo-router';

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
      <Text style={styles.title}>Выберите вид танца</Text>
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
          style={styles.modalContainer}
          onPress={() => setModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Выберите тип занятия</Text>
            <Button title="Индив" onPress={() => {
              setModalVisible(false);
              router.push('schedule-slots');
            }} />
            <Button title="Группа" onPress={() => {
              setModalVisible(false);
              router.push('schedule-groups');
            }} />
          </View>
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
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 20,
    fontFamily: 'os-bold',
    paddingVertical: 5,
    marginLeft: 16,
  },
  card: {
    padding: 16,
    margin: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginTop: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
});
