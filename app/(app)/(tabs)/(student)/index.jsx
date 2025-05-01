import {useState, useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, SafeAreaView, TextInput} from 'react-native';
import {FlashList} from "@shopify/flash-list";
import {useRouter, Stack} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

import {DanceListItem} from '../../../../components';
import {globalStyles} from '../../../../styles/globalStyles';

const danceTypes = [
  {
    id: '1',
    name: 'Аргентинское танго',
    image: {uri: 'https://images.unsplash.com/photo-1545959570-a94084071b5d'},
    description: 'Классический стиль аргентинского танго'
  },
  {
    id: '2',
    name: 'Милонга',
    image: {uri: 'https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7'},
    description: 'Быстрый и ритмичный стиль танго'
  },
  {
    id: '3',
    name: 'Вальс-танго',
    image: {uri: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea'},
    description: 'Танго в ритме вальса'
  },
  {
    id: '4',
    name: 'Танго нуэво',
    image: {uri: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e'},
    description: 'Современная интерпретация танго'
  },
  {
    id: '5',
    name: 'Электро-танго',
    image: {uri: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff'},
    description: 'Танго под электронную музыку'
  },
  {
    id: '6',
    name: 'Салонное танго',
    image: {uri: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434'},
    description: 'Элегантный социальный стиль танго'
  }
];

export default function StudentDashboard() {
  const [isGroupView, setIsGroupView] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDance, setSelectedDance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Фильтруем танцы по поисковому запросу
  const filteredDanceTypes = useMemo(() => {
    if (!searchQuery.trim()) return danceTypes;

    const normalizedQuery = searchQuery.toLowerCase().trim();
    return danceTypes.filter(dance =>
      dance.name.toLowerCase().includes(normalizedQuery) ||
      dance.description.toLowerCase().includes(normalizedQuery)
    );
  }, [searchQuery]);

  const renderItem = ({item}) => (
    <DanceListItem item={item} onPress={() => {
      setSelectedDance(item);
      setModalVisible(true);
    }}/>
  );

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Функция для перехода на экран групповых занятий с выбранным танцем
  const navigateToGroupSchedule = () => {
    setModalVisible(false);
    if (selectedDance) {
      router.push({
        pathname: 'schedule-groups',
        params: {
          danceId: selectedDance.id,
          danceName: selectedDance.name
        }
      });
    } else {
      router.push('schedule-groups');
    }
  };
  
  const navigateToMyRequests = () => {
    router.push('/(app)/(tabs)/(student)/my-requests');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}} style={styles.headerButtonLeft}>
              <Ionicons name="people" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={navigateToMyRequests} style={styles.headerButtonRight}>
              <Ionicons name="document-text-outline" size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <Text style={styles.title}>Выберите стиль танца</Text>

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
        renderItem={renderItem}
        keyExtractor={item => item.id}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        )}
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
                <Ionicons name="close" size={24} color="#333"/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setModalVisible(false);
                router.push('schedule-slots');
              }}
            >
              <Ionicons name="person-outline" size={24} color="#d903e4"/>
              <Text style={styles.optionText}>Индивидуальное занятие</Text>
            </TouchableOpacity>

            <View style={styles.separator}/>

            <TouchableOpacity
              style={styles.option}
              onPress={navigateToGroupSchedule}
            >
              <Ionicons name="people-outline" size={24} color="#d903e4"/>
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
    marginRight: 5,
    padding: 5,
  },
  headerButtonLeft: {
    marginLeft: 5,
    padding: 5
  }
});
