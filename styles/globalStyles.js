import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export const HEADER_BACKGROUND = "#000000";
export const CONTENT_BACKGROUND = "#f9f9f9";

export const globalStyles = StyleSheet.create({
    mainSafeArea: {
        backgroundColor: HEADER_BACKGROUND,
        flex: 1,
    },
    topSafeArea: {
        backgroundColor: HEADER_BACKGROUND,
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: CONTENT_BACKGROUND
    },
    header: {
        backgroundColor: HEADER_BACKGROUND,
    },
    headerText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "os-bold",
    },
    backTitleText: {
        color: "#30135b",
        fontSize: 18
    },
    content: {
        padding: 20,
        backgroundColor: CONTENT_BACKGROUND
    },
    label: {
        color: "#000000",
        fontSize: 16,
        fontFamily: "os-bold",
        lineHeight: 30,
        marginLeft: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#e3e3e3",
        backgroundColor: "#fff"
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: "#ff7675",
        marginLeft: 10
    },
    signInButton: {
        marginTop: 20,
        backgroundColor: HEADER_BACKGROUND,
        padding: 15,
        borderRadius: 15,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: HEADER_BACKGROUND,
        padding: 15,
        borderRadius: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: "black",
        marginLeft: 5,
        marginRight: 10
    },
    searchBar: {
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 5,
        padding: 10,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .3)",
        alignItems: "center"
    },
    searchTextInput: {
        flex: 1,
        fontFamily: "os-regular",
        fontSize: 15
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
    },
    backButtonText: {
        marginLeft: 5,
        fontSize: 16,
        color: 'white',
    },
});
