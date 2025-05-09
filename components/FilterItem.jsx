import {Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const FilterItem = ({item, isSelected, onSelect, textExtractor}) => (
  <TouchableOpacity
    style={styles.itemContainer}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
      {textExtractor(item)}
    </Text>
    <View style={[
      styles.checkbox,
      isSelected && styles.checkboxSelected
    ]}>
      {isSelected && (
        <Ionicons name="checkmark" size={18} color="white"/>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#d903e4',
    borderColor: '#d903e4',
  },
})

export default FilterItem;