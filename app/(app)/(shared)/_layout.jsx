import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, HEADER_BACKGROUND } from '../../../styles/globalStyles';

const SharedLayout = () => {
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: HEADER_BACKGROUND },
        headerTitleStyle: globalStyles.headerText,
        headerTitleAlign: 'center',
        headerLeft: () => {
          return (
            <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          );
        },
      }}
    />
  );
};

export default SharedLayout; 