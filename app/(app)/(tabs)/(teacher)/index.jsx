import React, {useCallback, useState} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl, Text} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {Tabs, router, useFocusEffect} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useSelector} from "react-redux";

import {LessonRequestCard, CreateActionModal} from '../../../../components';
import {apiRequest, handleApiError} from "../../../../util/apiService";

const fetchLessonRequests = async (id, setRequests) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/lessons/search/teacher',
      data: {
        terminated: false,
        is_confirmed: false,
        is_group: false,
      }
    });
    setRequests(response.lessons);
  } catch (error) {
    handleApiError(error);
  }
};

const LessonRequestsScreen = () => {
  const id = useSelector((state) => state.session.id);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchLessonRequests(id, setRequests);
    }, [])
  )

  const onRefreshHandler = async () => {
    setRefreshing(true);
    await fetchLessonRequests(id, setRequests);
    setRefreshing(false);
  };

  const handleRequestPress = (request) => {
    router.push({
      pathname: '/(app)/(shared)/lesson-request/[id]',
      params: {
        request: JSON.stringify(request)
      }
    });
  };

  const handleCreateIndividual = () => {
    setIsCreateModalVisible(false);
    router.push('/create-individual-lesson');
  };

  const handleCreateTimeSlot = () => {
    setIsCreateModalVisible(false);
    router.push('/create-time-slot');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: 'Заявки на занятия',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(tabs)/(teacher)/my-slots')}
              style={styles.slotsButton}
            >
              <Ionicons name="time-outline" size={24} color="black"/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setIsCreateModalVisible(true)}
              style={styles.createButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <FlashList
          data={requests}
          renderItem={({item}) => (
            <LessonRequestCard
              request={item}
              onPress={handleRequestPress}
            />
          )}
          estimatedItemSize={120}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler}/>}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.noRequestsText}>
                Нет новых заявок
              </Text>
            </View>
          )}
        />
      </View>

      <CreateActionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreateIndividual={handleCreateIndividual}
        onCreateTimeSlot={handleCreateTimeSlot}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingVertical: 16,
  },
  createButton: {
    marginRight: 5,
  },
  slotsButton: {
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRequestsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default LessonRequestsScreen;
