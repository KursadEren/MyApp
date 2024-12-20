// Memnuniyet.js
import React from 'react';
import { View, Text, Image } from 'react-native';

export default function Memnuniyet({ item, navigation, fonts, styles }) {
  return (
    <View>
      <Image
        source={item.image}
        resizeMode="cover"
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          width: '100%',
          height: 150,
        }}
      />
      {/* Add more content here if needed */}
    </View>
  );
}
