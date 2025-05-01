import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList} from 'react-native';
import {router, Stack} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {useState, useEffect} from 'react';
import {useSelector} from "react-redux";

export default function MyGroupsScreen() {
  const groups = useSelector((state) => state.session.groups);
  const role = useSelector((state) => state.session.role);

  const [userGroups, setUserGroups] = useState([]);
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    setUserGroups(groups)
  }, [groups]);

  useEffect(() => {
    setUserRole(role)
  }, [role])

  const handleGroupPress = (groupId) => {
    router.push(`/group/${groupId}`);
  };

  const renderGroupItem = ({item}) => (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupPress(item.id)}
    >
      <View style={styles.groupContent}>
        <Text style={styles.groupName}>{item?.name}</Text>
        <Text style={styles.groupLevel}>{item?.level?.name}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666"/>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        headerTitle: "Мои группы",
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'os-regular',
        },
      }}/>

      {userGroups.length > 0 ? (
        <View>
          <FlatList
            data={userGroups}
            renderItem={renderGroupItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {userRole === 'teacher'
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
