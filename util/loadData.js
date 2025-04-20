import AsyncStorage from "@react-native-async-storage/async-storage";

// Универсальная функция для загрузки данных из AsyncStorage
const loadFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    console.log(`loading ${key} from storage: ${JSON.stringify(data)}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error loading ${key} from AsyncStorage:`, error);
    return null;
  }
};

export const loadSessionFromStorage = () => loadFromStorage('session');
export const loadUserFromStorage = () => loadFromStorage('user');
export const loadLevelFromStorage = () => loadFromStorage('level');