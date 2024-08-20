import {StyleSheet, Text, View} from 'react-native'
import React from 'react'
import {format, parseISO} from "date-fns";

const LessonListItem = ({ item }) => {
    return (
        <View style={styles.lessonItem}>
            <Text style={styles.lessonTitle}>{item.name}</Text>
            <Text style={styles.lessonType}>
                {item.lessonType === 'Individual' ? 'Индивидуальное занятие' : 'Групповое занятие'}
            </Text>
            <Text style={styles.lessonTime}>
                {format(parseISO(item.startTime), 'HH:mm')} - {format(parseISO(item.finishTime), 'HH:mm')}
            </Text>
            <Text style={styles.lessonDescription}>{item.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    lessonItem: {
        padding: 15,
        marginVertical: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .5)",
        borderRadius: 15,
    },
    lessonTitle: {
        fontSize: 18,
        fontFamily: "os-bold"
    },
    lessonType: {
        marginTop: 5,
        fontSize: 16,
        fontFamily: "os-regular",
        color: '#555',
    },
    lessonTime: {
        marginTop: 5,
        fontSize: 16,
        fontFamily: "os-regular",
        color: '#555',
    },
    lessonDescription: {
        marginTop: 10,
        fontSize: 14,
        color: '#777',
        fontFamily: "os-regular",
    },
});

export default LessonListItem;
