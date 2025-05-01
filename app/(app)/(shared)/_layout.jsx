import React from 'react';
import {Stack, router} from 'expo-router';
import {TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {HEADER_BACKGROUND} from '../../../styles/globalStyles';

const SharedLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: HEADER_BACKGROUND},
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'os-regular'
        },
        headerTitleAlign: 'center',
        title: "Загрузка",
        headerLeft: () => {
          return (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
          );
        },
      }}
    />
  );
};

export default SharedLayout; 