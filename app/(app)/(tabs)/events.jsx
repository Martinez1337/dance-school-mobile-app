import {View, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, RefreshControl} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from "react";
import {FlashList} from "@shopify/flash-list";

import {SearchTagList, EventListItem} from "../../../components";
import {globalStyles} from "../../../styles/globalStyles";
import {EVENT_TYPE_TAGS} from "../../../constants";
import {sortEventData} from "../../../util/sortData";

const eventsData = [
  {
    id: "20d36c81-fe95-4f00-97f8-8a9c5c1a2f3f",
    name: "Открытый урок по хип-хопу",
    description: "Бесплатный мастер-класс по основам хип-хоп танца.",
    startTime: "2025-03-20T18:00:00Z",
    picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCD2KHmsqFCUQqx3SpEvE9sM2jOb5S93Hc9Q&s",
    eventType: "Workshop"
  },
  {
    id: "44b91c21-d1c7-4a59-8519-9c5405aeb8fa",
    name: "Семинар по бальным танцам",
    description: "Углубленное изучение техник бальных танцев с приглашенным тренером.",
    startTime: "2025-03-21T14:00:00Z",
    picture: "https://optim.tildacdn.com/tild6633-3162-4838-b130-623335343538/-/resize/744x/-/format/webp/92c3523de61d06eebdc5.jpg",
    eventType: "Seminar"
  },
  {
    id: "59c21b7d-f406-4b65-af6b-66979c6bc4c5",
    name: "Конкурс по сальсе",
    description: "Ежегодный конкурс сальсы среди студентов школы.",
    startTime: "2025-03-22T16:00:00Z",
    picture: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx_nn003CPzyf8iRftUTWCNgJ9cGYNtXVuMg&s",
    eventType: "Competition"
  },
  {
    id: "f4f4a619-64f9-46a4-a359-0a6476587088",
    name: "Вечер латиноамериканских танцев",
    description: "Вечерние танцы в стиле бачата и сальса для всех желающих.",
    startTime: "2025-03-30T20:00:00Z",
    picture: "https://cdn2.mygazeta.com/i/2011/08/vecher-salsa.jpg",
    eventType: "Party"
  },
  {
    id: "61f9a540-3678-4029-b18b-e33922ef5bd8",
    name: "Интенсив по контемпорари",
    description: "Интенсивный курс по технике контемпорари для продвинутых танцоров.",
    startTime: "2025-03-25T10:00:00Z",
    picture: "https://baletka.by/img/dance/contemp_3.jpg",
    eventType: "Workshop"
  }
];

const onRefreshHandler = () => {
  // todo: Re-fetching data from the server
}

const EventsTab = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [expanded, setExpended] = useState(false);
  const [searchTags, setSearchTags] = useState(EVENT_TYPE_TAGS);

  const filteredData = sortEventData(eventsData, searchText, searchTags);

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

      {expanded && (<SearchTagList searchTags={searchTags} setSearchTags={setSearchTags} />)}

      <View style={styles.listContainer}>
        <FlashList
          renderItem={({item}) => <EventListItem event={item}/>}
          keyExtractor={item => item.id.toString()}
          data={filteredData}
          estimatedItemSize={50}
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
