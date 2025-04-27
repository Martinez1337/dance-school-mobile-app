import {useState, useEffect} from 'react';
import {Redirect, Stack} from "expo-router";
import {useSelector} from "react-redux";

export default function AppLayout() {
  const isUserLoaded = useSelector(state => state.session.isLoaded);
  const [loaded, setLoaded] = useState(isUserLoaded);

  useEffect(() => {
    console.log('isUserLoaded = ', isUserLoaded);
    setLoaded(isUserLoaded);
  }, [isUserLoaded]);

  if (!loaded) {
    console.log("[AppLayout] Redirecting to /sign-in");
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(shared)" />
    </Stack>
  );
}