import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

const CustomInput = ({ label = "Label", placeholder = "Enter text...", ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholder={placeholder} style={styles.input} {...props} />
    </View>
  );
};

CustomInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 12,
    marginVertical: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    height: 42,
    fontSize: 16,
    color: "#111827",
  },
});
