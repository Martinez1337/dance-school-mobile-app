import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { LessonRequestCard, CreateActionModal } from '../../../../components';
import users from '../../../../scratch-data/users.json';

// Фильтруем пользователей с ролью Student
const students = users.filter(user => user.role === 'Student');

// Временные данные для демонстрации с реальными студентами
const mockRequests = [
  {
    id: '1',
    student: students[0],
    startTime: '2024-03-20T14:00:00.000Z',
    finishTime: '2024-03-20T15:00:00.000Z',
    danceStyle: 'Бальные танцы',
    status: 'pending',
  },
  {
    id: '2',
    student: students[1],
    startTime: '2024-03-21T16:00:00.000Z',
    finishTime: '2024-03-21T17:00:00.000Z',
    danceStyle: 'Хип-хоп',
    status: 'pending',
  },
];

const LessonRequestsScreen = () => {
  const [requests] = useState(mockRequests);
  const [refreshing, setRefreshing] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleRequestPress = (request) => {
    router.push({
      pathname: '/(app)/(shared)/lesson-request/[id]',
      params: { id: request.id }
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

  const onRefreshHandler = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: 'Заявки на занятия',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsCreateModalVisible(true)}
              style={styles.createButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.content}>
        <FlashList
          data={requests}
          renderItem={({ item }) => (
            <LessonRequestCard
              request={item}
              onPress={handleRequestPress}
            />
          )}
          estimatedItemSize={120}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler}/>}
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
    marginRight: 16,
  },
});

export default LessonRequestsScreen; 