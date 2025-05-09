import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState, useEffect} from 'react';
import {FlashList} from "@shopify/flash-list";

import FilterTab from "../FilterTab";
import FilterItem from "../FilterItem";

const defaultCategoryProps = {
  items: [],
  selectedItems: [],
  onItemSelect: () => {},
  onEndReached: () => {},
  loading: false,
  hasMore: true
};

const GroupFilterModal = ({
  visible = false,
  onClose = () => {},
  onReset = () => {},
  onApply = () => {},
  filters = {
    teachers: {...defaultCategoryProps},
    levels: {...defaultCategoryProps},
    groups: {...defaultCategoryProps},
    lessonTypes: {...defaultCategoryProps},
    subscriptionTypes: {...defaultCategoryProps}
  }
}) => {
  const [activeTab, setActiveTab] = useState('teachers');
  const [refresh, setRefresh] = useState(0);
  
  // Локальное состояние для хранения выбранных элементов до применения фильтров
  const [localSelectedTeachers, setLocalSelectedTeachers] = useState([]);
  const [localSelectedLevels, setLocalSelectedLevels] = useState([]);
  const [localSelectedGroups, setLocalSelectedGroups] = useState([]);
  const [localSelectedDanceTypes, setLocalSelectedDanceTypes] = useState([]);
  const [localSelectedSubscriptionTypes, setLocalSelectedSubscriptionTypes] = useState([]);

  // Метки наличия соответствующих элементов для фильтров
  const hasTeachers = filters.teachers?.items?.length > 0;
  const hasLevels = filters.levels?.items?.length > 0;
  const hasGroups = filters.groups?.items?.length > 0;
  const hasLessonTypes = filters.lessonTypes?.items?.length > 0;
  const hasSubscriptionTypes = filters.subscriptionTypes?.items?.length > 0;

  // Инициализация локальных состояний при открытии модального окна
  useEffect(() => {
    if (visible) {
      setLocalSelectedTeachers([...filters.teachers.selectedItems]);
      setLocalSelectedLevels([...filters.levels.selectedItems]);
      setLocalSelectedGroups([...filters.groups.selectedItems]);
      setLocalSelectedDanceTypes([...filters.lessonTypes.selectedItems]);
      setLocalSelectedSubscriptionTypes([...filters.subscriptionTypes.selectedItems]);
    }
  }, [visible]);

  // Определяем начальный активный таб при первом рендере
  useEffect(() => {
    if (hasLessonTypes) setActiveTab('lessonTypes');
    else if (hasTeachers) setActiveTab('teachers');
    else if (hasLevels) setActiveTab('levels');
    else if (hasGroups) setActiveTab('groups');
    else if (hasSubscriptionTypes) setActiveTab('subscriptions');
  }, [hasTeachers, hasLevels, hasGroups, hasLessonTypes, hasSubscriptionTypes]);

  const toggleLocalTeacher = (id) => {
    setLocalSelectedTeachers(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
    setRefresh(prev => prev + 1);
  };

  const toggleLocalLevel = (id) => {
    setLocalSelectedLevels(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
    setRefresh(prev => prev + 1);
  };

  const toggleLocalGroup = (id) => {
    setLocalSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
    setRefresh(prev => prev + 1);
  };

  const toggleLocalDanceType = (id) => {
    setLocalSelectedDanceTypes(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
    setRefresh(prev => prev + 1);
  };

  const toggleLocalSubscriptionType = (id) => {
    setLocalSelectedSubscriptionTypes(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
    setRefresh(prev => prev + 1);
  };

  const handleApply = () => {
    onApply({
      teachers: localSelectedTeachers,
      levels: localSelectedLevels,
      groups: localSelectedGroups,
      lessonTypes: localSelectedDanceTypes,
      subscriptionTypes: localSelectedSubscriptionTypes
    });
  };

  const handleReset = () => {
    setLocalSelectedTeachers([]);
    setLocalSelectedLevels([]);
    setLocalSelectedGroups([]);
    setLocalSelectedDanceTypes([]);
    setLocalSelectedSubscriptionTypes([]);
    onReset();
    setRefresh(prev => prev + 1);
  };

  const renderTeacherItem = ({item}) => (
    <FilterItem
      item={item}
      isSelected={localSelectedTeachers.includes(item.id)}
      onSelect={() => toggleLocalTeacher(item.id)}
      textExtractor={(teacher) => `${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user?.middle_name || ''}`}
    />
  );

  const renderLevelItem = ({item}) => (
    <FilterItem
      item={item}
      isSelected={localSelectedLevels.includes(item.id)}
      onSelect={() => toggleLocalLevel(item.id)}
      textExtractor={(level) => level.name}
    />
  );

  const renderGroupItem = ({item}) => (
    <FilterItem
      item={item}
      isSelected={localSelectedGroups.includes(item.id)}
      onSelect={() => toggleLocalGroup(item.id)}
      textExtractor={(group) => group.name}
    />
  );

  const renderLessonTypeItem = ({item}) => (
    <FilterItem
      item={item}
      isSelected={localSelectedDanceTypes.includes(item.id)}
      onSelect={() => toggleLocalDanceType(item.id)}
      textExtractor={(lessonType) => lessonType.dance_style.name}
    />
  );

  const renderSubscriptionTypeItem = ({item}) => (
    <FilterItem
      item={item}
      isSelected={localSelectedSubscriptionTypes.includes(item.id)}
      onSelect={() => toggleLocalSubscriptionType(item.id)}
      textExtractor={(subType) => subType.name}
    />
  );

  const getActiveFilterData = () => {
    switch (activeTab) {
      case 'teachers':
        return {
          data: filters.teachers.items,
          renderItem: renderTeacherItem,
          onEndReached: filters.teachers.onEndReached,
          loading: filters.teachers.loading,
          hasMore: filters.teachers.hasMore
        };
      case 'levels':
        return {
          data: filters.levels.items,
          renderItem: renderLevelItem,
          onEndReached: filters.levels.onEndReached,
          loading: filters.levels.loading,
          hasMore: filters.levels.hasMore
        };
      case 'groups':
        return {
          data: filters.groups.items,
          renderItem: renderGroupItem,
          onEndReached: filters.groups.onEndReached,
          loading: filters.groups.loading,
          hasMore: filters.groups.hasMore
        };
      case 'lessonTypes':
        return {
          data: filters.lessonTypes.items,
          renderItem: renderLessonTypeItem,
          onEndReached: filters.lessonTypes.onEndReached,
          loading: filters.lessonTypes.loading,
          hasMore: filters.lessonTypes.hasMore
        };
      case 'subscriptions':
        return {
          data: filters.subscriptionTypes.items,
          renderItem: renderSubscriptionTypeItem,
          onEndReached: filters.subscriptionTypes.onEndReached,
          loading: filters.subscriptionTypes.loading,
          hasMore: filters.subscriptionTypes.hasMore
        };
      default:
        return {data: [], renderItem: null, onEndReached: null, loading: false, hasMore: false};
    }
  };

  const renderContent = () => {
    const activeFilter = getActiveFilterData();
    if (!activeFilter.data || activeFilter.data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Нет данных для отображения</Text>
        </View>
      );
    }

    return (
      <FlashList
        data={activeFilter.data}
        estimatedItemSize={50}
        renderItem={activeFilter.renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={activeFilter.onEndReached}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        extraData={refresh}
        ListFooterComponent={() => (
          activeFilter.loading && activeFilter.hasMore ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator size="small" color="#d903e4"/>
            </View>
          ) : null
        )}
        contentContainerStyle={{paddingBottom: 10}}
      />
    );
  };

  const availableTabs = [
    {id: 'teachers', title: 'Преподаватели', visible: hasTeachers},
    {id: 'levels', title: 'Уровни', visible: hasLevels},
    {id: 'groups', title: 'Группы', visible: hasGroups},
    {id: 'lessonTypes', title: 'Стили танца', visible: hasLessonTypes},
    {id: 'subscriptions', title: 'Абонементы', visible: hasSubscriptionTypes}
  ].filter(tab => tab.visible);

  const hasAnyLocalFilters =
    (localSelectedTeachers.length > 0) ||
    (localSelectedLevels.length > 0) ||
    (localSelectedGroups.length > 0) ||
    (localSelectedDanceTypes.length > 0) ||
    (localSelectedSubscriptionTypes.length > 0);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Фильтры</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black"/>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScrollView}>
            <View style={styles.tabsContainer}>
              {availableTabs.map(tab => (
                <FilterTab
                  key={tab.id}
                  title={tab.title}
                  isActive={activeTab === tab.id}
                  onPress={() => setActiveTab(tab.id)}
                />
              ))}
            </View>
          </ScrollView>

          <View style={styles.separator}/>

          <View style={styles.listContainer}>
            {renderContent()}
          </View>

          <View style={styles.separator}/>

          <View style={styles.footer}>
            {hasAnyLocalFilters && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Сбросить</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Применить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    margin: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingTop: 20,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: 'os-bold',
  },
  closeButton: {
    padding: 5,
  },
  tabsScrollView: {
    flexGrow: 0,
    marginBottom: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  listContainer: {
    flex: 1,
    paddingVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  resetButton: {
    paddingVertical: 14,
    paddingHorizontal: 15,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'os-medium',
    color: '#666',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#d903e4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 15,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'os-bold',
    color: 'white',
  },
  loadingFooter: {
    padding: 15,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'os-regular',
    color: '#999',
    textAlign: 'center',
  },
});

export default GroupFilterModal; 