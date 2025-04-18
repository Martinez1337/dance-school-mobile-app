import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';

import { editUserInfoValidationSchema, editPasswordValidationSchema } from '../../../../validation/validation';
import { FormField } from '../../../../components';
import SelectionModal from '../../../../components/modals/SelectionModal';
import { apiRequest } from '../../../../util/apiService';

const user = {
  userId: "e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a",
  email: "ivanov.ivan@edu.hse.ru",
  firstName: "Иван",
  lastName: "Иванов",
  middleName: "Александрович",
  phoneNumber: "+79991234567",
  photo: "https://randomuser.me/api/portraits/men/1.jpg",
  role: "Student",
  description: "Увлекается современными танцами и хип-хопом.",
  level: "Intermediate"
};

const EditProfileScreen = () => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    console.log('HERE')
    const fetchLevels = async () => {
      const response = await apiRequest({
        method: 'GET',
        url: '/levels',
        requiresAuth: false,
      }).catch(error => {
        console.log(error);
      });
      console.log(`response: ${JSON.stringify(response)}`);
      setLevels(response);
      setSelectedLevel(response[0].id);
      console.log(`selectedLevel: ${selectedLevel}`);
    };
    fetchLevels();
  }, []);

  const getSelectedLevelName = () => {
    const level = levels?.find(l => l.id === selectedLevel);
    if (!level) return 'Выберите уровень';
    return level ? level.name : '';
  }

  const handleSaveProfile = (values) => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите сохранить изменения в профиле?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Сохранить',
          onPress: () => {
            console.log('Saving profile:', values);
            router.back();
          },
        },
      ]
    );
  };

  const handleChangePassword = (values) => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите изменить пароль?',
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Изменить',
          onPress: () => {
            console.log('Changing password:', values);
            setIsEditingPassword(false);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Редактирование профиля',
        }}
      />

      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!isEditingPassword ? (
          <Formik
            initialValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              middleName: user.middleName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              description: user.description,
            }}
            onSubmit={handleSaveProfile}
            validationSchema={editUserInfoValidationSchema}
          >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
              <View>
                <FormField
                  field="lastName"
                  label="Фамилия"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="firstName"
                  label="Имя"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="middleName"
                  label="Отчество"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="email"
                  label="Электронная почта"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="phoneNumber"
                  label="Номер телефона"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <View style={styles.section}>
                  <Text style={styles.label}>Уровень</Text>
                  <TouchableOpacity
                    style={styles.selectInput}
                    onPress={() => setIsLevelModalVisible(true)}
                  >
                    <Text style={styles.selectText}>{getSelectedLevelName()}</Text>
                    <Ionicons name="chevron-down" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                <SelectionModal
                  visible={isLevelModalVisible}
                  onClose={() => setIsLevelModalVisible(false)}
                  onSelect={setSelectedLevel}
                  title="Выберите уровень"
                  items={levels}
                  selectedValue={selectedLevel}
                  labelExtractor={(item) => item.name}
                  valueExtractor={(item) => item.id}
                />

                <FormField
                  field="description"
                  label="Описание"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  multiline={true}
                />

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>Сохранить изменения</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.passwordButton]}
                  onPress={() => setIsEditingPassword(true)}
                >
                  <Text style={[styles.buttonText, styles.passwordButtonText]}>
                    Изменить пароль
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              newPassword: '',
              confirmNewPassword: '',
            }}
            onSubmit={handleChangePassword}
            validationSchema={editPasswordValidationSchema}
          >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
              <View>
                <FormField
                  field="newPassword"
                  label="Новый пароль"
                  secureTextEntry
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="confirmNewPassword"
                  label="Подтверждение пароля"
                  secureTextEntry
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSubmit}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>Изменить пароль</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsEditingPassword(false)}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    Отмена
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'os-bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#d903e4',
  },
  passwordButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d903e4',
    marginTop: 12,
  },
  passwordButtonText: {
    color: '#d903e4',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#666',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'os-regular',
    marginBottom: 8,
    color: '#333',
  },
  selectInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
  }
});

export default EditProfileScreen;