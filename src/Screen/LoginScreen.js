import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Modal,
} from 'react-native';
import MyTextInput from '../Components/MyTextInput';
import MyButton from '../Components/MyButton';
import { FontsContext } from '../Context/FontsContext';
import { BackgroundContext } from '../Context/BackGround';
import { ColorsContext } from '../Context/ColorsContext';
import { TokenContext } from '../Context/UserToken';
import { SubscriptionsContext } from '../Context/SubsCriptionsContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../Context/UserContext';
import { PaymentFlagContext } from '../Context/PaymentFlag';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { fonts, fontsLoaded } = useContext(FontsContext);
  const { colors } = useContext(ColorsContext);
  const { Background } = useContext(BackgroundContext);
  const { setToken, token } = useContext(TokenContext);
  const { fetchSubscriptions } = useContext(SubscriptionsContext);
  const { setFlag } = useContext(PaymentFlagContext);
  const { updateUser } = useContext(UserContext);

  // Modal stateleri
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

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
          setFlag(false);
        } else {
          console.log('Belge bulunamadı.');
          setModalContent('Kullanıcı verileri bulunamadı.');
          setInfoModalVisible(true);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setModalContent('Kullanıcı verilerini çekerken bir hata oluştu.');
      setInfoModalVisible(true);
    }
  };

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        const currentUser = auth().currentUser;

        if (currentUser) {
          console.log('Kullanıcı giriş yapmış durumda:', currentUser.email);

          // Kullanıcının UID'sini alın
          const userUID = currentUser.uid;

          // Firestore'dan kullanıcı bilgilerini alın
          const userDocRef = firestore().collection('users').doc(userUID);
          const userDoc = await userDocRef.get();

          if (userDoc.exists) {
            console.log("Kullanıcı Firestore'da bulundu:", userDoc.data());

            // Abonelik bilgilerini çek
            await fetchSubscriptions();

            const userData = userDoc.data();

            if (userData.admin === true) {
              await fetchUserData();
              setModalContent(`Hoşgeldin ${userData.username}`);
              setInfoModalVisible(true);
              navigation.navigate('Admin');
            } else {
              await fetchUserData();
              setModalContent(`Hoşgeldin ${userData.username}`);
              setInfoModalVisible(true);
              navigation.navigate('Home');
            }
          } else {
            console.log("Firestore'da kullanıcı dokümanı bulunamadı.");
            setModalContent('Kullanıcı verileri bulunamadı.');
            setInfoModalVisible(true);
          }
        } else {
          console.log('Kullanıcı oturum açmamış.');
        }
      } catch (error) {
        console.error('AutoLogin sırasında hata:', error);
        setModalContent('Otomatik giriş sırasında bir sorun oluştu.');
        setInfoModalVisible(true);
      }
    };

    performAutoLogin();
  }, [navigation, fetchSubscriptions, setToken]);

  // Diğer kodlarınız (handleLogin fonksiyonu vb.) burada devam eder

  const handleLogin = async () => {
    if (!email || !password) {
      setModalContent('Email ve şifre alanlarını doldurun!');
      setInfoModalVisible(true);
      return;
    }

    try {
      console.log('Giriş yapmayı deniyor:', email);

      // Mevcut oturumu kapat (Gerekli olmayabilir, aşağıda açıklayacağım)
      if (auth().currentUser) {
        console.log('Mevcut kullanıcı oturumu kapatılıyor...');
        await auth().signOut();
      }

      // Kullanıcı giriş yapar
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('Kullanıcı giriş yaptı:', userCredential.user.uid);

      // Kullanıcının UID'sini alır
      const userUID = userCredential.user.uid;
      console.log('Kullanıcı UID:', userUID);

      // Firestore'dan kullanıcı dokümanını alır
      const userDocRef = firestore().collection('users').doc(userUID);
      const userDoc = await userDocRef.get();
      console.log('Kullanıcı dokümanı alındı.');
      await fetchSubscriptions();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("Kullanıcı Firestore'da bulundu:", userData);

        // 'admin' alanını kontrol eder
        if (userData.admin === true) {
          await fetchUserData();
          console.log("Kullanıcı admin, AdminHomeScreen'e yönlendiriliyor.");
          setModalContent(`Hoşgeldin ${userData.username}`);
          setInfoModalVisible(true);
          navigation.navigate('Admin');
        } else {
          await fetchUserData();
          console.log("Kullanıcı normal, HomeScreen'e yönlendiriliyor.");
          setModalContent(`Hoşgeldin ${userData.username}`);
          setInfoModalVisible(true);
          navigation.navigate('Home');
        }
      } else {
        console.log("Firestore'da kullanıcı dokümanı bulunamadı.");
        setModalContent('Kullanıcı verileri bulunamadı.');
        setInfoModalVisible(true);
      }
    } catch (error) {
      console.error('Giriş işlemi sırasında hata:', error);
      setModalContent(error.message);
      setInfoModalVisible(true);
    }
  };

  return (
    <ImageBackground
      source={Background.primary}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Image
          source={require('../assets/img/merhaba.png')} // Görsel yolu
          style={{
            width: width * 0.9,   // Ekran genişliğinin %90'ı
            height: height * 0.2, // Ekran yüksekliğinin %20'si
            resizeMode: 'contain', // Görselin oranlarını bozmadan boyutlandırır
          }}
        />
        <MyTextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          iconName="person-outline"
        />
        <MyTextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          iconName="lock-closed-outline"
        />

        <View style={styles.textContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('register')}>
            <Text style={[styles.text, { color: colors.login, fontFamily: fonts.heavy }]}>
              Hesabın yok mu?{' '}
              <Text style={{ color: colors.login, textDecorationLine: 'underline' }}>
                Kayıt Ol
              </Text>
            </Text>
          </TouchableOpacity>
          <View style={{ borderLeftWidth: 1, height: 12, borderColor: colors.login, marginHorizontal: 10 }} />
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.text, { color: colors.login }]}>
              Şifremi Unuttum
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <MyButton
            title="Login"
            onPress={handleLogin}
            backgroundColor={colors.login}
          />
        </View>
      </View>

      {/* Modal Bileşeni */}
      <Modal
        visible={infoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {modalContent ? (
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalInnerContent}>
                  <Text style={[styles.modalText, { fontFamily: fonts.bold, color: colors.login }]}>
                    {modalContent}
                  </Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => {
                      setModalContent('');
                      setInfoModalVisible(false);
                    }}
                  >
                    <View style={styles.closeButtonInner}>
                      <Text style={[styles.cancelText, { fontFamily: fonts.baby, color: colors.login }]}>Kapat</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    marginTop: height * 0.02,
  },
  text: {
    fontSize: width * 0.04, // Oranını biraz artırdım
  },
  title: {
    fontSize: width * 0.06,
    textAlign: 'center',
    marginBottom: height * 0.03,
    color: '#003366',
  },
  // Modal stilleri
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Arka planı hafif karartma
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#e3e3e3',
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    marginTop:5,
    marginRight:2,


    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  modalInnerContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop:30,
    height: height * 0.3,
  },
  modalText: {
    fontSize: 25,
    textAlign: 'center',

  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e3e3e3',
    height: height * 0.07,
    width: width * 0.3,
    borderRadius: 30,
    justifyContent: 'center',

  },
  closeButtonInner: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: 'white',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop:5,
    marginRight:2,
    alignItems: 'center',


  },
  cancelText: {
    fontSize: 16,
  },
});
