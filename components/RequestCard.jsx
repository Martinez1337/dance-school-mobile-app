import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
  const { status = 'pending' } = request;
  const statusStyle = statusColors[status] || statusColors.pending;
  
  // Форматируем дату создания заявки
  const formattedDate = format(
    parseISO(request.createdAt), 
    'd MMMM yyyy', 
    { locale: ru }
  );
  
  // Получаем подходящий текст для статуса
  const getStatusText = () => {
    switch(status) {
      case 'approved': return 'Одобрена';
      case 'rejected': return 'Отклонена';
      default: return 'На рассмотрении';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {request.type === 'group' ? 'Заявка на групповое занятие' : 'Заявка на индивидуальное занятие'}
        </Text>
        <View style={[
          styles.statusBadge, 
          {backgroundColor: statusStyle.background}
        ]}>
          <Ionicons name={statusStyle.icon} size={16} color={statusStyle.text} />
          <Text style={[styles.statusText, {color: statusStyle.text}]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        {request.groupName && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Группа:</Text>
            <Text style={styles.value}>{request.groupName}</Text>
          </View>
        )}
        
        {request.teacherName && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Преподаватель:</Text>
            <Text style={styles.value}>{request.teacherName}</Text>
          </View>
        )}
        
        {request.danceStyle && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Стиль танца:</Text>
            <Text style={styles.value}>{request.danceStyle}</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Дата создания:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        {request.comment && (
          <Text style={styles.comment}>
            <Text style={styles.commentLabel}>Комментарий: </Text>
            {request.comment}
          </Text>
        )}
        
        <Ionicons name="chevron-forward" size={20} color="#999" />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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