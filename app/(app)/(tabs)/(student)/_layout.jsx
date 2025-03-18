import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

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
        headerBackTitleVisible: false,
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Выбор вида танцев',
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
        name="group-details"
        options={{
          title: 'Детали занятия группы',
        }}
      />
    </Stack>
  );
} 