import React, { useContext, useState } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageBackground,
  StyleSheet,
  ScrollView,
} from 'react-native';
import MyTextInput from '../Components/MyTextInput';
import MyButton from '../Components/MyButton';
import { FontsContext } from '../Context/FontsContext';
import { ColorsContext } from '../Context/ColorsContext';
import { BackgroundContext } from '../Context/BackGround';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore"

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [userName, setUsername] = useState('');
  const { fonts } = useContext(FontsContext);
  const { colors } = useContext(ColorsContext);
  const { Background } = useContext(BackgroundContext);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }
  
    try {
      // Kullanıcıyı Firebase Authentication ile kaydet
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user; // user bilgilerini al
  
      // Kullanıcı bilgilerini Firestore'a kaydet
      const userData = {
        username: userName || '',
        email: user.email,
        createdAt: new Date(),
        last_login: new Date(),
        admin: false,
        isActive: true,
        phone: phone || '',
      };
  
      await firestore().collection('users').doc(user.uid).set(userData);
  
      Alert.alert('Başarılı', 'Kullanıcı başarıyla kaydedildi!');
      navigation.goBack(); // Kullanıcı başarıyla kaydedildikten sonra geri dön
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu e-posta adresi zaten kullanılıyor.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz e-posta adresi.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Hata', 'Şifre çok zayıf.');
      } else {
        Alert.alert('Hata', error.message);
      }
    }
  };
  
  return (
    <ImageBackground
      source={Background.primary}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            keyboardShouldPersistTaps="handled"
          >
            <MyTextInput
              placeholder="UserName"
              value={userName}
              onChangeText={text => setUsername(text)}
              iconName="person-outline"
            />
            <MyTextInput
              placeholder="Email"
              value={email}
              onChangeText={text => setEmail(text)}
              iconName="mail-outline"
            />
            <MyTextInput
              placeholder="Password"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry={true}
              iconName="lock-closed-outline"
            />
            <MyTextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              secureTextEntry={true}
              iconName="lock-closed-outline"
            />
            <MyTextInput
              placeholder="örn: 055"
              value={phone}
              onChangeText={text => setPhone(text)}
              iconName="call-outline"
            />
            <MyButton
              title="Register"
              onPress={handleRegister}
              backgroundColor={colors.login}
            />
            <MyButton
              title="Back to Login"
              onPress={() => navigation.goBack()}
              backgroundColor={colors.login}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
});
