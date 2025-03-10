import FontAwesome from '@expo/vector-icons/FontAwesome';
import Octicons from '@expo/vector-icons/Octicons';
import {Tabs} from 'expo-router';
import {globalStyles, HEADER_BACKGROUND} from "../../../styles/globalStyles";
import {useState} from "react";

const TabsLayout = () => {
  const [role, setRole] = useState("student");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: HEADER_BACKGROUND},
        headerTitleStyle: globalStyles.headerText,
        headerTitleAlign: 'center',
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: '#979696',
        tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontFamily: "os-bold",
          fontSize: 10,
          paddingTop: 5,
        },
        tabBarStyle: {backgroundColor: HEADER_BACKGROUND, paddingTop: 5},
        tabBarInactiveBackgroundColor: HEADER_BACKGROUND
      }}
      backBehavior={"history"}
      initialRouteName={"index"}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: "Мероприятия",
          tabBarIcon: ({color}) => <Octicons name="feed-star" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Расписание",
          tabBarIcon: ({color}) => <Octicons name="calendar" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="temp"
        options={{
          title: "temp",
          tabBarIcon: ({color}) => <FontAwesome size={28} name="star" color={color} />,
        }}
        redirect={role === "teacher"} /* Это один из способов ограничить функционал по ролям */
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          headerShown: false,
          title: "Профиль",
          tabBarIcon: ({color}) => <Octicons name="person" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;
