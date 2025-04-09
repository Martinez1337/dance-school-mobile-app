import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import groups from '../../../../scratch-data/groups.json';

export default function MyGroupsScreen() {
  const [userGroups, setUserGroups] = useState([]);
  const currentUserId = 'e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a';
  const userRole = 'Student';

  useEffect(() => {
    // Фильтруем группы в зависимости от роли пользователя
    const filteredGroups = groups.filter(group => 
      userRole === 'Teacher' 
        ? group.teacher.id === currentUserId
        : group.students.some(student => student.id === currentUserId)
    );
    setUserGroups(filteredGroups);
  }, []);

  const handleGroupPress = (groupId) => {
    router.push(`/group/${groupId}`);
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.groupItem}
      onPress={() => handleGroupPress(item.id)}
    >
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupLevel}>{item.level}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        headerTitle: "Мои группы"
      }}/>

      {userGroups.length > 0 ? (
        <FlatList
          data={userGroups}
          renderItem={renderGroupItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {userRole === 'Teacher' 
              ? 'У вас пока нет групп для преподавания'
              : 'Вы пока не состоите ни в одной группе'
            }
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 5,
  },
  listContainer: {
    padding: 16,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupContent: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginBottom: 4,
  },
  groupLevel: {
    fontSize: 14,
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
