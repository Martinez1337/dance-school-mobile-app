import AsyncStorage from '@react-native-async-storage/async-storage';

// Универсальная функция для создания middleware для персистентного хранения
const createPersistMiddleware = ({ storageKey, actionPrefix, reducerKey, clearAction }) => {
  return store => next => action => {
    const result = next(action);
    if (action.type === `${actionPrefix}${clearAction}`) {
      AsyncStorage.removeItem(storageKey)
        .then(async () => {
          const data = await AsyncStorage.getItem(storageKey);
          console.log(`${storageKey}:`, data);
        })
        .catch(error => console.error(`Error removing ${storageKey} from AsyncStorage:`, error));
    } else if (action.type.startsWith(actionPrefix) && !action.payload?.fromStorage) {
      const state = store.getState()[reducerKey];
      AsyncStorage.setItem(storageKey, JSON.stringify(state))
        .catch(error => console.error(`Error saving ${storageKey} to AsyncStorage:`, error));
    }

    return result;
  };
};

// Создание middleware для сессии
export const persistSessionMiddleware = createPersistMiddleware({
  storageKey: 'session',
  actionPrefix: 'session/',
  reducerKey: 'session',
  clearAction: 'clearSession',
});

// Создание middleware для пользователя
export const persistUserMiddleware = createPersistMiddleware({
  storageKey: 'user',
  actionPrefix: 'user/',
  reducerKey: 'user',
  clearAction: 'clearUser',
});

// Создание middleware для уровня
export const persistLevelMiddleware = createPersistMiddleware({
  storageKey: 'level',
  actionPrefix: 'level/',
  reducerKey: 'level',
  clearAction: 'clearLevel',
});