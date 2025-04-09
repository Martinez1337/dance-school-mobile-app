import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

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

const defaultCategoryProps = {
  items: [],
  selectedItems: [],
  onItemSelect: () => {},
};

const GroupFilterModal = ({ 
  visible = false, 
  onClose = () => {},
  onReset = () => {},
  onApply = () => {},
  filters = {
    teachers: { ...defaultCategoryProps },
    levels: { ...defaultCategoryProps },
    groups: { ...defaultCategoryProps },
    danceTypes: { ...defaultCategoryProps },
    subscriptionTypes: { ...defaultCategoryProps },
  }
}) => {
  const [activeTab, setActiveTab] = useState('teachers');

  const hasTeachers = filters.teachers?.items?.length > 0;
  const hasLevels = filters.levels?.items?.length > 0;
  const hasGroups = filters.groups?.items?.length > 0;
  const hasDanceTypes = filters.danceTypes?.items?.length > 0;
  const hasSubscriptionTypes = filters.subscriptionTypes?.items?.length > 0;

  useEffect(() => {
    if (hasTeachers) setActiveTab('teachers');
    else if (hasLevels) setActiveTab('levels');
    else if (hasGroups) setActiveTab('groups');
    else if (hasDanceTypes) setActiveTab('danceTypes');
    else if (hasSubscriptionTypes) setActiveTab('subscriptions');
  }, []);

  const renderTeachersList = () => (
    <ScrollView style={styles.contentContainer}>
      {filters.teachers.items.map(teacher => (
        <TouchableOpacity
          key={teacher.id}
          style={styles.itemContainer}
          onPress={() => filters.teachers.onItemSelect(teacher.id)}
        >
          <Text style={styles.itemText}>
            {teacher.firstName} {teacher.lastName}
          </Text>
          <View style={[
            styles.checkbox,
            filters.teachers.selectedItems.includes(teacher.id) && styles.checkboxSelected
          ]}>
            {filters.teachers.selectedItems.includes(teacher.id) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderLevelsList = () => (
    <ScrollView style={styles.contentContainer}>
      {filters.levels.items.map(level => (
        <TouchableOpacity
          key={level}
          style={styles.itemContainer}
          onPress={() => filters.levels.onItemSelect(level)}
        >
          <Text style={styles.itemText}>{level}</Text>
          <View style={[
            styles.checkbox,
            filters.levels.selectedItems.includes(level) && styles.checkboxSelected
          ]}>
            {filters.levels.selectedItems.includes(level) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderGroupsList = () => (
    <ScrollView style={styles.contentContainer}>
      {filters.groups.items.map(group => (
        <TouchableOpacity
          key={group.id}
          style={styles.itemContainer}
          onPress={() => filters.groups.onItemSelect(group.id)}
        >
          <Text style={styles.itemText}>{group.name}</Text>
          <View style={[
            styles.checkbox,
            filters.groups.selectedItems.includes(group.id) && styles.checkboxSelected
          ]}>
            {filters.groups.selectedItems.includes(group.id) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDanceTypesList = () => (
    <ScrollView style={styles.contentContainer}>
      {filters.danceTypes.items.map(danceType => (
        <TouchableOpacity
          key={danceType.id}
          style={styles.itemContainer}
          onPress={() => filters.danceTypes.onItemSelect(danceType.id)}
        >
          <Text style={styles.itemText}>{danceType.name}</Text>
          <View style={[
            styles.checkbox,
            filters.danceTypes.selectedItems.includes(danceType.id) && styles.checkboxSelected
          ]}>
            {filters.danceTypes.selectedItems.includes(danceType.id) && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderSubscriptionTypesList = () => (
    <ScrollView style={styles.contentContainer}>
      {filters.subscriptionTypes.items.map(subType => (
        <TouchableOpacity
          key={subType.id}
          style={styles.itemContainer}
          onPress={() => filters.subscriptionTypes.onItemSelect(subType.id)}
        >
          <Text style={styles.itemText}>{subType.name}</Text>
          <View style={[
            styles.checkbox,
            filters.subscriptionTypes.selectedItems.includes(subType.id) && styles.checkboxSelected
          ]}>
            {filters.subscriptionTypes.selectedItems.includes(subType.id) && (
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
        return hasTeachers ? renderTeachersList() : null;
      case 'levels':
        return hasLevels ? renderLevelsList() : null;
      case 'groups':
        return hasGroups ? renderGroupsList() : null;
      case 'danceTypes':
        return hasDanceTypes ? renderDanceTypesList() : null;
      case 'subscriptions':
        return hasSubscriptionTypes ? renderSubscriptionTypesList() : null;
      default:
        return null;
    }
  };

  const hasAnyFilters = 
    (filters.teachers?.selectedItems?.length > 0) || 
    (filters.levels?.selectedItems?.length > 0) || 
    (filters.groups?.selectedItems?.length > 0) ||
    (filters.danceTypes?.selectedItems?.length > 0) ||
    (filters.subscriptionTypes?.selectedItems?.length > 0);

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
                {hasTeachers && (
                  <FilterTab 
                    title="Преподаватели" 
                    isActive={activeTab === 'teachers'} 
                    onPress={() => setActiveTab('teachers')}
                  />
                )}
                {hasLevels && (
                  <FilterTab 
                    title="Уровни" 
                    isActive={activeTab === 'levels'} 
                    onPress={() => setActiveTab('levels')}
                  />
                )}
                {hasGroups && (
                  <FilterTab 
                    title="Группы" 
                    isActive={activeTab === 'groups'} 
                    onPress={() => setActiveTab('groups')}
                  />
                )}
              </View>
              
              {(hasDanceTypes || hasSubscriptionTypes) && (
                <View style={styles.tabsContainer}>
                  {hasDanceTypes && (
                    <FilterTab 
                      title="Виды танца" 
                      isActive={activeTab === 'danceTypes'} 
                      onPress={() => setActiveTab('danceTypes')}
                    />
                  )}
                  {hasSubscriptionTypes && (
                    <FilterTab 
                      title="Абонементы" 
                      isActive={activeTab === 'subscriptions'} 
                      onPress={() => setActiveTab('subscriptions')}
                    />
                  )}
                </View>
              )}

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
    marginBottom: 10,
    paddingBottom: 10,
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