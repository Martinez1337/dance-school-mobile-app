import {Text, TouchableOpacity, StyleSheet} from "react-native";

const FilterTab = ({title, isActive, onPress}) => (
  <TouchableOpacity
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#d903e4',
  },
  tabText: {
    fontSize: 15,
    fontFamily: 'os-regular',
    color: '#333',
  },
  activeTabText: {
    color: 'white',
    fontFamily: 'os-bold',
  },
})

export default FilterTab;