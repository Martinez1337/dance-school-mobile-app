import {router, Stack} from 'expo-router';
import {TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import React from "react";

export default function StudentLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
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
        }}
      />
      <Stack.Screen
        name="schedule-slots"
        options={{
          title: 'Расписание индивидуальных занятий',
          presentation: 'push',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="schedule-groups"
        options={{
          title: 'Расписание групповых занятий',
          presentation: 'push',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="my-requests"
        options={{
          title: 'Мои заявки',
          presentation: 'push',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );
} 