import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ColorsContext } from '../Context/ColorsContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function Card({ title, iconName, navigation, targetScreen, cardWidth, cardHeight, fontSize }) {
  const { colors } = useContext(ColorsContext);

  const handlePress = () => {
    if (navigation && targetScreen) {
      navigation.navigate(`${targetScreen}`);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.CardContainer,
        {
          backgroundColor: "#a68cd5",
          width: cardWidth || width * 0.4, // Default olarak ekranın %40'ı genişlik
          height: cardHeight || height * 0.2, // Default olarak ekranın %20'si yükseklik
          shadowColor:colors.login,
          shadowRadius:20,
        },
      ]}
      onPress={handlePress}
    >
      <Icon name={iconName} size={fontSize || width * 0.1} color={"white"} />
      <Text style={[styles.CardText, { fontSize: fontSize || width * 0.05, color: "white"}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 15,
    marginVertical: 10,
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Android için gölge efekti
  },
  CardText: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});
