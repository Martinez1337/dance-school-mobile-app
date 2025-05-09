import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionTemplateCard = ({ item, isActive = false, onPress }) => {
  const hasGroupLessons = item?.lesson_types?.some((type) => type?.is_group === true);
  const hasIndividualLessons = item?.lesson_types?.some((type) => type?.is_group === false);
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {item?.name}
          </Text>
          <Text style={styles.subtitle}>
            {item?.description}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="bookmarks-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Тип занятий: {hasGroupLessons && hasIndividualLessons
              ? "Групповые, Индивидуальные"
              : hasGroupLessons
                ? "Групповые"
                : hasIndividualLessons
                  ? "Индивидуальные"
                  : "Не указаны"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="calendar-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Количество занятий: {item?.lesson_count}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="time-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Доступен до: { item?.expiration_date
              ? format(parseISO(item?.expiration_date), 'yyyy-MM-dd', {locale: ru})
              : "Не указано"
            }
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons name="pricetag-outline" size={20} color="#333" />
            </View>
            <Text style={styles.infoText}>
              Цена: {item?.price}₽
            </Text>
          </View>

          <View style={styles.lessonTypesContainer}>
            <Text style={styles.lessonTypesTitle}>Доступные занятия:</Text>

            {(item.lesson_types?.map(item => (
                <View key={item.id} style={styles.lessonTypeRow}>
                  <Ionicons name="information-circle-outline" size={20} color="#333" />
                  <Text style={styles.lessonTypeText}>{item.dance_style?.name}</Text>
                </View>
              ))
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
    marginHorizontal: -10,
    marginVertical: 10,
    height: 500,
    width: 325,
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
    flexWrap: "wrap"
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

export default SubscriptionTemplateCard;