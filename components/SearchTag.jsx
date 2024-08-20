import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";

const SearchTag = ({tag, updateTagsState}) => {
    return (
        <TouchableOpacity
            onPress={() => updateTagsState(tag.id, !tag.value)}
            style={{opacity: tag.value ? 1 : 0.5}}
        >
            <View style={[styles.tagContainer, {backgroundColor: tag.color}]}>
                <Text style={styles.tagText}>{tag.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    tagContainer: {
        height: 35,
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 5,
        padding: 5,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    tagIcon: {
        width: 25,
        height: 25,
        marginHorizontal: 5
    },
    tagText: {
        fontFamily: "os-regular",
        fontSize: 14,
        color: "white",
        paddingHorizontal: 5
    },
})

export default SearchTag;
