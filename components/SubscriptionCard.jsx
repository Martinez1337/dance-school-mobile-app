import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionCard = ({ item, isActive = false, onPress }) => {
  const formatLessonsCount = (count) => {
    if (typeof count === 'object') {
      return `${count.group} групп. + ${count.individual} инд.`;
    }
    return count;
  };

  const formatRemainingLessons = (remaining) => {
    if (typeof remaining === 'object') {
      return `${remaining.group} групп. + ${remaining.individual} инд.`;
    }
    return remaining;
  };

  const calculateDurationMonths = (days) => {
    return Math.round(days / 30);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {typeof item.lessonsCount === 'object' 
              ? `${item.lessonsCount.group + item.lessonsCount.individual} занятий`
              : `${item.lessonsCount} ${item.lessonsCount === 4 ? 'групповых' : ''} занятия`
            }
          </Text>
          <Text style={styles.subtitle}>
            {item.description || 'Наш самый популярный абонемент'}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Количество занятий: {formatLessonsCount(item.lessonsCount)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Цена: {item.price}₽
            </Text>
          </View>

          <View style={styles.lessonTypesContainer}>
            <Text style={styles.lessonTypesTitle}>Доступные занятия:</Text>
            
            {(item.lessonType === 'group' || item.lessonType === 'combined') && (
              <View style={styles.lessonTypeRow}>
                <Ionicons name="information-circle-outline" size={20} color="#333" />
                <Text style={styles.lessonTypeText}>Групповые занятия по танго</Text>
              </View>
            )}
            
            {(item.lessonType === 'group' || item.lessonType === 'combined') && (
              <View style={styles.lessonTypeRow}>
                <Ionicons name="information-circle-outline" size={20} color="#333" />
                <Text style={styles.lessonTypeText}>Групповые занятия по хип-хопу</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <Text style={styles.actionButtonText}>
              {isActive ? 'Продлить абонемент' : 'Оставить заявку'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 16,
    marginVertical: 10,
    height: 420, 
    width: 300,
  },
  contentContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'os-bold',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#555',
  },
  infoContainer: {
    paddingHorizontal: 16,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
  },
  lessonTypesContainer: {
    marginTop: 8,
  },
  lessonTypesTitle: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#333',
    marginBottom: 8,
  },
  lessonTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  lessonTypeText: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#333',
    marginLeft: 8,
  },
  buttonContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'os-bold',
  },
});

export default SubscriptionCard; 