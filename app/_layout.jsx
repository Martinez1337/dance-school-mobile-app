import * as SplashScreen from 'expo-splash-screen';
import {Slot, Stack} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {useFonts} from 'expo-font';
import {SessionProvider} from "../context/ctx";
import {StatusBar} from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, fontsLoadingError] = useFonts({
    'os-regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'os-bold': require('../assets/fonts/OpenSans-Bold.ttf'),
    'os-bold-it': require('../assets/fonts/OpenSans-BoldItalic.ttf'),
    'os-light': require('../assets/fonts/OpenSans-Light.ttf'),
    'os-light-it': require('../assets/fonts/OpenSans-LightItalic.ttf'),
  });

  useEffect(() => {
    if (fontsLoadingError) throw fontsLoadingError;

    if (fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null
  }

  if (appIsReady) console.log("app is ready");

  return (
    <SessionProvider>
      <>
        <Slot />
        <StatusBar style={"dark"} />
      </>
    </SessionProvider>
  );
}

export default RootLayout;
