import {SafeAreaView, StyleSheet, Text} from 'react-native'
import { Link } from "expo-router";

const Temp = () => {
    return (
        <SafeAreaView style={styles.container}>
            {/*<Text>Elcentro App</Text>*/}
            {/*<Link replace href={"/(tabs)"} style={{color: "blue"}}>Go to TabsScreen</Link>*/}
            {/*<Link replace href={"/(auth)"} style={{color: "blue"}}>Go to AuthScreen</Link>*/}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default Temp;
