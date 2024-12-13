import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

export default function SearchInput() {
  return (
    <View style={styles.searchContainer}>
      <FontAwesome
        name="search"
        size={width * 0.05} // Slightly larger icon to match theme
        color="#004085" // Matches the text color from HomeScreen
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        placeholder="Ara..."
        placeholderTextColor="#A6C3E0" // Subtle placeholder text matching theme
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background for contrast
    borderRadius: width * 0.04, // Matches rounded edges from the HomeScreen
    borderWidth: 1.5,
    borderColor: '#004085', // Border color consistent with the blue theme
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
    width: '90%', // Slightly wider to fit better with HomeScreen layout
    marginVertical: 15, // Adjusted spacing for consistency
    alignSelf: 'center',
    shadowColor: '#000', // Added subtle shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: width * 0.03, // Padding between icon and input text
  },
  input: {
    flex: 1,
    fontSize: width * 0.045, // Slightly larger font for better readability
    color: '#004085', // Matches text color from the HomeScreen
    fontWeight: '500', // Consistent font weight
  },
});
