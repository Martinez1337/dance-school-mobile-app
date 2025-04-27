import {useState, useEffect} from "react";
import Octicons from '@expo/vector-icons/Octicons';
import {Tabs} from 'expo-router';
import {HEADER_BACKGROUND, BOTTOM_TAB_BACKGROUND} from "../../../styles/globalStyles";
import {useSelector} from "react-redux";

const TabsLayout = () => {
  const userRole = useSelector(state => state.session.role);
  const [role, setRole] = useState(userRole);

  useEffect(() => {
    setRole(userRole);
    console.log(`userRole = ${JSON.stringify(userRole)}`);
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: {backgroundColor: HEADER_BACKGROUND},
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: 'os-regular',
        },
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
          tabBarIcon: ({color}) => <Octicons name="star" size={28} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Расписание",
          tabBarIcon: ({color}) => <Octicons name="calendar" size={28} color={color}/>,
        }}
      />
      <Tabs.Screen
        name={"(student)"}
        options={{
          title: "Записаться на занятие",
          tabBarIcon: ({color}) => <Octicons name="repo" size={28} color={color}/>,
        }}
        redirect={role !== "student"}
      />
      <Tabs.Screen
        name={"(teacher)"}
        options={{
          title: "Управление занятиями",
          tabBarIcon: ({color}) => <Octicons name="checklist" size={28} color={color}/>,
        }}
        redirect={role !== "teacher"}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          headerShown: false,
          title: "Профиль",
          tabBarIcon: ({color}) => <Octicons name="person" size={28} color={color}/>,
        }}
      />
    </Tabs>
  );
}

export default TabsLayout;
