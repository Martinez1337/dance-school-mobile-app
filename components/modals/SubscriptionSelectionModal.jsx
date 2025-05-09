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
import {ru} from 'date-fns/locale';
import {router} from "expo-router";

const SubscriptionSelectionModal = ({
  visible,
  onClose,
  onSelect,
  title = 'Выберите абонемент',
  subscriptions = [],
}) => {
  const getSubscriptionTitle = (subscription) => {
    return subscription?.subscription_template?.name || `Абонемент №${subscription.id.split('-')[1]}`;
  };

  const getSubscriptionDetails = (subscription) => {
    let endDate;

    if (subscription?.expiration_date) {
      endDate = format(parseISO(subscription?.expiration_date), 'dd MMMM yyyy', {locale: ru});
      return `Действует до ${endDate}`;
    }

    return `Не указан срок действия`;
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

        {subscriptions?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>У вас нет подходящих абонементов{'\n'}для этого занятия</Text>
            <TouchableOpacity 
              style={styles.buyButton}
              onPress={() => {
                onClose();
                router.push('/(app)/(shared)/subscriptions');
              }}
            >
              <Text style={styles.buyButtonText}>Приобрести абонемент</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={subscriptions}
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
                  <Text style={styles.itemDetails}>Осталось занятий: {item?.lessons_left}</Text>
                  <View style={styles.subscriptionTypeContainer}>
                    {
                      item?.subscription_template?.lesson_types?.map(type => (
                        <View key={type.id} style={styles.subscriptionTypeTag}>
                          <Text style={styles.subscriptionType}>
                            {type?.dance_style?.name}
                          </Text>
                        </View>
                      ))
                    }
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5
  },
  subscriptionTypeTag: {
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