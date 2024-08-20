import { Stack } from "expo-router";
import {globalStyles, HEADER_BACKGROUND} from "../../styles/globalStyles";

const AuthLayout = () => {
    return (
        <Stack screenOptions={{
            headerStyle: { backgroundColor: HEADER_BACKGROUND },
            headerTitleStyle: globalStyles.headerText
        }}>
            <Stack.Screen name={"index"} options={{title: "Вход"}}/>
            <Stack.Screen name={"sign-up"} options={{title: "Регистрация"}}/>
        </Stack>
    )
}

export default AuthLayout;
