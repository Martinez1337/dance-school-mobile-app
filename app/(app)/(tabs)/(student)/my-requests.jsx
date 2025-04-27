import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import {useSelector} from 'react-redux';
import {RequestCard} from '../../../../components';
import {Ionicons} from "@expo/vector-icons";

// Заглушка для тестирования
const mockRequests = [
  {
    id: '1',
    type: 'group',
    status: 'pending',
    groupName: 'Начинающие танго',
    danceStyle: 'Аргентинское танго',
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: '2',
    type: 'individual',
    status: 'approved',
    teacherName: 'Петрова Анна',
    danceStyle: 'Вальс',
    createdAt: '2024-04-25T14:30:00Z',
    comment: 'Заявка одобрена, ждем вас на занятии'
  },
  {
    id: '3',
    type: 'group',
    status: 'rejected',
    groupName: 'Продвинутый уровень',
    danceStyle: 'Милонга',
    createdAt: '2024-04-15T09:15:00Z',
    comment: 'К сожалению, группа уже заполнена'
  },
  {
    id: '4',
    type: 'group',
    status: 'pending',
    groupName: 'Средний уровень',
    danceStyle: 'Танго нуэво',
    createdAt: '2024-05-02T16:45:00Z',
  },
];

const MyRequestsScreen = () => {
  const router = useRouter();
  const userId = useSelector(state => state.user?.id);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Здесь будет запрос к API для получения заявок пользователя
    // Пока используем заглушку
    const fetchRequests = async () => {
      try {
        // Имитация задержки загрузки
        setTimeout(() => {
          setRequests(mockRequests);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Ошибка при загрузке заявок:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Мои заявки',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#d903e4"/>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет заявок</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <RequestCard request={item}/>
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#666',
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
    color: '#666',
    textAlign: 'center',
  },
});

export default MyRequestsScreen; 