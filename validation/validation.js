import * as Yup from "yup";

const phoneRegExp = /^\(?\+?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?$/
const emailRegExp = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/

export const registrationValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("Имя обязательно"),
  lastName: Yup.string().required("Фамилия обязательна"),
  email: Yup.string()
    .matches(emailRegExp, "Email некорректен")
    .required("Пожалуйста, введите email"),
  phoneNumber: Yup.string().matches(phoneRegExp, 'Номер телефона некорректен')
    .required("Пожалуйста, введите номер телефона"),
  password: Yup.string()
    .required("Пожалуйста, введите пароль")
    .min(6, "Пароль должен содержать минимум 6 символов"),
  confirmPassword: Yup.string()
    .required("Пожалуйста, подтвердите пароль")
    .oneOf([Yup.ref("password")], "Пароли не совпадают"),
});

export const authorizationValidationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegExp, "Email некорректен")
    .required("Пожалуйста, введите зарегистрированный email"),
  password: Yup.string()
    .required("Пожалуйста, введите пароль")
    .min(6, "Пароль должен содержать минимум 6 символов"),
});

export const editUserInfoValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа'),
  lastName: Yup.string()
    .required('Фамилия обязательна')
    .min(2, 'Фамилия должна содержать минимум 2 символа'),
  middleName: Yup.string()
    .min(2, 'Отчество должно содержать минимум 2 символа'),
  email: Yup.string()
    .required('Email обязателен')
    .matches(emailRegExp, 'Некорректный email'),
  phoneNumber: Yup.string()
    .required('Номер телефона обязателен')
    .matches(phoneRegExp, 'Номер телефона должен быть в формате +7XXXXXXXXXX'),
  description: Yup.string()
    .max(500, 'Описание не должно превышать 500 символов'),
});

export const editPasswordValidationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('Новый пароль обязателен')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру'
    ),
  confirmNewPassword: Yup.string()
    .required('Подтверждение пароля обязательно')
    .oneOf([Yup.ref('newPassword')], 'Пароли должны совпадать'),
});
