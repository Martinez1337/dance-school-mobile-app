import {useState} from "react";

const useFilters = () => {
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedDanceTypes, setSelectedDanceTypes] = useState([]);
  const [selectedSubscriptionTypes, setSelectedSubscriptionTypes] = useState([]);

  const toggleTeacher = (id) => {
    setSelectedTeachers(prev => (prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]));
  };
  const toggleLevel = (id) => {
    setSelectedLevels(prev => (prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]));
  };
  const toggleGroup = (id) => {
    setSelectedGroups(prev => (prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]));
  };
  const toggleDanceType = (id) => {
    setSelectedDanceTypes(prev => (prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]));
  };
  const toggleSubscriptionType = (id) => {
    setSelectedSubscriptionTypes(prev => (prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]));
  };

  const resetFilters = () => {
    setSelectedTeachers([]);
    setSelectedLevels([]);
    setSelectedGroups([]);
    setSelectedDanceTypes([]);
    setSelectedSubscriptionTypes([]);
  };

  return {
    selectedTeachers,
    setSelectedTeachers, // Добавляем сеттер
    selectedLevels,
    setSelectedLevels,   // Добавляем сеттер
    selectedGroups,
    setSelectedGroups,   // Добавляем сеттер
    selectedDanceTypes,
    setSelectedDanceTypes, // Добавляем сеттер
    selectedSubscriptionTypes,
    setSelectedSubscriptionTypes, // Добавляем сеттер
    toggleTeacher,
    toggleLevel,
    toggleGroup,
    toggleDanceType,
    toggleSubscriptionType,
    resetFilters,
  };
};

export default useFilters;