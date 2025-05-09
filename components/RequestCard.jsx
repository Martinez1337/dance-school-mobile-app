import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const statusColors = {
  pending: {
    background: '#FFF9C4',
    text: '#FBC02D',
    icon: 'time-outline'
  },
  approved: {
    background: '#C8E6C9',
    text: '#4CAF50',
    icon: 'checkmark-circle-outline'
  },
  rejected: {
    background: '#FFCDD2',
    text: '#F44336',
    icon: 'close-circle-outline'
  }
};

const RequestCard = ({ request }) => {
  const formattedDate = format(
    parseISO(request.created_at),
    'd MMMM yyyy',
    { locale: ru }
  );

  const getStatusText = () => {
    switch (request) {
      case request.terminated: return 'Отклонена';
      case !request.terminated && request.is_confirmed: return 'Одобрена';
      case !request.terminated && !request.is_confirmed: return 'На рассмотрении';
      default: return 'На рассмотрении';
    }
  };

  const getStatusStyle = () => {
    switch (request) {
      case request.terminated: return statusColors['rejected'];
      case !request.terminated && request.is_confirmed: return statusColors['approved'];
      case !request.terminated && !request.is_confirmed: return statusColors['pending'];
      default: return statusColors['pending'];
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Заявка на индивидуальное занятие
        </Text>
        <View style={[
          styles.statusBadge,
          {backgroundColor: getStatusStyle().background}
        ]}>
          <Ionicons name={getStatusStyle().icon} size={16} color={getStatusStyle().text} />
          <Text style={[getStatusStyle().statusText, {color: getStatusStyle().text}]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        {request?.actual_teachers[0]?.user && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Преподаватель:</Text>
            <Text style={styles.value}>
              {request?.actual_teachers[0]?.user?.last_name} {request?.actual_teachers[0]?.user?.first_name} {request?.actual_teachers[0]?.user?.middle_name}
            </Text>
          </View>
        )}
        
        {request?.lesson_type && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Стиль танца:</Text>
            <Text style={styles.value}>{request?.lesson_type?.dance_style?.name}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Дата создания:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'os-regular',
    marginLeft: 4,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  comment: {
    fontSize: 14,
    fontFamily: 'os-regular',
    color: '#666',
    flex: 1,
  },
  commentLabel: {
    fontFamily: 'os-semibold',
    color: '#333',
  },
});

export default RequestCard; 