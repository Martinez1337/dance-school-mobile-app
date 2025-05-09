import axios from 'axios';
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from "react-native";

// Создаем экземпляр axios с настройками по умолчанию
const apiClient = axios.create({
  baseURL: Constants.expoConfig.extra.API_URL,
  timeout: 10000,
  headers: {
    'accept': 'application/json'
  },
});

/**
 * Универсальная функция для выполнения HTTP-запросов
 * @param {string} method - HTTP-метод (get, post, put, delete и т.д.)
 * @param {string} url - Конечная точка API (без базового URL)
 * @param {object} data - Данные для отправки (для POST, PUT и т.д.)
 * @param {object} params - Query-параметры для GET-запросов
 * @param {boolean} requiresAuth - Требуется ли авторизация (по умолчанию true)
 * @returns {Promise} - Ответ от сервера или ошибка
 */
const apiRequest = async ({
  method = 'get',
  url,
  data = null,
  params = null,
  requiresAuth = true,
  headers = {},
}) => {
  try {
    // Получаем токен из AsyncStorage, если требуется авторизация
    if (requiresAuth) {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Токен авторизации не найден. Пожалуйста, войдите в систему.');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient({
      method,
      url,
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.detail || 'Ошибка сервера';
      throw new Error(`Ошибка ${status}: ${message}`, {cause: error});
    } else if (error.request) {
      throw new Error('Нет соединения с сервером. Проверьте интернет соединение.', {cause: error});
    } else {
      throw new Error(error.message || 'Произошла ошибка при выполнении запроса.', {cause: error});
    }
  }
};

// Функция для выполнения запроса авторизации
const login = async (credentials) => {
  const response = await apiRequest({
    method: 'post',
    url: '/auth/token',
    data: credentials,
    requiresAuth: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  // Сохраняем токен в AsyncStorage
  if (response.access_token) {
    await AsyncStorage.setItem('accessToken', response.access_token);
  }

  return response;
};

// Функция для выхода из системы
const logout = async () => {
  await AsyncStorage.removeItem('authToken');
};

// Функция показа сообщения об ошибке
const handleApiError = (error) => {
  console.log("Ошибка: ", error);
  Alert.alert('Ошибка', error.message, [{ text: 'OK' }]);
};

const createPaginatedFetcher = ({url, defaultParams = {}} = {}) => {
  return async (page = 0, limit = 20, additionalParams = {}) => {
    try {
      const offset = page * limit;
      return await apiRequest({
        method: 'POST',
        url: `${url}?order_by=created_at&desc=true&offset=${offset}&limit=${limit}`,
        data: {
          ...defaultParams,
          ...additionalParams
        }
      });
    } catch (error) {
      handleApiError(error);
      return null;
    }
  };
};

export {
  apiRequest,
  login,
  logout,
  handleApiError,
  createPaginatedFetcher
};