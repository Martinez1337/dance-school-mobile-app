import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {format, parseISO} from 'date-fns';
import {fromZonedTime} from "date-fns-tz";
import {ru} from 'date-fns/locale';

const SubscriptionSelectionModal = ({
  visible,
  onClose,
  onSelect,
  title = 'Выберите абонемент',
  subscriptions = [],
  lessonType,
}) => {
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);

  useEffect(() => {
    // Фильтруем абонементы по типу занятия
    const filtered = subscriptions.filter(sub => {
      const now = new Date();
      const endDate = fromZonedTime(sub.expiration_date);
      
      // Подходит, если не просрочен и не отменен и совпадает тип занятия
      const isValidSub = endDate > now && !sub.terminated;
      const isMatchingType = sub.lessonType.toLowerCase() === lessonType.toLowerCase() || 
                            sub.lessonType.toLowerCase() === 'combined';
      
      return isValidSub && isMatchingType;
    });
    
    setFilteredSubscriptions(filtered);
  }, [subscriptions, lessonType]);

  const getSubscriptionTitle = (subscription) => {
    // Получаем название абонемента
    return subscription?.name || `Абонемент №${subscription.id.split('-')[1]}`;
  };

  const getSubscriptionDetails = (subscription) => {
    // Форматируем даты для отображения
    const startDate = format(parseISO(subscription.startTime), 'dd MMMM yyyy', {locale: ru});
    const endDate = format(parseISO(subscription.endTime), 'dd MMMM yyyy', {locale: ru});
    
    return `Действует до ${endDate}`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {filteredSubscriptions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>У вас нет подходящих абонементов{'\n'}для этого занятия</Text>
            <TouchableOpacity 
              style={styles.buyButton}
              onPress={() => {
                onClose();
                // Здесь будет навигация на экран покупки абонементов
                Alert.alert('Переход', 'Переход на экран покупки абонементов');
              }}
            >
              <Text style={styles.buyButtonText}>Приобрести абонемент</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredSubscriptions}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{getSubscriptionTitle(item)}</Text>
                  <Text style={styles.itemDetails}>{getSubscriptionDetails(item)}</Text>
                  <View style={styles.subscriptionTypeContainer}>
                    <Text style={styles.subscriptionType}>
                      {item.lessonType === 'group' ? 'Групповой' : 
                       item.lessonType === 'individual' ? 'Индивидуальный' : 'Комбинированный'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#ccc" />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontFamily: 'os-bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#333',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
    marginBottom: 8,
  },
  subscriptionTypeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 3, 228, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionType: {
    fontSize: 12,
    fontFamily: 'os-regular',
    color: '#d903e4',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#d903e4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'os-bold',
  },
});

export default SubscriptionSelectionModal; 