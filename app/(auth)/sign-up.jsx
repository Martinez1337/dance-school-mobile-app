import React, { useState, useEffect } from 'react';
import {SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Formik} from "formik";

import {globalStyles} from "../../styles/globalStyles";
import {FormField} from "../../components";
import { Ionicons } from '@expo/vector-icons';
import SelectionModal from '../../components/modals/SelectionModal';
import {registrationValidationSchema} from "../../validation/validation";
import { apiRequest } from '../../util/apiService';

const isFormValid = (isValid, touched) => {
  return isValid && Object.keys(touched).length !== 0;
}

const onSubmitHandler = async (values) => {
  console.log(`onSubmitHandler: ${JSON.stringify(values)}`);
  const requestBody = {
    first_name: values.firstName,
    last_name: values.lastName,
    middle_name: values.middleName,
    email: values.email,
    phone_number: values.phoneNumber,
    description: values.description,
    level_id: values.level,
    password: values.password,
  }
  const response = await apiRequest({
    method: 'POST',
    url: '/auth/register',
    data: requestBody,
    requiresAuth: false,
  });
  console.log(`response: ${JSON.stringify(response)}`);
}

const SignUp = () => {
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

  return (
    <SafeAreaView style={globalStyles.mainSafeArea}>
      <KeyboardAwareScrollView
        style={globalStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={150}
      >
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            middleName: "",
            email: "",
            description: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => {
            values = {...values, level: selectedLevel};
            onSubmitHandler(values)
          }}
          validationSchema={registrationValidationSchema}
        >
          {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isValid
            }) => (
            <>
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
                label="Скажи пару слов о себе"
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

              <FormField
                field="password"
                label="Пароль"
                secureTextEntry={true}
                values={values}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />

              <FormField
                field="confirmPassword"
                label="Подтверждение пароля"
                secureTextEntry={true}
                values={values}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                handleBlur={handleBlur}
              />

              <TouchableOpacity onPress={handleSubmit}>
                <View
                  style={[
                    globalStyles.submitButton,
                    {
                      opacity: isFormValid(isValid, touched) ? 1 : 0.4,
                    }
                  ]}
                >
                  <Text style={globalStyles.buttonText}>Зарегистрироваться</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </Formik>

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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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

export default SignUp;
