import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import {Image} from 'expo-image';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useRouter} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import { useSession } from '../../../../context/ctx';
import {MAX_DESCRIPTION_LENGTH} from "../../../../constants";
import subscriptions from '../../../../scratch-data/subscriptions.json';
import users from '../../../../scratch-data/users.json';

const user = users[0];

const Profile = () => {
  const router = useRouter();
  const { session, signIn } = useSession();
  const [description, setDescription] = useState(user.description);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  useEffect(() => {
    if (user.role === 'Student') {
      // Получаем активные подписки пользователя
      const userSubscriptions = subscriptions
        .filter(sub => 
          sub.userId === user.userId && 
          !sub.terminated &&
          new Date(sub.endDate) > new Date()
        );
      setActiveSubscriptions(userSubscriptions);
    }
  }, []);

  const handleSave = () => {
    console.log('Description saved:', description);
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(text);
      setIsSaved(false);
    }
  };

  const handleGoToSubscriptions = () => {
    router.push('/(app)/(shared)/subscriptions');
  };

  const handleEditProfile = () => {
    router.push('/(app)/(shared)/edit-profile');
  };

  const handleSwitchRole = () => {
    if (session === "Student") {
      signIn("Teacher");
    } else {
      signIn("Student");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20, paddingTop: 20}}
      >
        <View style={{alignItems: "center"}}>
          <View style={styles.profileImageContainer}>
            <Image
            style={styles.profileImage}
            source={user.photo}
            placeholder={require("../../../../assets/images/placeholder-image.png")}
            />
            <TouchableOpacity 
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Ionicons name="pencil" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.switchRoleButton}
              onPress={handleSwitchRole}
            >
              <Ionicons name="swap-horizontal" size={18} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userNameText}>{user.lastName} {user.firstName} {user.middleName}</Text>
          </View>
          <Text style={styles.userRoleText}>
            {user.role === 'Student' ? 'Студент' : 'Преподаватель'}, {user.level} уровень
          </Text>
        </View>

        <View style={styles.contactDataContainer}>
          <View style={styles.contactDataLine}>
            <Ionicons name="mail-outline" size={24} color="black"/>
            <Text style={styles.contactDataText}>{user.email}</Text>
          </View>

          <View style={styles.contactDataLine}>
            <Ionicons name="call-outline" size={24} color="black"/>
            <Text style={styles.contactDataText}>{user.phoneNumber}</Text>
          </View>

          {user.role === 'Student' && (
            <View style={styles.subscriptionsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Мои абонементы</Text>
                <TouchableOpacity 
                  style={styles.subscriptionsButton} 
                  onPress={handleGoToSubscriptions}
                >
                  <Ionicons name="card-outline" size={24} color="#d903e4" />
                  <Text style={styles.subscriptionsButtonText}>Все абонементы</Text>
                </TouchableOpacity>
              </View>

              {activeSubscriptions.length > 0 ? (
                <View style={styles.activeSubscriptions}>
                  {activeSubscriptions.map((sub, index) => (
                    <View key={sub.id} style={styles.subscriptionItem}>
                      <View style={styles.subscriptionInfo}>
                        <Text style={styles.subscriptionName}>{sub.name}</Text>
                        <Text style={styles.subscriptionDate}>
                          до {new Date(sub.endDate).toLocaleDateString('ru-RU')}
                        </Text>
                      </View>
                      <Text style={styles.remainingLessons}>
                        {typeof sub.lessonsCount === 'object' 
                          ? `${sub.lessonsCount.group - (sub.usedLessons?.group || 0)} групп. + ${sub.lessonsCount.individual - (sub.usedLessons?.individual || 0)} инд.`
                          : `${sub.lessonsCount - (sub.usedLessons || 0)} занятий`
                        }
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noSubscriptions}>Нет активных абонементов</Text>
              )}
            </View>
          )}

          <Text style={styles.descriptionTitleText}>Описание</Text>

          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionField}
              value={description}
              onChangeText={handleDescriptionChange}
              placeholder="Введите описание"
              multiline={true}
            />
            <Text style={styles.charCount}>{description.length}/{MAX_DESCRIPTION_LENGTH}</Text>
          </View>

          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isSaved}
            >
              <Text style={styles.saveButtonText}>{isSaved ? "Сохранено" : "Сохранить изменения"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  userNameText: {
    fontSize: 18,
    fontFamily: "os-bold",
    flexWrap: "wrap",
    paddingHorizontal: 25
  },
  userRoleText: {
    fontSize: 16,
    fontFamily: "os-light-it"
  },
  contactDataContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 15
  },
  contactDataLine: {
    height: 40,
    borderWidth: 1,
    borderColor: "rgba(158, 150, 150, .5)",
    borderRadius: 10,
    marginBottom: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  contactDataText: {
    fontSize: 14,
    fontFamily: "os-regular",
    marginLeft: 10
  },
  contactDataIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
    tintColor: "black"
  },
  descriptionTitleText: {
    fontSize: 16,
    fontFamily: "os-bold",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 5
  },
  descriptionContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    borderColor: "rgba(158, 150, 150, .5)",
    borderWidth: 1,
    borderRadius: 10
  },
  descriptionField: {
    height: 200,
    textAlignVertical: 'top', // Для многострочного ввода
    fontSize: 16,
    fontFamily: "os-regular",

  },
  charCount: {
    position: 'absolute',
    right: 10,
    bottom: -20,
    fontSize: 12,
    color: 'gray',
    fontFamily: "os-light"

  },
  saveButtonContainer: {
    alignItems: "center",
  },
  saveButton: {
    marginTop: 10,
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontFamily: "os-bold",
    fontSize: 14,
  },
  subscriptionsSection: {
    marginVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'os-bold',
  },
  subscriptionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  subscriptionsButtonText: {
    marginLeft: 8,
    color: '#d903e4',
    fontFamily: 'os-regular',
  },
  activeSubscriptions: {
    gap: 8,
  },
  subscriptionItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  subscriptionName: {
    fontSize: 14,
    fontFamily: 'os-bold',
  },
  subscriptionDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'os-regular',
  },
  remainingLessons: {
    fontSize: 12,
    color: '#d903e4',
    fontFamily: 'os-regular',
  },
  noSubscriptions: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'os-regular',
    fontSize: 14,
    padding: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 8,
    backgroundColor: "#000",
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
},
  profileImageContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  switchRoleButton: {
    position: 'absolute',
    top: -10,
    right: -130,
    padding: 8,
    backgroundColor: "#000",
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default Profile;
