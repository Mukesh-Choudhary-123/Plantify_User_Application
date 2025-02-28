import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ text, style, ...props }) => {
  return (
    <Text style={[styles.text, style]} {...props}>
      {text}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomText;
