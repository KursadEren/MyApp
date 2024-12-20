import React from 'react';
import { TouchableOpacity, View, Text, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const VideoItem = ({ item, fonts, setSelectedVideo }) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3, // Android için gölge
      width: width * 0.9,
      alignSelf: 'center',
    }}
    onPress={() => setSelectedVideo(item)}
  >
    {/* Sol taraftaki simge */}

      <Image
        source={require('../../assets/img/HomeContent/clickTers.png')}
        style={{
          width: 30,
          height: 30,
          resizeMode: 'contain',
          right:-10,
          bottom:-10,
          position:'absolute',
        }}
      />


    {/* Metin Alanı */}
    <View style={{ flex: 1 }}>
      <Text
        style={{
          fontFamily: fonts.Bold,
          fontSize: 16,
          color: '#5a8387',
          marginBottom: 5,
        }}
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text
        style={{
          fontFamily: fonts.Regular,
          fontSize: 14,
          color: '#5a8387',
        }}
      >
        {item.duration} | {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

export default VideoItem;
