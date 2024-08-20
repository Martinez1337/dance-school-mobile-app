import React, { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity} from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {globalStyles, HEADER_BACKGROUND} from "../../../styles/globalStyles";
import {MAX_DESCRIPTION_LENGTH} from "../../../constants";

const user = {
    userId: "e1a5c879-9a1d-45c2-8f0d-d3442f2dcd1a",
    email: "ivanov.ivan@edu.hse.ru",
    firstName: "Иван",
    lastName: "Иванов",
    middleName: "Александрович",
    phoneNumber: "+79991234567",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "Student",
    description: "Увлекается современными танцами и хип-хопом.",
    level: "Intermediate"
}

const Profile = () => {
    const [description, setDescription] = useState(user.description);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        console.log('Description saved:', description);
    };

    const handleDescriptionChange = (text) => {
        if (text.length <= MAX_DESCRIPTION_LENGTH) {
            setDescription(text);
            setIsSaved(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.container}>
            <KeyboardAwareScrollView>
                <View style={{ alignItems: "center" }}>
                    <Image
                        style={styles.profileImage}
                        source={user.photo}
                        placeholder={require("../../../assets/images/placeholder-image.png")}
                    />
                    <Text style={styles.userNameText}>{user.lastName} {user.firstName} {user.middleName}</Text>
                    <Text style={styles.userRoleText}>{user.role}, {user.level}</Text>
                </View>

                <View style={styles.contactDataContainer}>
                    <View style={styles.contactDataLine}>
                        <Image style={styles.contactDataIcon} source={require("../../../assets/images/email.png")} />
                        <Text style={styles.contactDataText}>{user.email}</Text>
                    </View>

                    <View style={styles.contactDataLine}>
                        <Image style={styles.contactDataIcon} source={require("../../../assets/images/telephone.png")} />
                        <Text style={styles.contactDataText}>{user.phoneNumber}</Text>
                    </View>

                    <Text style={styles.descriptionTitleText}>Описание</Text>

                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={styles.descriptionField}
                            value={description}
                            onChangeText={handleDescriptionChange}
                            placeholder="Введите описание"
                            multiline={true}
                        />
                        <Text style={styles.charCount}>{description.length}/{MAX_DESCRIPTION_LENGTH}</Text>
                    </View>

                    <View style={styles.saveButtonContainer}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                            disabled={isSaved}
                        >
                            <Text style={styles.saveButtonText}>{isSaved ? "Сохранено" : "Сохранить изменения"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        height: 150,
        width: 150,
        borderRadius: 100,
        marginVertical: 15
    },
    userNameText: {
        fontSize: 18,
        fontFamily: "os-bold",
        flexWrap: "wrap",
        paddingHorizontal: 25
    },
    userRoleText: {
        fontSize: 16,
        fontFamily: "os-light-it"
    },
    contactDataContainer: {
        flex: 1,
        marginHorizontal: 15,
        marginVertical: 15
    },
    contactDataLine: {
        height: 40,
        borderWidth: 1,
        borderColor: "rgba(158, 150, 150, .5)",
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 10,
        alignItems: "center",
        flexDirection: "row",
    },
    contactDataText: {
        fontSize: 14,
        fontFamily: "os-regular",
    },
    contactDataIcon: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
        tintColor: "black"
    },
    descriptionTitleText: {
        fontSize: 16,
        fontFamily: "os-bold",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 5
    },
    descriptionContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 10,
        padding: 10,
        borderColor: "rgba(158, 150, 150, .5)",
        borderWidth: 1,
        borderRadius: 10
    },
    descriptionField: {
        height: 200,
        textAlignVertical: 'top', // Для многострочного ввода
        fontSize: 16,
        fontFamily: "os-regular",

    },
    charCount: {
        position: 'absolute',
        right: 10,
        bottom: -20,
        fontSize: 12,
        color: 'gray',
        fontFamily: "os-light"

    },
    saveButtonContainer: {
        alignItems: "center",
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: HEADER_BACKGROUND,
        padding: 10,
        borderRadius: 10,
    },
    saveButtonText: {
        color: "white",
        fontFamily: "os-bold",
        fontSize: 14,
    }
});

export default Profile;
