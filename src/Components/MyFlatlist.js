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
import { FontsContext } from '../Context/FontsContext';
import { BackgroundContext } from '../Context/BackGround';
import Icon from 'react-native-vector-icons/Ionicons';

// Ayrı bileşenleri içe aktarıyoruz
import CatalogItem from './FlatlistRenderItem/CatalogItem';
import ExerciseItem from './FlatlistRenderItem/ExerciseItem';
import AdminExerciseItem from './FlatlistRenderItem/AdminExerciseItem';
import VideoItem from './FlatlistRenderItem/VideoItem';


const { width, height } = Dimensions.get('window');

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
const subscriptions = [
  {
    id: '1',
    title: '5 AYLIK UYKU PROGRAMI',
    description: '5 AYLIK UYKU PROGRAMI.',
    image: '5.png',
    price: 500,
    subscription_duration: 5,
    subs_id: 1,
  },
  {
    id: '2',
    title: '6 AYLIK UYKU PROGRAMI',
    description: '6 AYLIK UYKU PROGRAMI.',
    image: '6.png',
    price: 800,
    subscription_duration: 6,
    subs_id: 2,
  },
  {
    id: '3',
    title: '7 AYLIK UYKU PROGRAMI',
    description: '7 AYLIK UYKU PROGRAMI.',
    image: '7.png',
    price: 900,
    subscription_duration: 7,
    subs_id: 3,
  },
  {
    id: '4',
    title: '8 AYLIK UYKU PROGRAMI',
    description: '8 AYLIK UYKU PROGRAMI.',
    image: '8.png',
    price: 1000,
    subscription_duration: 8,
    subs_id: 4,
  },
  {
    id: '5',
    title: '9 AYLIK UYKU PROGRAMI',
    description: '9 AYLIK UYKU PROGRAMI.',
    image: '9.png',
    price: 1100,
    subscription_duration: 9,
    subs_id: 5,
  },
  {
    id: '6',
    title: '10 AYLIK UYKU PROGRAMI',
    description: '10 AYLIK UYKU PROGRAMI.',
    image: '10.png',
    price: 1200,
    subscription_duration: 10,
    subs_id: 6,
  },
  {
    id: '7',
    title: '11 AYLIK UYKU PROGRAMI',
    description: 'BEBEĞİNİZİN UYKU DÜZENİNİ OPTİMİZE ETMEK İÇİN 11 AYLIK PLAN.',
    image: '11.png',
    price: 1300,
    subscription_duration: 11,
    subs_id: 7,
  },
  {
    id: '8',
    title: '12 AYLIK UYKU PROGRAMI',
    description: 'UZUN VADELİ UYKU ALIŞKANLIKLARI İÇİN 12 AYLIK DETAYLI PROGRAM.',
    image: '12.png',
    price: 1500,
    subscription_duration: 12,
    subs_id: 8,
  },
];




const catalogData = [
  {
    id: '1',
    title: 'Bebeğiniz için hazırladığım videolara göz atın',
    description: '',
    backgroundImage: require('../assets/img/HomeContent/backgroundx3.png'),
    iconImage: require('../assets/img/HomeContent/play.png'),
    url: 'https://www.youtube.com/@merveçakırilesağlıklıuyku',
  },
  {
    id: '2',
    title: 'Bebeğinizin gelişimini destekleyen, özenle hazırlanmış paketler',
    description: '',
    backgroundImage: require('../assets/img/HomeContent/backgroundx3.png'),
    iconImage: require('../assets/img/HomeContent/click.png'),
    navigateTo: 'MonthlyPackages',
  },
  {
    id: '3',
    title: 'Popüler içeriklere göz atın!',
    description: '',
    backgroundImage: require('../assets/img/HomeContent/backgroundx3.png'),
    iconImage: require('../assets/img/HomeContent/insta.png'),
    navigateTo: 'Spin',
  },
];

export default function MyFlatlist({ type, navigation, admin = false, sharedAnimationValue }) {
  const { colors } = useContext(ColorsContext);
  
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

  useEffect(() => {
    console.log(subscriptions);
  }, [subscriptions]);

  const splitVideoDataIntoChunks = () => {
    const chunkSize = 5; 
    const chunks = [];
    for (let i = 0; i < videoData.length; i += chunkSize) {
      chunks.push(videoData.slice(i, i + chunkSize));
    }
    return chunks;
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={selectedVideo !== null}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setSelectedVideo(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Icon name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          {selectedVideo && (
            <YoutubeVideo youtubeUrl={selectedVideo.youtubeUrl} />
          )}
        </View>
      </Modal>

      {type === 'catalog' ? (
        <FlatList
          data={catalogData}
          renderItem={({ item }) => (
            <CatalogItem item={item} fonts={fonts} navigation={navigation} styles={styles} width={width} />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      ) : type === 'exercise' ? (
        admin ? (
          <FlatList
            data={subscriptions}
            renderItem={({ item }) => (
              <AdminExerciseItem item={item} navigation={navigation} fonts={fonts} styles={styles} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.flatListContent,{}]}
          />
        ) : (
          <FlatList
            data={subscriptions}
            renderItem={({ item }) => (
              <ExerciseItem item={item} navigation={navigation} fonts={fonts} styles={styles} />
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.flatListContent,{}]}
          />
        )
      ) : (
        <FlatList
          data={splitVideoDataIntoChunks()}
          renderItem={({ item }) => (
            <FlatList
              data={item}
              renderItem={({ item: videoItem }) => (
                <VideoItem item={videoItem} fonts={fonts} setSelectedVideo={setSelectedVideo} styles={styles} />
              )}
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
    resizeMode: 'cover', 
    width: '100%',
    height: '100%',
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
  chunkContainer: {},
  videoCardContainer: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    borderColor: "white",
    marginRight: width * 0.04,
  },
  exerciseCard: {
    
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
  videoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoDescription: {
    color: "#fff"
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
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10, 
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
 
  cardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    height: height * 0.5,
    width: width * 0.9,
    marginLeft: width * 0.01,
    marginRight: width * 0.05,
    backgroundColor: 'rgba(52, 52, 52, alpha)',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    marginBottom: 10,
  },
  // Catalog Item boyutları büyütüldü
  catalogCardContainer: {
    height:height*0.3,
    width: width * 0.5, // Kartı daha da büyüttük
    marginHorizontal: width * 0.02,
    alignItems: 'center',
  },
  catalogBackgroundImage: {
    width: width*0.5,
    aspectRatio: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative',
  },
  catalogBackgroundImageStyle: {
    borderRadius: 20,
  },
  catalogIcon: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
  },
  catalogTitle: {
    fontSize: 14,
    color: '#4A4A4A',
    textAlign: 'center',
    marginTop: 10,
    width: '100%',
  },
  catalogDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
    width: '100%',
    marginTop: 5,
  },
});
