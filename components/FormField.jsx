import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export const FormField = ({
  field,
  label,
  values,
  touched,
  disabled,
  errors,
  handleChange,
  handleBlur,
  secureTextEntry = false,
  multiline = false,
  autoCapitalize = 'none',
}) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          touched[field] && errors[field] && styles.errorInput,
        ]}
        value={values[field]}
        onChangeText={handleChange(field)}
        onBlur={handleBlur(field)}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        editable={!disabled}
      />
      {touched[field] && errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'os-regular',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'os-regular',
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    fontFamily: 'os-regular',
    marginTop: 4,
  },
});
