import {Stack} from 'expo-router';
import {HEADER_BACKGROUND} from '../../../../styles/globalStyles';

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: HEADER_BACKGROUND},
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'os-regular',
          color: "black"
        },
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        title: "Загрузка",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Управление',
        }}
      />
    </Stack>
  );
} 