import {ActivityIndicator, View, Text, StyleSheet} from "react-native";
import {FlashList} from "@shopify/flash-list";

import LessonListItem from "./LessonListItem";

const LessonsList = ({ 
  lessons,
  onLessonPress, 
  onEndReached,
  onRefresh,
  refreshing = false
}) => {
  return (
    <FlashList
      data={lessons}
      keyExtractor={(item) => item.id.toString()}
      estimatedItemSize={200}
      renderItem={({ item }) => <LessonListItem item={item} onPress={onLessonPress} />}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={<View style={{ height: 15 }} />}
      ListFooterComponent={() => (
        onEndReached && lessons.loading ?
          <ActivityIndicator size="small" color="#d903e4" /> : null
      )}
      ListEmptyComponent={() => (
        <Text style={styles.noLessonsText}>
          В этот день нет подходящих групповых занятий
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  noLessonsText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
})

export default LessonsList;
