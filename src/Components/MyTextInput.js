import React, {useContext} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Ionicons kütüphanesini kullanıyoruz
import {FontsContext} from '../Context/FontsContext';
import {ColorsContext} from '../Context/ColorsContext';

const MyTextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  iconName,
}) => {
  const {fonts} = useContext(FontsContext);
  const {colors} = useContext(ColorsContext);
  return (
    <View style={[styles.inputContainer, {borderColor: colors.primary}]}>
      {/* Icon on the left */}
      {iconName && (
        <Icon
          name={iconName}
          size={24}
          style={[styles.icon, {color: colors.primary}]}
        />
      )}
      <TextInput
        style={[
          styles.input,
          {fontFamily: fonts.regular, borderColor: colors.primary,color:colors.primary},
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={
          placeholder.toLowerCase().includes('password')
            ? secureTextEntry
            : false
        }
        placeholderTextColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    // Purple border
    borderRadius: 30, // Full rounded edges
    paddingHorizontal: 10,
    height: 50,
    backgroundColor: 'transparent',
    marginBottom: '7%',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
    // Make the icon match the border color
  },
});

export default MyTextInput;
