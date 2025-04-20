import React, {useEffect, useState} from 'react';
import {Slot} from "expo-router";
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from "expo-status-bar";
import {Provider} from "react-redux";

import store from "../redux/store";
import {setUser} from "../redux/slices/userSlice";
import {setSession} from "../redux/slices/sessionSlice";
import {setLevel} from "../redux/slices/levelSlice";
import {loadLevelFromStorage, loadSessionFromStorage, loadUserFromStorage} from "../util/loadData";

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
    const prepareApp = async () => {
      try {
        if (fontsLoadingError) throw fontsLoadingError;

        if (fontsLoaded) {
          // Загружаем данные сессии из AsyncStorage
          const storedSession = await loadSessionFromStorage();
          if (storedSession && Object.keys(storedSession).length > 0) {
            store.dispatch(setSession({...storedSession, fromStorage: true}));
          }

          // Загружаем данные пользователя из AsyncStorage
          const storedUser = await loadUserFromStorage();
          if (storedUser && Object.keys(storedUser).length > 0) {
            store.dispatch(setUser({...storedUser, fromStorage: true}));
          }

          // Загружаем данные пользователя из AsyncStorage
          const storedLevel = await loadLevelFromStorage();
          if (storedLevel && Object.keys(storedLevel).length > 0) {
            store.dispatch(setLevel({...storedLevel, fromStorage: true}));
          }

          setAppIsReady(true);
        }
      } catch (error) {
        console.error('Error preparing app:', error);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null
  }

  if (appIsReady) {
    console.log("app is ready");
  }

  return (
    <Provider store={store}>
      <>
        <Slot/>
        <StatusBar style={"dark"}/>
      </>
    </Provider>
  );
}

export default RootLayout;
