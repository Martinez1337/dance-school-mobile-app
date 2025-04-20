import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { parseISO, isAfter } from 'date-fns';
import { SubscriptionCard, ScrollIndicator } from '../../../../components';
import { SCREEN_WIDTH, SUBSCRIPTION_CARD_WIDTH, SUBSCRIPTION_CARD_SPACING } from '../../../../constants';

import subscriptionTemplates from '../../../../scratch-data/subscription-templates.json';
import subscriptions from '../../../../scratch-data/subscriptions.json';

export default function SubscriptionsScreen() {
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  const currentUserId = 'e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a';

  const activeScrollX = useRef(new Animated.Value(0)).current;
  const availableScrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Получаем активные подписки пользователя
    const userSubscriptions = subscriptions
      .filter(sub => 
        sub.userId === currentUserId && 
        !sub.terminated &&
        isAfter(parseISO(sub.endTime), new Date())
      )
      .map(sub => {
        const template = subscriptionTemplates.find(t => t.id === sub.templateId);
        return {
          ...template,
          ...sub,
          remainingLessons: typeof sub.lessonsCount === 'object' 
            ? {
                group: sub.lessonsCount.group - (sub.usedLessons?.group || 0),
                individual: sub.lessonsCount.individual - (sub.usedLessons?.individual || 0)
              }
            : sub.lessonsCount - (sub.usedLessons || 0)
        };
      });

    setActiveSubscriptions(userSubscriptions);
  }, []);

  const handleSubscriptionPress = (subscription) => {
    // todo: Логика покупки абонемента
    console.log('Selected subscription:', subscription.id);
  };

  const renderSubscriptionList = (items, scrollX, isActive = false) => (
    <>
      <Animated.ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
        snapToInterval={SUBSCRIPTION_CARD_WIDTH + SUBSCRIPTION_CARD_SPACING}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      >
        {items.map(item => (
          <View key={item.id} style={styles.cardWrapper}>
            <SubscriptionCard
              item={item}
              isActive={isActive}
              onPress={() => handleSubscriptionPress(item)}
            />
          </View>
        ))}
      </Animated.ScrollView>
      <ScrollIndicator 
        data={items} 
        scrollX={scrollX} 
        itemWidth={SUBSCRIPTION_CARD_WIDTH + SUBSCRIPTION_CARD_SPACING} 
      />
    </>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Абонементы',
          headerShown: true,
        }}
      />

      <ScrollView>
        {activeSubscriptions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Активные абонементы</Text>
            {renderSubscriptionList(activeSubscriptions, activeScrollX, true)}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Доступные абонементы</Text>
          {renderSubscriptionList(subscriptionTemplates, availableScrollX)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingVertical: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 16,
    fontFamily: 'os-bold',
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: (SCREEN_WIDTH - SUBSCRIPTION_CARD_WIDTH) / 2,
    gap: SUBSCRIPTION_CARD_SPACING,
  },
  cardWrapper: {
    width: SUBSCRIPTION_CARD_WIDTH,
    marginVertical: 10,
  },
});
 