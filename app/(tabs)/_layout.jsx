import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { globalStyles, HEADER_BACKGROUND } from "../../styles/globalStyles";

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: HEADER_BACKGROUND },
                headerTitleStyle: globalStyles.headerText,
                headerTitleAlign: 'center',
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: '#979696',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontFamily: "os-bold",
                    fontSize: 10
                },
                tabBarStyle: { backgroundColor: HEADER_BACKGROUND },
                tabBarInactiveBackgroundColor: HEADER_BACKGROUND
            }}
            backBehavior={"history"}
            initialRouteName={"index"}>
            <Tabs.Screen
                name="events"
                options={{
                    title: "Мероприятия",
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="star" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: "Расписание",
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="calendar" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="(profile)"
                options={{
                    headerShown: false,
                    title: "Профиль",
                    tabBarIcon: ({color}) => <FontAwesome size={28} name="user" color={color}/>,
                }}
            />
        </Tabs>
    );
}

export default TabsLayout;
