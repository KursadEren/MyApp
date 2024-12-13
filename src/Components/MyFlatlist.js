import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Modal,
  Image,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import YoutubeVideo from './YoutubeVideo';
import { ColorsContext } from '../Context/ColorsContext';
import { SubscriptionsContext } from '../Context/SubsCriptionsContext';
import { FontsContext } from '../Context/FontsContext';
import { LinearGradient } from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';
import { BackgroundContext } from '../Context/BackGround';

const videoData = [
  {
    id: '1',
    title: 'Yatakta Sabah Enerjisi Artışı',
    duration: '5 dk',
    description: 'Başlangıç düzeyi',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },
  {
    id: '2',
    title: 'Mükemmel Duruş: Mobilite Ustalığı',
    duration: '10 dk',
    description: 'Gerinme',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },
  {
    id: '3',
    title: 'Hatları belirgin adonis kası şekillendirme',
    duration: '12 dk',
    description: 'Başlangıç düzeyi',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },
  {
    id: '4',
    title: 'Hatları belirgin adonis kası şekillendirme',
    duration: '12 dk',
    description: 'Başlangıç düzeyi',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },
  {
    id: '5',
    title: 'Hatları belirgin adonis kası şekillendirme',
    duration: '12 dk',
    description: 'Başlangıç düzeyi',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },
  {
    id: '6',
    title: 'Hatları belirgin adonis kası şekillendirme',
    duration: '12 dk',
    description: 'Başlangıç düzeyi',
    image: require('../../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'),
    youtubeUrl: 'https://www.youtube.com/embed/f2xGxd9xPYA',
  },

];



const { width, height } = Dimensions.get('window');

export default function MyFlatlist({ type, navigation, admin = false, sharedAnimationValue }) {
  const { colors } = useContext(ColorsContext);
  const { subscriptions } = useContext(SubscriptionsContext);
  const { fonts } = useContext(FontsContext);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { Background } = useContext(BackgroundContext)
  const startGradientAnimation = () => {
    Animated.loop(
      Animated.timing(sharedAnimationValue, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  };
  const catalogData = [
    {
      id: '1',
      title: 'YouTube Bağlantısı',
      description: 'Bebeğiniz için hazırlanan videolara göz atın ve ilham alın!',
      image: require('../assets/img/5.jpeg'),
      icon: 'logo-youtube',
      color: '#FF0000', // YouTube kırmızı rengi
      url: 'https://www.youtube.com/@merveçakırilesağlıklıuyku',
    },
    {
      id: '2',
      title: 'Aylık Paketler',
      description: 'Bebeğinizin gelişimini destekleyen özenle hazırlanmış paketler.',
      image: require('../assets/img/5.jpeg'),
      icon: 'logo-package',
      color: '#FFA500', // Örnek renk (Turuncu)
      navigateTo: 'MonthlyPackages',
    },
    {
      id: '3',
      title: 'Instagram',
      description: 'Popüler içeriklere göz atın!',
      image: require('../assets/img/Whell2.webp'),
      icon: 'logo-instagram',
      color: '#C13584', // Instagram pembesi
      navigateTo: 'Spin',
    },
  ];
  
  

  const renderCatalogItem = ({ item }) => {
    const handlePress = () => {
      if (item.url) {
        // Harici URL'yi aç
        Linking.openURL(item.url).catch((err) =>
          console.error('URL açılırken hata oluştu:', err)
        );
      } else if (item.navigateTo) {
        // Belirtilen ekrana yönlendir
        navigation.navigate(item.navigateTo);
      }
    };
  
    return (
      <TouchableOpacity
        style={[styles.CatalogcardContainer, { borderColor: item.color }]} // Kartın kenar rengi
        onPress={handlePress}
      >
        {/* Görsel */}
        <ImageBackground
          source={item.image}
          style={styles.CatalogbackgroundImage}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
        >
          {/* Logo veya İkon */}
          {item.icon ? (
            <View style={styles.iconWrapper}>
              <Icon
                name={item.icon}
                size={30} // İkon boyutu
                color={item.color} // İkonun rengi
              />
            </View>
          ) : null}
        </ImageBackground>
        {/* Başlık ve Açıklama */}
        <View style={styles.CatalogcontentContainer}>
          <Text style={[styles.Catalogtitle, { fontFamily: fonts.Bold }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.Catalogdescription, { fontFamily: fonts.Regular }]} numberOfLines={3}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  


  useEffect(() => {
    console.log(subscriptions);
  }, [subscriptions]);

  const renderExerciseItem = ({ item }) => (
    <View style={styles.cardContainer}>

      {/* Content inside the card */}
      {item.subscription_duration === 12 && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Bebeğiniz için en iyisi</Text>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.exerciseCard}
        onPress={() => navigation.navigate('Payment', { data: item, navigation })}
      >
        <ImageBackground
          source={require('../assets/img/5.jpeg')}
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
        />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <LinearGradient
          colors={['#c5f1fa', '#4A00E0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.descriptionContainer}
        >
          <Icon name="sleep" size={20} color="#FFF" style={styles.icon} />
          <Text style={[styles.title, { fontFamily: fonts.Bold }]} numberOfLines={2}>
            {item.packet_name}
          </Text>
          <Text style={[styles.description, { fontFamily: fonts.regular, color: "#B2EBF2" }]} numberOfLines={3}>
            {item.description}
          </Text>
        </LinearGradient>
      </View>

    </View>
  );




  const adminRenderExercise = ({ item }) => (
    
      <View style={styles.cardContainer}>
  
        {/* Content inside the card */}
        {item.subscription_duration === 12 && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Bebeğiniz için en iyisi</Text>
            </View>
          </View>
        )}
        <TouchableOpacity
          style={styles.exerciseCard}
          onPress={() => navigation.navigate('Payment', { data: item, navigation })}
        >
          <ImageBackground
            source={require('../assets/img/5.jpeg')}
            style={styles.backgroundImage}
            resizeMode="cover"
            imageStyle={{ borderTopLeftRadius: 15, borderTopRightRadius: 15 }}
          />
        </TouchableOpacity>
  
        <View style={styles.contentContainer}>
          <LinearGradient
            colors={['#c5f1fa', '#4A00E0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.descriptionContainer}
          >
            <Icon name="sleep" size={20} color="#FFF" style={styles.icon} />
            <Text style={[styles.title, { fontFamily: fonts.Bold }]} numberOfLines={2}>
              {item.packet_name}
            </Text>
            <Text style={[styles.description, { fontFamily: fonts.regular, color: "#B2EBF2" }]} numberOfLines={3}>
              {item.description}
            </Text>
          </LinearGradient>
        </View>
  
      </View>
    
  );

  const splitVideoDataIntoChunks = () => {
    const chunkSize = 5; // Her grupta 5 video olacak
    const chunks = [];
    for (let i = 0; i < videoData.length; i += chunkSize) {
      chunks.push(videoData.slice(i, i + chunkSize));
    }
    return chunks;
  };
  const renderVideoItem = ({ item }) => (

    <TouchableOpacity
      style={styles.videoCardContainer}
      onPress={() => setSelectedVideo(item)}
    >
      <LinearGradient
        colors={['#c5f1fa', '#4A00E0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.videoCard}
      >
        <Image source={item.image} style={styles.videoImage} />
        <View style={styles.textContainer}>
          <Text style={[styles.videoTitle, { fontFamily: fonts.Bold }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.videoDescription, { fontFamily: fonts.Regular }]}>
            {item.duration} | {item.description}
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>

  );




  const renderChunk = ({ item }) => (
    <FlatList
      data={item}
      renderItem={renderVideoItem}
      keyExtractor={(videoItem) => videoItem.id}
      horizontal={false}
      showsVerticalScrollIndicator={false}
    />
  );




  return (
    <View style={styles.container}>
      <Modal
        visible={selectedVideo !== null}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setSelectedVideo(null)} // Geri tuşuna basıldığında modalı kapat
      >
        <View style={styles.modalContainer}>
          {/* Kapatma Butonu */}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Icon name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          {/* Video Bileşeni */}
          {selectedVideo && (
            <YoutubeVideo youtubeUrl={selectedVideo.youtubeUrl} />
          )}
        </View>
      </Modal>

      {type === 'catalog' ? (
        <FlatList
          data={catalogData}
          renderItem={renderCatalogItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : type === 'exercise' ? (
        admin ? (
          <FlatList
            data={subscriptions}
            renderItem={adminRenderExercise}
            keyExtractor={(item) => item.id}
            horizontal
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <FlatList
            data={subscriptions}
            renderItem={renderExerciseItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
          />
        )
      ) : (
        <FlatList
          data={splitVideoDataIntoChunks()}
          renderItem={({ item }) => (
            <FlatList
              data={item}
              renderItem={renderVideoItem}
              keyExtractor={(videoItem) => videoItem.id}
              horizontal={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chunkContainer}
            />
          )}
          keyExtractor={(_, index) => `chunk-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContentVideo}
        />
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Görseli kapsayacak şekilde ölçekler
  },
  container: {

    borderRadius: 15,

  },
  flatListContentVideo: {

    borderColor: "white"

  },
  descriptionContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    height: height * 0.5,
    width: width * 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: "#8E2DE2",
    alignItems: 'center',

  },

  chunkContainer: {

  },
  videoCardContainer: {

    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    borderColor: "white",
    marginRight: width * 0.04,
  },
  exerciseCard: {


    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    width: '100%',
    height: height * 0.15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    marginBottom: 5,
  },
  title: {
    color: '#FFF',
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  description: {
    color: '#FFF',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  videoCard: {
    flexDirection: 'row',
    paddingRight: width * 0.029,
    borderRadius: 10,



  },
  videoImage: {
    width: 70,
    height: 70,
    borderRadius: 10,

  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',

    paddingRight: width * 0.06,
  },
  title: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  duration: {
    fontSize: 14,
    color: '#999',
  },
  durationHighlight: {
    color: '#4682b4',
    fontWeight: 'bold',
  },
  description: {
    color: '#777',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  videoDescription: {
    color: "#fff"
  },
  videoTitle: {
    color: "#fff",
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, // Diğer elemanların üstünde gösterilmesi için
  },
  badge: {
    backgroundColor: '#FF5733',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  flatListContent: {

  },
  cardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    height: height * 0.5,
    width: width * 0.9,
    marginLeft: width * 0.01,
    marginRight: width * 0.05,
    backgroundColor: 'rgba(52, 52, 52, alpha)', // Arka plan gradient ile değiştirildi
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    marginBottom: 10,
  },
  descriptionContainer: {
    flex: 1,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CatalogcardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    height: height * 0.5,
    width: width * 0.9,
    marginLeft: width * 0.01,
    marginRight: width * 0.05,
    backgroundColor: '#FFF', // Kart arka planı
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  CatalogbackgroundImage: {
    width: '100%',
    height: '86%', // Görselin yüksekliğini ayarladık
  },
  CatalogcontentContainer: {
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // Açıklama alanı için arka plan
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  Catalogtitle: {
    fontSize: 16,
    color: '#004085',
    fontWeight: 'bold',
    textAlign: 'center',
    // Başlık ve açıklama arasında boşluk
  },
  Catalogdescription: {
    fontSize: 14,
    color: '#003366',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 10, // Logoyu sol üst köşede göstermek için
    zIndex: 2,
  },
  
  iconStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // İkon için arka plan
    borderRadius: 15,
    padding: 10, // Arka plan için iç boşluk
  },
  iconWrapper: {
    backgroundColor: '#FFF', // Beyaz arka plan
    borderRadius: 20, // Yuvarlak görünüm
    padding: 5, // İkonun çevresindeki boşluk
    left:-width*0.38,
    alignSelf: 'center',
    marginTop: 10, // İkonun üstte konumlanması için
  },
  
  
  
});
