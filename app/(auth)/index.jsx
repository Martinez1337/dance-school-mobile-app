import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Formik} from "formik";
import {Link, router} from "expo-router";
import {useDispatch} from "react-redux";

import {authorizationValidationSchema} from "../../validation/validation";
import {FormField} from "../../components";
import {globalStyles} from "../../styles/globalStyles";
import {apiRequest, handleApiError, login} from '../../util/apiService';
import {setSession} from "../../redux/slices/sessionSlice";
import {setUser} from "../../redux/slices/userSlice";
import {setLevel} from "../../redux/slices/levelSlice";

const isFormValid = (isValid, touched) => {
  return isValid && Object.keys(touched).length !== 0;
}

const onSignInHandler = async (values, dispatch) => {
  console.log(`onSignInHandler: ${JSON.stringify(values)}`);
  const requestBody = {
    grant_type: null,
    username: values.email,
    password: values.password,
    scope: null,
    client_id: null,
    client_secret: null,
  }

  //todo Написать обработку ошибок
  try {
    const authResponse = await login(requestBody)
    console.log(`authResponse: ${JSON.stringify(authResponse)}`);
    const meResponse = await apiRequest({
      method: 'GET',
      url: '/auth/me'
    })
    console.log(`meResponse: ${JSON.stringify(meResponse)}`);

    dispatch(setSession(meResponse))
    dispatch(setUser(meResponse.user))
    if (meResponse.level) {
      dispatch(setLevel(meResponse.level))
    }

    router.replace("/(tabs)/(profile)");
  } catch (error) {handleApiError(error)}
}

const Index = () => {
  const dispatch = useDispatch();
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
            email: "",
            password: "",
          }}
          onSubmit={(values) => onSignInHandler(values, dispatch)}
          validationSchema={authorizationValidationSchema}
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
            <>
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
                field="password"
                label="Пароль"
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
                    globalStyles.signInButton,
                    {
                      opacity: isFormValid(isValid, touched) ? 1 : 0.4,
                    }
                  ]}
                >
                  <Text style={globalStyles.buttonText}>Войти</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.linkContainer}>
                <Text style={styles.footerText}>
                  Нет аккаунта?
                </Text>

                <Link href={"/sign-up"} style={styles.link}>
                  Регистрация
                </Link>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10
  },
  link: {
    color: "#d903e4",
    fontFamily: "os-bold",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  footerText: {
    fontFamily: "os-regular",
    marginRight: 5,
    fontSize: 14
  }
});

export default Index;
