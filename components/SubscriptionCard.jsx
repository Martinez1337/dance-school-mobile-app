import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

const SubscriptionCard = ({ item, isActive = false, onPress }) => {
  const formatLessonsCount = (count) => {
    if (typeof count === 'object') {
      return `${count.group} групп. + ${count.individual} инд.`;
    }
    return `${count} занятий`;
  };

  const formatRemainingLessons = (remaining) => {
    if (typeof remaining === 'object') {
      return `${remaining.group} групп. + ${remaining.individual} инд.`;
    }
    return `${remaining} занятий`;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>{item.price} ₽</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Срок действия:</Text>
          <Text style={styles.value}>{item.durationMonths} мес.</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Количество занятий:</Text>
          <Text style={styles.value}>{formatLessonsCount(item.lessonsCount)}</Text>
        </View>

        {isActive && (
          <>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <Text style={styles.label}>Осталось:</Text>
              <Text style={[styles.value, styles.highlight]}>
                {formatRemainingLessons(item.remainingLessons)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Действует до:</Text>
              <Text style={[styles.value, styles.highlight]}>
                {format(parseISO(item.endTime), 'd MMMM yyyy', { locale: ru })}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 380,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'os-bold',
    marginBottom: 8,
    color: '#000',
  },
  price: {
    fontSize: 28,
    fontFamily: 'os-bold',
    color: '#d903e4',
  },
  content: {
    flex: 1,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#000',
  },
  highlight: {
    color: '#d903e4',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  footer: {
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
    lineHeight: 20,
  },
});

export default SubscriptionCard; 