// Memnuniyet.js
import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

const {width ,height}= Dimensions.get("window")
export default function Memnuniyet({ item, navigation, fonts }) {
  return (
    <View>
      <Image
        source={item.image}
        resizeMode="contain"
        style={{
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
          width: width*0.9,
          height: height*0.7,
          marginHorizontal:width*0.02
        }}
      />
      {/* Add more content here if needed */}
    </View>
  );
}
