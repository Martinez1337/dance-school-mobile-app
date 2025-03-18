import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

const FilterTab = ({ title, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.tab, isActive && styles.activeTab]} 
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const GroupFilterModal = ({ 
  visible, 
  onClose, 
  teachers,
  selectedTeachers,
  onTeacherSelect,
  levels,
  selectedLevels,
  onLevelSelect,
  groups,
  selectedGroups,
  onGroupSelect,
  onReset,
  onApply
}) => {
  const [activeTab, setActiveTab] = useState('teachers');

  const renderTeachersList = () => (
    <ScrollView style={styles.contentContainer}>
      {teachers.map(teacher => (
        <TouchableOpacity
          key={teacher.id}
          style={styles.itemContainer}
          onPress={() => onTeacherSelect(teacher.id)}
        >
          <Text style={styles.itemText}>
            {teacher.firstName} {teacher.lastName}
          </Text>
          <View style={[
            styles.checkbox,
            selectedTeachers.includes(teacher.id) && styles.checkboxSelected
          ]}>
            {selectedTeachers.includes(teacher.id) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLevelsList = () => (
    <ScrollView style={styles.contentContainer}>
      {levels.map(level => (
        <TouchableOpacity
          key={level}
          style={styles.itemContainer}
          onPress={() => onLevelSelect(level)}
        >
          <Text style={styles.itemText}>{level}</Text>
          <View style={[
            styles.checkbox,
            selectedLevels.includes(level) && styles.checkboxSelected
          ]}>
            {selectedLevels.includes(level) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderGroupsList = () => (
    <ScrollView style={styles.contentContainer}>
      {groups.map(group => (
        <TouchableOpacity
          key={group.id}
          style={styles.itemContainer}
          onPress={() => onGroupSelect(group.id)}
        >
          <Text style={styles.itemText}>{group.name}</Text>
          <View style={[
            styles.checkbox,
            selectedGroups.includes(group.id) && styles.checkboxSelected
          ]}>
            {selectedGroups.includes(group.id) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const getActiveContent = () => {
    switch (activeTab) {
      case 'teachers':
        return renderTeachersList();
      case 'levels':
        return renderLevelsList();
      case 'groups':
        return renderGroupsList();
      default:
        return null;
    }
  };

  const hasAnyFilters = 
    selectedTeachers.length > 0 || 
    selectedLevels.length > 0 || 
    selectedGroups.length > 0;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
              <Text style={styles.title}>Фильтры</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              </View>

              <View style={styles.tabsContainer}>
              <FilterTab 
                  title="Преподаватели" 
                  isActive={activeTab === 'teachers'} 
                  onPress={() => setActiveTab('teachers')}
              />
              <FilterTab 
                  title="Уровни" 
                  isActive={activeTab === 'levels'} 
                  onPress={() => setActiveTab('levels')}
              />
              <FilterTab 
                  title="Группы" 
                  isActive={activeTab === 'groups'} 
                  onPress={() => setActiveTab('groups')}
              />
              </View>

              {getActiveContent()}

              <View style={styles.footer}>
              {hasAnyFilters && (
                  <TouchableOpacity 
                  style={styles.resetButton} 
                  onPress={onReset}
                  >
                  <Text style={styles.resetButtonText}>Сбросить</Text>
                  </TouchableOpacity>
              )}
              <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={onApply}
              >
                  <Text style={styles.applyButtonText}>Применить</Text>
              </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>   
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'os-bold',
  },
  closeButton: {
    padding: 5,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#d903e4',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'os-regular',
  },
  activeTabText: {
    color: '#d903e4',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'os-regular',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d903e4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#d903e4',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d903e4',
  },
  resetButtonText: {
    color: '#d903e4',
    fontSize: 16,
    fontFamily: 'os-regular',
  },
  applyButton: {
    flex: 1,
    marginLeft: 10,
    backgroundColor: '#d903e4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'os-regular',
  },
});

export default GroupFilterModal; 