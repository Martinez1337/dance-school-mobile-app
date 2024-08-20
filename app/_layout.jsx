import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import {StatusBar} from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const hideSplashScreen = async () => {
    await SplashScreen.hideAsync()
}

const RootLayout = () => {
    const [appIsReady, setAppIsReady] = useState(false);

    const [fontsLoaded, error] = useFonts({
        'os-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
        'os-bold': require('../assets/fonts/OpenSans-Bold.ttf'),
        'os-bold-it': require('../assets/fonts/OpenSans-BoldItalic.ttf'),
        'os-light': require('../assets/fonts/OpenSans-Light.ttf'),
        'os-light-it': require('../assets/fonts/OpenSans-LightItalic.ttf'),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            setAppIsReady(true);
        }

        if (appIsReady) {
            hideSplashScreen()
        }

    }, [appIsReady, fontsLoaded]);

    if (!appIsReady) {
        return null;
    }

    return (
        <>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
            </Stack>
            <StatusBar style={"light"} />
        </>

    );
}

export default RootLayout;
