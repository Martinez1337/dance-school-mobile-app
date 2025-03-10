import {Text} from "react-native";
import {Redirect, Slot} from "expo-router";
import {useSession} from "../../context/ctx";

export default function AppLayout() {
  const {session, isLoading} = useSession();

  if (isLoading) {
    console.log("Session loading...")
    // Consider replacing with a proper LoadingScreen component
    return <Text>Loading...</Text>;
  }

  if (!session) {
    console.log("[AppLayout] Redirecting to /sign-in");
    return <Redirect href="/(auth)" />;
  }

  console.log(`Entering session ${session}`)

  return <Slot />;
}