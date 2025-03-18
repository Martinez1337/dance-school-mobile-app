import { Stack } from 'expo-router';
import { globalStyles, HEADER_BACKGROUND } from '../../../../styles/globalStyles';

export default function TeacherLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: HEADER_BACKGROUND },
        headerTitleStyle: globalStyles.headerText,
        headerTitleAlign: 'center',
        headerTintColor: 'white',
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