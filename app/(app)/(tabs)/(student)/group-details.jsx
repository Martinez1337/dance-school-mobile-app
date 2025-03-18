import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function GroupDetails() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Детали занятия группы</Text>
      {/* Здесь будет информация о занятии группы */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'os-bold',
    paddingVertical: 5,
    marginLeft: 16
  },
}); 