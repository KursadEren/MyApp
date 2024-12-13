import React, {useContext} from 'react';
import {TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import {FontsContext} from '../Context/FontsContext';
import {ColorsContext} from '../Context/ColorsContext';

const {width, height} = Dimensions.get('window');

const MyButton = ({onPress, title, backgroundColor}) => {
  const {fonts} = useContext(FontsContext);
  const {colors} = useContext(ColorsContext);
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: colors.primary}]}
      onPress={onPress}>
      <Text style={[styles.buttonText, {fontFamily: fonts.regular}]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.1, // Responsive horizontal padding
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: height * 0.02, // Responsive vertical margin
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045, // Responsive font size
  },
});

export default MyButton;
