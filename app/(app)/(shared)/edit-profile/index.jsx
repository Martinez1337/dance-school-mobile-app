import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {router, Stack} from 'expo-router';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch, useSelector} from "react-redux";

import {editUserInfoValidationSchema, editPasswordValidationSchema} from '../../../../validation/validation';
import {FormField} from '../../../../components';
import {SelectionModal} from '../../../../components';
import {apiRequest, handleApiError} from '../../../../util/apiService';
import {updateUserField} from "../../../../redux/slices/userSlice";
import {updateLevelField} from "../../../../redux/slices/levelSlice";

const fetchLevels = async () => {
  return await apiRequest({
    method: 'POST',
    url: '/levels/search',
    requiresAuth: false,
    data: {
      terminated: false
    }
  }).catch(error => {
    handleApiError(error)
  });
};

const EditProfileScreen = () => {
  const user = useSelector((state) => state.user);
  const role = useSelector((state) => state.session.role);
  const id = useSelector((state) => state.session.id);
  const level_id = useSelector(state => state.level.id);
  const dispatch = useDispatch();

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(level_id);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    if (role === "student") {
      fetchLevels().then((response) => setLevels(response.levels));
    }
  }, []);

  const getSelectedLevelName = () => {
    const level = levels?.find(l => l.id === selectedLevel);
    if (!level) return 'Выберите уровень';
    return level ? level.name : '';
  }

  const handleSaveProfile = (values) => {
    Alert.alert('Подтверждение', 'Вы уверены, что хотите сохранить изменения в профиле?',
      [{text: 'Отмена', style: 'cancel'},
        {
          text: 'Сохранить',
          onPress: async () => {
            try {
              const patchResponse = await apiRequest({
                method: 'PATCH',
                url: role === 'student' ? `/students/${id}` : `/teachers/${id}`,
                data: {
                  first_name: values.first_name,
                  last_name: values.last_name,
                  middle_name: values.middle_name,
                  description: values.description,
                  messenger_url: values.messenger_url,
                  ...(values.email !== user.email && {email: values.email}),
                  ...(values.phone_number !== user.phone_number && {phone_number: values.phone_number}),
                  ...(role === 'student' && {level_id: selectedLevel})
                },
              });
              console.log(`patchResponse: ${JSON.stringify(patchResponse)}`);
              dispatch(updateUserField(patchResponse.user))
              if (role === 'student') {
                dispatch(updateLevelField(patchResponse.level));
              }
            } catch (error) {
              console.log(error)
            }
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
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Изменить',
          onPress: async () => {
            try {
              const patchResponse = await apiRequest({
                method: 'PATCH',
                url: role === 'student' ? `/students/${id}` : `/teachers/${id}`,
                data: {
                  old_password: values.oldPassword,
                  new_password: values.newPassword
                },
              });
              console.log(`patchResponse: ${JSON.stringify(patchResponse)}`);
              dispatch(updateUserField(patchResponse.user))
              if (role === 'student') {
                dispatch(updateLevelField(patchResponse.level));
              }
            } catch (error) {
              console.log(error)
            }
            router.back();
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
              last_name: user.last_name,
              first_name: user.first_name,
              middle_name: user.middle_name,
              email: user.email,
              phone_number: user.phone_number,
              description: user.description,
              messenger_url: user.messenger_url,
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
                  field="last_name"
                  label="Фамилия"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="first_name"
                  label="Имя"
                  autoCapitalize="words"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="middle_name"
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
                  field="messenger_url"
                  label="Ссылка на мессенджер"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <FormField
                  field="phone_number"
                  label="Номер телефона"
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                {role === "student" &&
                  <View style={styles.section}>
                    <Text style={styles.label}>Уровень</Text>
                    <TouchableOpacity
                      style={styles.selectInput}
                      onPress={() => setIsLevelModalVisible(true)}
                    >
                      <Text style={styles.selectText}>{getSelectedLevelName()}</Text>
                      <Ionicons name="chevron-down" size={20} color="#666"/>
                    </TouchableOpacity>
                  </View>
                }

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
                  onPress={() => handleSubmit()}
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
              oldPassword: '',
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
                  field="oldPassword"
                  label="Старый пароль"
                  secureTextEntry
                  values={values}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

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
                  onPress={() => handleSubmit()}
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
