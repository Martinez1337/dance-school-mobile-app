import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from 'expo-router';
import { globalStyles, HEADER_BACKGROUND, BOTTOM_TAB_BACKGROUND } from "../../../styles/globalStyles";
import { useSession } from "../../../context/ctx";
import { useState, useEffect } from "react";

const TabsLayout = () => {
  const { session } = useSession();
  const [role, setRole] = useState(session);

  useEffect(() => {
    setRole(session);
  }, [session]);

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
        tabBarStyle: {backgroundColor: BOTTOM_TAB_BACKGROUND, paddingTop: 5},
        tabBarInactiveBackgroundColor: BOTTOM_TAB_BACKGROUND
      }}
      backBehavior={"history"}
      initialRouteName={"index"}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: "Мероприятия",
          tabBarIcon: ({color}) => <Octicons name="star" size={28} color={color} />,
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
        name={"(student)"}
        options={{
          title: "Записаться на занятие",
          tabBarIcon: ({color}) => <Octicons name="repo" size={28} color={color} />,
        }}
        redirect={role !== "Student"}
      />
      <Tabs.Screen
        name={"(teacher)"}
        options={{
          title: "Управление занятиями",
          tabBarIcon: ({color}) => <Octicons name="checklist" size={28} color={color} />,
        }}
        redirect={role !== "Teacher"}
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
