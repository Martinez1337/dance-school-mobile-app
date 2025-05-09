import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {router, Stack} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

import {DanceListItem} from '../../../../components';
import {globalStyles} from '../../../../styles/globalStyles';
import {apiRequest, handleApiError} from "../../../../util/apiService";

const fetchLessonTypes = async (isGroup) => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/lessonTypes/search/full-info',
      data: {
        is_group: isGroup,
        terminated: false
      }
    });
  } catch (error) {
    handleApiError(error);
  }
}

export default function StudentDashboard() {
  const [lessonTypes, setLessonTypes] = useState([]);
  const [isGroupView, setIsGroupView] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLessonTypes(isGroupView)
      .then((response) => {
        setLessonTypes(response.lesson_types)
        setLoading(false)
      })
  }, [isGroupView])

  // Фильтруем танцы по поисковому запросу
  const filteredDanceTypes = useMemo(() => {
    if (!searchQuery.trim()) return lessonTypes;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return lessonTypes.filter(lessonType =>
      lessonType.dance_style.name.toLowerCase().includes(normalizedQuery) ||
      lessonType.dance_style.description.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery, lessonTypes]);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </SafeAreaView>
    )
  }

  const onRefreshHandler = async () => {
    setRefreshing(true);
    await fetchLessonTypes(isGroupView)
      .then((response) => {
        setLessonTypes(response.lesson_types)
        setRefreshing(false);
      })
  }

  const navigateToSchedule = (pathname, dance) => {
    if (dance) {
      router.push({
        pathname: pathname,
        params: {
          danceId: dance.id
        }
      });
    } else {
      router.push(pathname);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                setIsGroupView(!isGroupView)
              }}
              style={styles.headerButtonLeft}
            >
              <Ionicons name={isGroupView ? "people" : "person"} size={24} color="#333"/>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(app)/(tabs)/(student)/my-requests')}
              style={styles.headerButtonRight}
            >
              <Ionicons name="document-text-outline" size={24} color="#333"/>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Поисковая строка в стиле экрана events */}
      <View style={{flexDirection: "row", marginHorizontal: 10}}>
        <View style={globalStyles.searchBar}>
          <Ionicons name="search" size={24} color="black"/>
          <TextInput
            style={globalStyles.searchTextInput}
            placeholder={"Поиск"}
            placeholderTextColor={"#666666"}
            value={searchQuery}
            clearButtonMode={"always"}
            autoCapitalize={"none"}
            autoCorrect={false}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
      </View>

      <FlashList
        data={filteredDanceTypes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <DanceListItem item={item} onPress={() => {
            if (isGroupView) {
              navigateToSchedule('schedule-groups', item)
            } else {
              navigateToSchedule('schedule-slots', item)
            }
          }}/>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler}/>}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#999',
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
  headerButtonRight: {
    marginRight: 5
  },
  headerButtonLeft: {
    marginLeft: 5
  }
});
