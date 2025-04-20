import {Stack, useRouter} from "expo-router";
import {TouchableOpacity} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch} from "react-redux";

import {globalStyles, HEADER_BACKGROUND} from "../../../../styles/globalStyles";
import {logout} from "../../../../util/apiService";
import {clearUser} from "../../../../redux/slices/userSlice";
import {clearSession} from "../../../../redux/slices/sessionSlice";
import {clearLevel} from "../../../../redux/slices/levelSlice";

const ProfileLayout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

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
              onPress={async () => {
                await logout();
                dispatch(clearSession());
                dispatch(clearUser());
                dispatch(clearLevel());
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
    </Stack>
  )
}

export default ProfileLayout;
