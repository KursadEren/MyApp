import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
  Button,
  Image
} from 'react-native';
import CustomBackground from "../Components/CustomBackGround"
import Svg, { Path, Defs, LinearGradient, Stop, Filter, FeDropShadow } from 'react-native-svg';
import { ColorsContext } from '../Context/ColorsContext';
import MyNavbar from '../Components/MyNavbar';
import MyFlatlist from '../Components/MyFlatlist';
import SubscriptionCalendar from '../Components/SubscriptionCalendar';
import { FontsContext } from '../Context/FontsContext';
import { BackgroundContext } from '../Context/BackGround';
import { UserContext } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"



import { PaymentFlagContext } from '../Context/PaymentFlag';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { TokenContext } from '../Context/UserToken';
import HomeProfil from '../Components/HomeProfil';

const { height, width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {

  const { fonts } = useContext(FontsContext);
  const { Background } = useContext(BackgroundContext);
  const { flag, setFlag } = useContext(PaymentFlagContext);
  const { updateUser, user } = useContext(UserContext);
  const [currentMONTH, setCurrentMONTH] = useState();
  const [currentDayNumber, setCurrentDayNumber] = useState();
  const [currentYear, setCurrentYear] = useState();
  const [currentHour, setCurrentHour] = useState();
  const [currentMinute, setCurrentMinute] = useState();
  const { token } = useContext(TokenContext)

  //
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-height * 0.15))[0];



  

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setCurrentMONTH(date.toLocaleDateString('tr-TR', { weekday: 'long' }));
      setCurrentDayNumber(date.toLocaleDateString('tr-TR', { month: 'long' }));
      setCurrentYear(date.toLocaleDateString('tr-TR', { year: 'numeric' }));

      // Saat ve dakika değerlerini alıp iki haneli hale getiriyoruz
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      setCurrentHour(hours);
      setCurrentMinute(minutes);
    };
    console.log("token: ", token)
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const sharedAnimationValue = useState(new Animated.Value(0))[0];
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
    startGradientAnimation();
  }, [sharedAnimationValue]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const value = currentUser.uid;
        
          const userDocRef = firestore().collection('users').doc(value);

          // Belge anlık görüntüsünü alıyoruz
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            updateUser({ ...userData });
            setFlag(false)
            console.log(user, "heyyyy");
          } else {
            console.log('Belge bulunamadı.');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    if (flag) fetchUserData();
  }, [flag]);






  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          

          <ScrollView contentContainerStyle={styles.scrollContainer}>

         <HomeProfil/>

            <View style={styles.svgContainer}>
              <CustomBackground />
            </View>



            {/* Katalog Bileşeni Eklendi */}
            <View style={{
              marginVertical: height * 0.02,
              paddingLeft: width * 0.04,
            }}>
              <MyFlatlist type="catalog" sharedAnimationValue={sharedAnimationValue} navigation={navigation} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { fontFamily: fonts.Winter }]}>
                Motivasyon Videoları
              </Text>
              
              <MyFlatlist sharedAnimationValue={sharedAnimationValue} type="youtube" navigation={navigation} />
            </View>

            <View style={styles.calendarContainer}>
              <View style={styles.clockContainer}>
                <Text style={styles.timeText}>{currentHour}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timeText}>{currentMinute}</Text>
              </View>
              <View>
              <SubscriptionCalendar sharedAnimationValue={sharedAnimationValue} />
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>
                Planlar
              </Text>
              <View style={styles.planHeader}>
                <Text style={[styles.sectionTitletwo, { fontFamily: fonts.regular }]}>
                  <Icon name="power-sleep" size={20} color="#003366" />
                  Bebeğiniz için en iyileri
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Plans')}>
                  <Text style={[styles.sectionTitletwo, { fontFamily: fonts.regular }]}>
                    Tümünü Göster
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.flatListWrapper}>
                <MyFlatlist sharedAnimationValue={sharedAnimationValue} type="exercise" navigation={navigation} />
              </View>
            </View>

          </ScrollView>
        </View>
        <MyNavbar navigation={navigation} />
      </SafeAreaView>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: height * 0.02,
  },

  sectionContainer: {
    marginVertical: height * 0.02,
    paddingLeft: width * 0.04,
   
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#b865b6',
    alignSelf:"center",
    marginVertical:height*0.02
  },
  sectionTitletwo: {
    fontSize: 15,
    color: '#003366',
    marginRight: width * 0.05
  },
  flatListWrapper: {
    borderRadius: 15,
    backgroundColor: 'rgba(52, 52, 52, 0)',
    marginBottom: height * 0.09,
  },
  calendarContainer: {
    marginTop: height * 0.03,
    marginHorizontal: width * 0.05,
    borderRadius: 15,
    backgroundColor: 'transparent',
    marginBottom: height * 0.05,
  },
  clockContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  timeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004085',
  },
  colon: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#004085',
    marginHorizontal: 5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: height * 0.01,
  },
  circleButton: {
    width: width * 0.15, // Daha küçük boyut
    height: width * 0.15,
    borderRadius: width * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.02,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },


  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Daha karanlık bir arka plan
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  modalText: {
    fontSize: width * 0.045,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5, // İkon ile metin arasına boşluk
  },
  confirmButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 5, // İkon ile metin arasına boşluk
  },


  menu: {
    position: 'absolute',
    top: height * 0.18,
    left: '5%',
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 9,
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuItemText: {
    fontSize: width * 0.04,
    color: '#4A00E0',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  svgContainer: {
    
    flex: 1,
    marginVertical: width * 0.04,
    marginHorizontal: width * 0.04,
  },
  textContainer: {
    position: 'absolute',
    top: '35%',
    width: '80%',
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
