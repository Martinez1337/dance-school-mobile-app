import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import {useSelector} from 'react-redux';
import {RequestCard} from '../../../../components';
import {Ionicons} from "@expo/vector-icons";
import {apiRequest, handleApiError} from "../../../../util/apiService";
import {FlashList} from "@shopify/flash-list";

// Заглушка для тестирования
const mockRequests = [
  {
    id: '2',
    type: 'individual',
    status: 'approved',
    teacherName: 'Петрова Анна',
    danceStyle: 'Вальс',
    createdAt: '2024-04-25T14:30:00Z',
  }
];

const fetchLessonRequests = async () => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/lessons/search/student',
      data: {
        is_group: false,
      }
    });
  } catch (error) {
    handleApiError(error);
  }
};

const MyRequestsScreen = () => {
  const userId = useSelector(state => state.user?.id);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessonRequests().then(response => {
      setRequests(response.lessons);
      setLoading(false)
    })
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#d903e4"/>
        </View>
      ) : requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет заявок</Text>
        </View>
      ) : (
        <FlashList
          data={requests}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
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