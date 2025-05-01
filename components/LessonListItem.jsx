import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';

const LessonListItem = ({item, onPress}) => {
  const isGroupLesson = item.lesson_type.is_group;
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(item)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{item?.name}</Text>
        {isGroupLesson && (
          <View style={styles.levelContainer}>
            <Text style={styles.levelLabel}>Уровень: </Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{item?.group?.level?.name || 'Не указан'}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Тип занятия:</Text>
          <Text style={styles.value}>{isGroupLesson ? 'Групповое занятие' : 'Индивидуальное занятие'}</Text>
        </View>
        
        {isGroupLesson && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Группа:</Text>
            <Text style={styles.value}>{item?.group?.name}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Зал:</Text>
          <Text style={styles.value}>{item?.classroom?.name || 'Не указан'}</Text>
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.time}>
            {format(parseISO(item?.start_time), 'HH:mm', {locale: ru})} - {format(parseISO(item?.finish_time), 'HH:mm', {locale: ru})}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    fontFamily: 'os-bold',
  },
  levelContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  levelLabel: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'os-regular',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 15,
    backgroundColor: 'rgba(217,3,228,0.25)'
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#d903e4'
  },
  infoContainer: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'os-regular',
  },
  value: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'os-regular',
  },
  timeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    alignItems: 'center',
  },
  time: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'os-bold',
  },
});

export default LessonListItem;
