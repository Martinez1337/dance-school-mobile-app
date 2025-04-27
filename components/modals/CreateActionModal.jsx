import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CreateActionModal = ({ visible, onClose, onCreateIndividual, onCreateTimeSlot }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={onCreateIndividual}
          >
            <Ionicons name="person-outline" size={24} color="#d903e4" />
            <Text style={styles.optionText}>Создать индивидуальное занятие</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity 
            style={styles.option} 
            onPress={onCreateTimeSlot}
          >
            <Ionicons name="time-outline" size={24} color="#d903e4" />
            <Text style={styles.optionText}>Создать свободный слот</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    maxWidth: 400,
    paddingHorizontal: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
});

export default CreateActionModal; 