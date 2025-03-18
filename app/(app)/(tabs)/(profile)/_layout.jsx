import React from 'react'
import {Stack, useRouter} from "expo-router";
import {globalStyles, HEADER_BACKGROUND} from "../../../../styles/globalStyles";
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useSession} from "../../../../context/ctx";

const ProfileLayout = () => {
  const router = useRouter();
  const { signOut } = useSession()

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {backgroundColor: HEADER_BACKGROUND},
        headerTitleStyle: globalStyles.headerText,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name={"index"}
        options={{
          title: "Профиль",
          headerRight: () => (
            <TouchableOpacity
              style={{marginRight: 5}}
              onPress={() => {
                signOut();
                // router.push("/settings")
              }}
            >
              <Ionicons name="log-out-outline" size={24} color="black"/>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(app)/(shared)/my-groups')}
              style={{marginLeft: 5}}
            >
              <Ionicons name="people-outline" size={24} color="black"/>
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name={"settings"}
        options={{
          title: "Настройки",
          headerLeft: () => (
            <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black"/>
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  )
}

export default ProfileLayout;
