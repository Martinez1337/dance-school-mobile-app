import { Stack } from 'expo-router';

export default function StudentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'os-regular',
        },
        headerTitleAlign: 'center',
        headerBackTitleVisible: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Запись на занятия',
          headerShown: false
        }}
      />
      <Stack.Screen
        name="schedule-slots"
        options={{
          title: 'Расписание индивидуальных занятий',
          presentation: 'push'
        }}
      />
      <Stack.Screen
        name="schedule-groups"
        options={{
          title: 'Расписание групповых занятий',
          presentation: 'push'
        }}
      />
      <Stack.Screen
        name="my-requests"
        options={{
          title: 'Мои заявки',
          presentation: 'push'
        }}
      />
    </Stack>
  );
} 