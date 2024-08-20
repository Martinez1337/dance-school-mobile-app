import React from 'react'
import {Stack, useRouter} from "expo-router";
import {globalStyles, HEADER_BACKGROUND} from "../../../styles/globalStyles";
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ProfileLayout = () => {
    const router = useRouter();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {backgroundColor: HEADER_BACKGROUND},
                headerTitleStyle: globalStyles.headerText,
                headerTitleAlign: 'center',
            }}
        >
            <Stack.Screen name={"index"} options={{
                title: "Профиль",
                headerRight: () => (
                    <TouchableOpacity
                        style={{marginRight: 5}}
                        onPress={() => router.push('/settings')}
                    >
                        <Ionicons name="settings-outline" size={24} color="white"/>
                    </TouchableOpacity>
                )
            }}/>
            <Stack.Screen name={"settings"} options={{
                title: "Настройки",
                headerLeft: () => (
                    <TouchableOpacity style={globalStyles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                ),
            }}/>
        </Stack>
    )
}

export default ProfileLayout;
