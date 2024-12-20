import React, { useContext } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { FontsContext } from '../Context/FontsContext';
import { ColorsContext } from '../Context/ColorsContext';

const { width, height } = Dimensions.get('window');

const MyButton = ({ onPress, title, backgroundColor }) => {
  const { fonts } = useContext(FontsContext);
  const { colors } = useContext(ColorsContext);
  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={onPress}>
      <Image
        source={require('../assets/img/ok.png')} // Görsel yolu
        style={{
          width: width * 0.2,   // Ekran genişliğinin %90'ı
          height: height * 0.2, // Ekran yüksekliğinin %20'si
          resizeMode: 'contain', // Görselin oranlarını bozmadan boyutlandırır
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {

  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, // Responsive font size
  },
});

export default MyButton;
