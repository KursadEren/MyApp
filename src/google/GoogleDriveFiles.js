import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, Dimensions } from 'react-native';
import axios from 'axios';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const GoogleDriveFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Çağrısını Gerçekleştiren Fonksiyon
  const fetchFiles = async () => {
    try {
      const url =
        "https://www.googleapis.com/drive/v3/files?q=%271urHJTw7acsf9bAiGFjGDj6vB1lcq3JPJ%27+in+parents&fields=files(id,name,mimeType)&key=AIzaSyCz_82EXsHNOg9UR1twDnt5368_kWr6KFI";
      console.log('Fetching from URL:', url); // Debugging
      const response = await axios.get(url);
      setFiles(response.data.files || []);
    } catch (err) {
      console.error('Error response:', err.response?.data || err.message);
      setError('Error fetching files. Please check your API key or folder ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Dosyayı Görüntüleyen Bileşen
  const renderFileContent = (item) => {
    if (item.mimeType.startsWith('image/')) {
      return (
        <Image
          source={{ uri: `https://drive.google.com/uc?export=view&id=${item.id}` }}
          style={styles.image}
          resizeMode="contain"
        />
      );
    } else if (item.mimeType === 'video/mp4') {
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: `https://drive.google.com/uc?export=view&id=${item.id}` }}
            style={styles.video}
            controls // Video oynatıcı için kontrolleri etkinleştirir
            resizeMode="contain"
            repeat={false}
            onError={(error) => console.error('Video oynatma hatası:', error)} // Hata ayıklama için
          />
        </View>
      );
    } else if (item.mimeType === 'application/pdf') {
      return (
        <Text style={styles.fileText}>
          PDF dosyasını görüntülemek için bir PDF görüntüleyici kullanabilirsiniz.
        </Text>
      );
    } else if (item.mimeType.startsWith('text/')) {
      return (
        <Text style={styles.fileText}>
          Text dosyası: Görüntülemek için içeriği fetch edebilirsiniz.
        </Text>
      );
    } else {
      return (
        <Text style={styles.unknownFile}>
          Desteklenmeyen dosya türü: {item.mimeType}
        </Text>
      );
    }
  };

  // Dosyaları Listelemek için Bileşen
  const renderItem = ({ item }) => (
    <View style={styles.fileItem}>
      <Text style={styles.fileName}>{item.name}</Text>
      <Text style={styles.fileId}>ID: {item.id}</Text>
      <Text style={styles.fileType}>Type: {item.mimeType}</Text>
      {renderFileContent(item)}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default GoogleDriveFiles;

// Stil Dosyası
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  listContainer: {
    paddingBottom: 20,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileId: {
    fontSize: 14,
    color: '#555',
  },
  fileType: {
    fontSize: 12,
    color: '#888',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
  },
  videoContainer: {
    marginTop: 10,
    width: width * 0.9,
    height: height * 0.3,
    alignSelf: 'center',
    backgroundColor: 'black', // Video çevresi için arka plan
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fileText: {
    marginTop: 10,
    color: '#333',
    fontSize: 14,
  },
  unknownFile: {
    marginTop: 10,
    color: 'red',
    fontSize: 14,
  },
});
