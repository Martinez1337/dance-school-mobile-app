import {
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator, Text
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import React, {useCallback, useEffect, useState} from "react";
import {FlashList} from "@shopify/flash-list";

import {SearchTagList, EventListItem} from "../../../components";
import {globalStyles} from "../../../styles/globalStyles";
import {sortEventData} from "../../../util/sortData";
import {apiRequest, handleApiError} from "../../../util/apiService";
import {useFocusEffect} from "expo-router";

const fetchEventTypes = async (setEventTypes) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/eventTypes/search',
      data: {
        terminated: false
      }
    })
    setEventTypes(addValuesToEventTypes(response.event_types));
  } catch (error) {
    handleApiError(error)
  }
};

const fetchEvents = async (setEventTypes) => {
  try {
    const response = await apiRequest({
      method: 'POST',
      url: '/events/search/full-info',
      data: {
        terminated: false
      }
    })
    setEventTypes(response.events);
  } catch (error) {
    handleApiError(error)
  }
};

const addValuesToEventTypes = (eventTypeList) => {
  return eventTypeList.map((eventType) => {
    return {
      ...eventType,
      value: false,
      color: 'black'
    }
  })
}

const EventsTab = () => {
  const [eventTypeList, setEventTypeList] = useState([]);
  const [eventList, setEventList] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [expanded, setExpended] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchEventTypes(setEventTypeList)
    }, [])
  );

  useEffect(() => {
    if (eventTypeList && eventTypeList.length > 0) {
      fetchEvents(setEventList).then(() => {
        setLoading(false)
      })
    }
  }, [eventTypeList]);

  const onRefreshHandler = async () => {
    setRefreshing(true);
    await fetchEventTypes(setEventTypeList);
    setRefreshing(false);
  }

  const filteredData = sortEventData(eventList, searchText, eventTypeList);

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="small" color="#d903e4"/>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: "row"}}>
        <View style={globalStyles.searchBar}>
          <Ionicons name="search" size={24} color="black"/>
          <TextInput
            style={globalStyles.searchTextInput}
            placeholder={"Поиск"}
            placeholderTextColor={"#666666"}
            value={searchText}
            clearButtonMode={"always"}
            autoCapitalize={"none"}
            autoCorrect={false}
            onChangeText={text => setSearchText(text)}
          />
        </View>

        <TouchableOpacity onPress={() => setExpended(!expanded)}>
          <View style={styles.menuIconContainer}>
            <Ionicons name="menu" size={24} color="white"/>
          </View>
        </TouchableOpacity>
      </View>

      {expanded && (<SearchTagList searchTags={eventTypeList} setSearchTags={setEventTypeList} />)}

      <View style={styles.listContainer}>
        <FlashList
          renderItem={({item}) => <EventListItem event={item}/>}
          keyExtractor={item => item.id}
          data={filteredData}
          estimatedItemSize={200}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler}/>}
          ListHeaderComponent={() => <View style={styles.listHeader}/>}
          ListFooterComponent={() => <View style={styles.listFooter}/>}
          ItemSeparatorComponent={() => <View style={{flex: 1, margin: 5}}/>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  menuIconContainer: {
    flex: 1,
    marginBottom: 5,
    marginTop: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(158, 150, 150, .3)",
    padding: 10,
    backgroundColor: "#000000"
  },
  menuIcon: {
    width: 25,
    height: 25,
    tintColor: "white"
  },
  listHeader: {
    paddingTop: 10
  },
  listFooter: {
    paddingBottom: 10
  },
  listContainer: {
    flex: 1,
    marginHorizontal: 5
  }
});

export default EventsTab;
