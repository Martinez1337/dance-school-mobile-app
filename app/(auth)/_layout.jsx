import {Stack, useRouter} from "expo-router";
import {globalStyles, HEADER_BACKGROUND} from "../../styles/globalStyles";
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

const AuthLayout = () => {
  const router = useRouter();

  return (
    <Stack screenOptions={{
      headerStyle: {backgroundColor: HEADER_BACKGROUND},
      headerTitleStyle: globalStyles.headerText,
      headerTitleAlign: "center"
    }}>
      <Stack.Screen name={"index"} options={{title: "Вход"}}/>
      <Stack.Screen
        name={"sign-up"}
        options={{
          title: "Регистрация",
          headerLeft: () => (
            <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black"/>
            </TouchableOpacity>
          )
        }}
      />
    </Stack>
  )
}

export default AuthLayout;
