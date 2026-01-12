import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { Stack } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import {SubscriptionCard, ScrollIndicator, SubscriptionTemplateCard} from '../../../../components';
import { SCREEN_WIDTH, SUBSCRIPTION_CARD_WIDTH, SUBSCRIPTION_CARD_SPACING } from '../../../../constants';

import {apiRequest, handleApiError} from "../../../../util/apiService";
import {useSelector} from "react-redux";
import {Ionicons} from "@expo/vector-icons";

const fetchSubscriptionsTemplates = async () => {
  try {
    return await apiRequest({
      method: 'POST',
      url: '/subscriptionTemplates/search/full-info',
      data: {
        is_expired: false
      }
    })
  } catch (e) {
    handleApiError(e);
  }
}

export default function SubscriptionsScreen() {
  const subscriptions = useSelector(state => state.session.subscriptions);
  const [activeSubscriptions, setActiveSubscriptions] = useState(subscriptions.filter(sub => sub.payment_id !== null));
  const [subscriptionTemplates, setSubscriptionTemplates] = useState([])
  const activeScrollX = useRef(new Animated.Value(0)).current;
  const availableScrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchSubscriptionsTemplates()
      .then(response => {
        setSubscriptionTemplates(response.subscription_templates)
      })
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
            {
              item?.student_id ? (
                <SubscriptionCard
                  item={item}
                  isActive={isActive}
                  onPress={() => handleSubscriptionPress(item)}
                />
              ) : (
                <SubscriptionTemplateCard
                  item={item}
                  isActive={isActive}
                  onPress={() => handleSubscriptionPress(item)}
                />
              )
            }
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20, paddingTop: 20}}
      >
        {activeSubscriptions.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionTitle, {backgroundColor: '#9cf393',}]}>
              <Ionicons name={'bag-check-outline'} size={50} color="#000"/>
              <Text style={styles.sectionTitleText}>Активные абонементы</Text>
            </View>
            {renderSubscriptionList(activeSubscriptions, activeScrollX, true)}
          </View>
        )}

        <View style={styles.section}>
          <View style={[styles.sectionTitle, {backgroundColor: '#efadf3',}]}>
            <Ionicons name={'cash-outline'} size={50} color="#000"/>
            <Text style={styles.sectionTitleText}>Доступные абонементы</Text>
          </View>
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
    paddingVertical: 10
  },
  sectionTitle: {
    borderRadius: 50,
    marginHorizontal: 30,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sectionTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
    fontFamily: 'os-bold',
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: (SCREEN_WIDTH - SUBSCRIPTION_CARD_WIDTH) / 2,
    gap: SUBSCRIPTION_CARD_SPACING,
  },
  cardWrapper: {
    width: SUBSCRIPTION_CARD_WIDTH,
    marginVertical: 5,
  },
});
 