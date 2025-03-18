import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';

const SlotCard = ({ item, selectedSlot, setSelectedSlot }) => {
  return (
    <TouchableOpacity
      style={[styles.slotCard, selectedSlot === item ? styles.selectedSlot : null]}
      onPress={() => setSelectedSlot(selectedSlot === item ? null : item)}
    >
      <View style={styles.slotHeader}>
        <Text style={styles.slotTime}>{`${format(parseISO(item.startTime), 'HH:mm')} - ${format(parseISO(item.endTime), 'HH:mm')}`}</Text>
        <Text style={styles.slotDanceType}>{item.danceType}</Text>
      </View>
      <View style={styles.slotFooter}>
        <Image source={item.teacherImage} style={styles.teacherImage} />
        <Text style={styles.teacherName}>{item.teacherName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  slotCard: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  slotDanceType: {
    fontSize: 14,
    color: '#666',
  },
  slotFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  teacherName: {
    fontSize: 14,
    color: '#333',
  },
  selectedSlot: {
    borderColor: '#d903e4',
    borderWidth: 2,
  },
});

export default SlotCard;
 