import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const VideoPlayer = () => {
  // Google Drive video URL'sini yerleştirin
  const googleDriveEmbedUrl =
    'https://drive.google.com/file/d/1ZhIMgMNKQIjYQEa4yk7cY4mqgAucIh0R/view';

  return (
    <View style={styles.container}>
      <WebView
        source={{uri: googleDriveEmbedUrl}}
        style={styles.video}
        allowsFullscreenVideo
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 250,
  },
});

export default VideoPlayer;
