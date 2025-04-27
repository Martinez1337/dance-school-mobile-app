import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SelectionModal = ({ 
  visible, 
  onClose, 
  onSelect, 
  title, 
  items,
  selectedValue,
  labelExtractor,
  valueExtractor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => {
      const label = labelExtractor ? labelExtractor(item) : (item.label || item.name || item);
      return String(label).toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    setFilteredItems(filtered);
  }, [searchQuery, items, labelExtractor]);

  const isItemSelected = (item) => {
    if (selectedValue === undefined || selectedValue === null) return false;
    
    const itemValue = valueExtractor ? valueExtractor(item) : (item.value || item.id || item);
    
    return String(selectedValue) === String(itemValue);
  };
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        
        {filteredItems?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ничего не найдено</Text>
          </View>
        ) : (
          <FlatList
            data={filteredItems}
            keyExtractor={(item, index) => `item-${index}`}
            renderItem={({ item }) => {
              const label = labelExtractor ? labelExtractor(item) : (item.label || item.name || item);
              const value = valueExtractor ? valueExtractor(item) : (item.value || item.id || item);
              const selected = isItemSelected(item);
              
              return (
                <TouchableOpacity
                  style={[
                    styles.item, 
                    selected && styles.selectedItem
                  ]}
                  onPress={() => {
                    onSelect(value);
                    onClose();
                  }}
                >
                  <Text 
                    style={[
                      styles.itemText, 
                      selected && styles.selectedItemText
                    ]}
                  >
                    {label}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark" size={24} color="#d903e4" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontFamily: 'os-bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontFamily: 'os-regular',
  },
  clearButton: {
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedItem: {
    backgroundColor: 'rgba(217, 3, 228, 0.08)',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
    flex: 1,
  },
  selectedItemText: {
    fontFamily: 'os-semibold',
    color: '#d903e4',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#999',
    textAlign: 'center',
  },
});

export default SelectionModal;
