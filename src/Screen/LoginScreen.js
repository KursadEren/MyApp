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
  const {setFlag} = useContext(PaymentFlagContext)
 const {updateUser} = useContext(UserContext)
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
          
        } else {
          console.log('Belge bulunamadı.');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
            console.log('Kullanıcı Firestore\'da bulundu:', userDoc.data());

            // Abonelik bilgilerini çek
            await fetchSubscriptions();
           
            const userData = userDoc.data();

            if (userData.admin === true) {
              await fetchUserData();
              Alert.alert('Başarılı', 'Admin olarak giriş yapıldı!');
              navigation.navigate('Admin');
            } else {
              await fetchUserData();
              Alert.alert('Başarılı', 'Kullanıcı olarak giriş yapıldı!');
              navigation.navigate("Home");
            }

           
          } else {
            console.log('Firestore\'da kullanıcı dokümanı bulunamadı.');
            Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
          }
        } else {
          console.log('Kullanıcı oturum açmamış.');
        }
      } catch (error) {
        console.error('AutoLogin sırasında hata:', error);
        Alert.alert('Hata', 'Otomatik giriş sırasında bir sorun oluştu.');
      }
    
    };

    performAutoLogin();
  }, [navigation, fetchSubscriptions, setToken]);

  // Diğer kodlarınız (handleLogin fonksiyonu vb.) burada devam eder

  

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Email ve şifre alanlarını doldurun!');
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
        console.log('Kullanıcı Firestore\'da bulundu:', userData);

        // 'admin' alanını kontrol eder
        if (userData.admin === true) {
          await fetchUserData();
          console.log('Kullanıcı admin, AdminHomeScreen\'e yönlendiriliyor.');
          navigation.navigate('Admin');
        } else {
          await fetchUserData();
          console.log('Kullanıcı normal, HomeScreen\'e yönlendiriliyor.');
          navigation.navigate("Home");
        }
      } else {
        console.log('Firestore\'da kullanıcı dokümanı bulunamadı.');
        Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
      }
  
    
  
    } catch (error) {
      Alert.alert('Hata', error.message);
      console.error('Giriş işlemi sırasında hata:', error);
      console.error('Hata kodu:', error.code);
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
  source={require('../assets/img//merhaba.png')} // Görsel yolu
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
            <Text style={[styles.text, { color: colors.login,fontFamily:fonts.heavy }]}>
              Hesabın yok mu?{' '}
              <Text style={{ color: colors.login, textDecorationLine: 'underline' }}>
                Kayıt Ol
              </Text>
            </Text>
          </TouchableOpacity>
           <View style={{borderLeftWidth:1,height:12,borderColor:colors.login}}></View>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={[styles.text, { color: colors.login }]}>
              Şifremi Unuttum
            </Text>
          </TouchableOpacity>
          
        </View>
        <View style={{alignItems:"center"}}>
        <MyButton
          title="Login"
          onPress={handleLogin}
          backgroundColor={colors.login}
        />
        </View>
      </View>
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
    fontSize: width * 0.03,
  },
  title: {
    fontSize: width * 0.06,
    textAlign: 'center',
    marginBottom: height * 0.03,
    color: '#003366',
  },
});
