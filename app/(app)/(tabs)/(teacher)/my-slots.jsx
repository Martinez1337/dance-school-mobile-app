import React, {useCallback, useState, useRef} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {router, Stack, useFocusEffect} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {apiRequest, handleApiError} from "../../../../util/apiService";
import {ConfirmationModal, TimeSlotCard} from "../../../../components";
import {globalStyles} from "../../../../styles/globalStyles";
import ReanimatedSwipeable from "react-native-gesture-handler/src/components/ReanimatedSwipeable";

const fetchTimeSlots = async (id) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/slots/search/full-info',
      data: {
        teacher_ids: [id]
      }
    });
  } catch (error) {
    handleApiError(error);
  }
};

const deleteTimeSlot = async (slotId) => {
  try {
    await apiRequest({
      method: 'DELETE',
      url: `/slots/${slotId}`,
    });
  } catch (error) {
    handleApiError(error);
  }
};

const MySlotsScreen = () => {
  const id = useSelector((state) => state.session.id);
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  
  // Для хранения ссылок на swipeable компоненты
  const swipeableRefs = useRef({});

  useFocusEffect(
    useCallback(() => {
      fetchTimeSlots(id).then((response) => {
        setSlots(response.slots);
        setLoading(false);
      });
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </SafeAreaView>
    )
  }

  const onRefreshHandler = async () => {
    setRefreshing(true);
    await fetchTimeSlots(id).then((response) => {
      setSlots(response.slots)
      setRefreshing(false);
    });
  };

  const handleDelete = async () => {
    await deleteTimeSlot(slotToDelete);
    setLoading(true)
    fetchTimeSlots(id).then((response) => {
      setSlots(response.slots);
      setLoading(false);
      setConfirmationVisible(false)
    });
  };

  const renderRightActions = (slotId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={ async () => {
          await setSlotToDelete(slotId)
          await setConfirmationVisible(true)
        }}
      >
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerTitle: 'Мои слоты',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={24} color="black"/>
              </TouchableOpacity>
            )
          }}
        />

        <View style={styles.content}>
          <FlashList
            data={slots}
            renderItem={({item}) => {
              return (
                <ReanimatedSwipeable
                  ref={ref => swipeableRefs.current[item.id] = ref}
                  renderRightActions={() => renderRightActions(item.id)}
                  overshootRight={true}
                >
                  <TimeSlotCard slot={item} />
                </ReanimatedSwipeable>
              );
            }}
            estimatedItemSize={120}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshHandler}
              />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.noSlotsText}>
                  У вас пока нет временных слотов
                </Text>
              </View>
            )}
          />
        </View>

        {/* Модальное окно подтверждения */}
        <ConfirmationModal
          visible={confirmationVisible}
          onClose={() => {
            if (swipeableRefs.current[slotToDelete]) {
              swipeableRefs.current[slotToDelete].close();
            }
            setConfirmationVisible(false)
          }}
          onConfirm={handleDelete}
          title="Удалить слот?"
          message="Вы уверены, что хотите удалить выбранный временной слот?"
          confirmText="Удалить"
          cancelText="Отменить"
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  noSlotsText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#999',
  },
  deleteButton: {
    borderRadius: 15,
    marginBottom: 12,
    marginHorizontal: 6,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  },
});

export default MySlotsScreen; 