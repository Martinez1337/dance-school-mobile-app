import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const EventListItem = ({ event }) => {
    const formatDate = (dateString) => {
        return format(new Date(dateString), "d MMMM yyyy, HH:mm", { locale: ru })
    }

    return (
        <TouchableOpacity
            onPress={() => {}}
        >
            <View style={styles.cardContainer}>
                <Image
                    source={{uri: event.picture}}
                    style={styles.image}
                    placeholder={require("../assets/images/placeholder-image.png")}
                    focusable={false}
                    contentFit={"cover"}
                />
                <View style={styles.cardInfoContainer}>
                    <Text style={styles.titleText}>{event.name}</Text>
                    <Text style={styles.eventType}>{event.eventType}</Text>
                    <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">{event.description}</Text>
                    <View style={styles.startTimeContainer}>
                        <Text style={styles.startTime}>{formatDate(event.startTime)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height: 150,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .3)",
        borderRadius: 15,
        marginHorizontal: 5,
    },
    image: {
        height: '100%',
        width: 100,
        borderBottomLeftRadius: 15,
        borderTopLeftRadius: 15,
    },
    cardInfoContainer: {
        flex: 1,
        marginHorizontal: 15,
        marginTop: 5,
    },
    titleText: {
        fontFamily: "os-bold",
        fontSize: 16,
    },
    startTimeContainer: {
        marginTop: 'auto',
        marginBottom: 5
    },
    startTime: {
        fontFamily: "os-regular",
        alignSelf: "flex-end",
    },
    description: {
        flexWrap: "wrap",
        fontFamily: "os-regular",
        fontSize: 14,
    },
    eventType: {
        fontFamily: "os-light-it",
    },
});

export default EventListItem;
