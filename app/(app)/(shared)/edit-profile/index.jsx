import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { editUserInfoValidationSchema, editPasswordValidationSchema } from '../../../../validation/validation';
import { FormField } from '../../../../components';

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
}); 

export default EditProfileScreen;