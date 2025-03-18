import {Text} from "react-native";
import {Redirect, Stack} from "expo-router";
import {useSession} from "../../context/ctx";

export default function AppLayout() {
  const {session, isLoading} = useSession();

  if (isLoading) {
    console.log("Session loading...")
    // todo: add loading screen
    return <Text>Loading...</Text>;
  }

  if (!session) {
    console.log("[AppLayout] Redirecting to /sign-in");
    return <Redirect href="/(auth)" />;
  }

  console.log(`Entering session ${session}`)

  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(shared)" />
    </Stack>
  );
}