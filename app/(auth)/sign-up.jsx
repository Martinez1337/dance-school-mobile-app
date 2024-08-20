import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native'
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {Formik} from "formik";

import {globalStyles} from "../../styles/globalStyles";
import {FormField} from "../../components";
import {registrationValidationSchema} from "../../validation/validation";

const isFormValid = (isValid, touched) => {
    return isValid && Object.keys(touched).length !== 0;
}

const onSubmitHandler = (values) => {}

const SignUp = () => {
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
                        email: "",
                        phoneNumber: "",
                        password: "",
                        confirmPassword: "",
                    }}
                    onSubmit={onSubmitHandler}
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
                                field="description"
                                label="Скажи пару слов о себе"
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
                                field="password"
                                label="Придумай пароль"
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
                                            opacity: isFormValid(isValid, touched) ? 1 : 0.6,
                                        }
                                    ]}
                                >
                                    <Text style={globalStyles.buttonText}>Зарегистрироваться</Text>
                                </View>
                            </TouchableOpacity>
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default SignUp;
