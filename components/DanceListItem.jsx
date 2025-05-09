import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

const DanceListItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardContent}>
      <Image
        source={item.dance_style.photo_url}
        style={styles.image}
        placeholder={require("../assets/images/placeholder-image.png")}
        focusable={false}
        contentFit={'cover'}
      />
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle}>{item.dance_style.name}</Text>
        <Text style={styles.cardDescription}>{item.dance_style.description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    alignItems: 'center',
    borderColor: '#e1e1e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'os-bold',
    marginTop: 8,
    alignSelf: "center"
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default DanceListItem; 