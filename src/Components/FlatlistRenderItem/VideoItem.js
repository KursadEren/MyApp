import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';

const VideoItem = ({ item, fonts, setSelectedVideo, styles }) => (
  <TouchableOpacity
    style={styles.videoCardContainer}
    onPress={() => setSelectedVideo(item)}
  >
    <View style={styles.videoCard}>
      <Image source={item.image} style={styles.videoImage} />
      <View style={styles.textContainer}>
        <Text style={[styles.videoTitle, { fontFamily: fonts.Bold }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.videoDescription, { fontFamily: fonts.Regular }]}>
          {item.duration} | {item.description}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default VideoItem;
