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
  Button
} from 'react-native';
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
import { TokenContext } from '../Context/UserToken';

const { height, width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { colors } = useContext(ColorsContext);
  const { fonts } = useContext(FontsContext);
  const { Background } = useContext(BackgroundContext);
  const [userToken, setUserToken] = useState();
  const { flag, setFlag } = useContext(PaymentFlagContext);
  const { updateUser,user } = useContext(UserContext);
  const [currentDay, setCurrentDay] = useState();
  const [currentMONTH, setCurrentMONTH] = useState();
  const [currentDayNumber, setCurrentDayNumber] = useState();
  const [currentYear, setCurrentYear] = useState();
  const [currentHour, setCurrentHour] = useState();
  const [currentMinute, setCurrentMinute] = useState();
 const {token} = useContext(TokenContext)

  //
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-height * 0.15))[0];
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -height * 0.15,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };


  const handleLogoutPress = async () => {
    try {
      // Firebase Authentication'dan çıkış yap
      await auth().signOut();
  
      // AsyncStorage'dan token'ı sil (eğer kullanıyorsanız)
     
  
      // Çıkış modalını kapat
      setLogoutModalVisible(false);
  
      // Login sayfasına yönlendir
      navigation.navigate('login');
    } catch (error) {
      console.error('Çıkış işlemi sırasında hata:', error);
      Alert.alert('Hata', 'Çıkış yaparken bir sorun oluştu.');
    }
  };
  

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
          setUserToken(value);
          const userDocRef = firestore().collection('users').doc(value);
          
          // Belge anlık görüntüsünü alıyoruz
          const userDoc = await userDocRef.get();
          
          if (userDoc.exists) {
            const userData = userDoc.data();
            updateUser({ ...userData });
            setFlag(false)
              console.log(user,"heyyyy");
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
  



  const handleNotificationPress = () => {
    Alert.alert('Bildirimler', 'Henüz yeni bir bildiriminiz yok.');
  };

  const handleMailPress = () => {
   navigation.navigate("ChatScreen")
  };



  return (
    <ImageBackground
      source={Background.primary}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <MyNavbar navigation={navigation} />

          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={[styles.circleButton, { backgroundColor: '#E1BEE7' }]}
                onPress={handleMailPress}
              >
                <Ionicons name="mail-outline" size={width * 0.1} color="#4A00E0" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.circleButton, { backgroundColor: '#C5CAE9' }]}
                onPress={toggleMenu}
              >
                <Ionicons name="settings-outline" size={width * 0.1} color="#303F9F" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.circleButton, { backgroundColor: '#B2EBF2' }]}
                onPress={handleNotificationPress}
              >
                <Ionicons name="notifications-outline" size={width * 0.1} color="#00BCD4" />
              </TouchableOpacity>





            </View>
            {menuVisible && (
              <Animated.View
                style={[
                  styles.menu,
                  {
                    transform: [{ translateY: slideAnim }],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => setLogoutModalVisible(true)}
                  style={styles.menuItem}
                >
                  <Ionicons name="exit-outline" size={width * 0.06} color="#4A00E0" />
                  <Text style={styles.menuItemText}>Çıkış Yap</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
            <Modal
              visible={logoutModalVisible}
              transparent={true}
              animationType="slide" // Daha yumuşak bir geçiş için "slide" animasyonu
              onRequestClose={() => setLogoutModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={width * 0.15}
                    color="#FF5722"
                    style={{ marginBottom: 15 }}
                  />
                  <Text style={styles.modalText}>Çıkış yapmak istediğinize emin misiniz?</Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setLogoutModalVisible(false)}
                    >
                      <Ionicons name="close-circle" size={width * 0.05} color="#FFF" />
                      <Text style={styles.cancelButtonText}>Vazgeç</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.confirmButton]}
                      onPress={handleLogoutPress}
                    >
                      <Ionicons name="checkmark-circle" size={width * 0.05} color="#FFF" />
                      <Text style={styles.confirmButtonText}>Çıkış Yap</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>



            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { fontFamily: fonts.bold }]}>
                Bebeğiniz Geleceğini Şekillendirin
              </Text>
              <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
                Eğitim planlarımızla bebeğinizin gelişimini izleyin ve daha sağlıklı bir uyku düzeni
                geliştirmesine yardımcı olun.
              </Text>
            </View>

            {/* Katalog Bileşeni Eklendi */}
            <View style={{
              marginVertical: height * 0.02,
              paddingLeft: width * 0.04,
            }}>
              <MyFlatlist type="catalog" sharedAnimationValue={sharedAnimationValue} navigation={navigation} />
            </View>
            <View style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>
                Motivasyon Videoları
              </Text>
              <Text style={[styles.sectionTitletwo, { fontFamily: fonts.thin }]}>
                <Icon name="power-sleep" size={20} color="#003366" style={styles.icon} />
                En iyi Ücretsiz Videolar
              </Text>
              <MyFlatlist sharedAnimationValue={sharedAnimationValue} type="youtube" navigation={navigation} />
            </View>

            <View style={styles.calendarContainer}>
              <View style={styles.clockContainer}>
                <Text style={styles.timeText}>{currentHour}</Text>
                <Text style={styles.colon}>:</Text>
                <Text style={styles.timeText}>{currentMinute}</Text>
              </View>
              <SubscriptionCalendar sharedAnimationValue={sharedAnimationValue} />
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
            <TouchableOpacity onPress={()=>navigation.navigate("SeeGoogle")} style={{borderWidth:1}}>
              <Text>hey</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
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
  infoSection: {
    marginVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 24,
    color: '#004085',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#003366',
    lineHeight: 24,
    textAlign: 'center',
  },
  sectionContainer: {
    marginVertical: height * 0.02,
    paddingLeft: width * 0.04,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004085',
  },
  sectionTitletwo: {
    fontSize: 15,
    color: '#003366',
    marginRight:width*0.05
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

});
