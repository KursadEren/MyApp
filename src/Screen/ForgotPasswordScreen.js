import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import MyTextInput from '../Components/MyTextInput';
import MyButton from '../Components/MyButton';
import { ColorsContext } from '../Context/ColorsContext';
import { FontsContext } from '../Context/FontsContext';
import { BackgroundContext } from '../Context/BackGround';
import auth from '@react-native-firebase/auth';
const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { colors } = useContext(ColorsContext);
  const { fonts } = useContext(FontsContext);
  const { Background } = useContext(BackgroundContext);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen bir e-posta adresi girin.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Başarılı',
        'Şifre sıfırlama bağlantısı e-postanıza gönderildi.'
      );
      navigation.goBack(); // İşlem sonrası Login ekranına döner
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ImageBackground
      source={Background.primary}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={[styles.title, { fontFamily: fonts.bold, color: colors.primary }]}>
          Şifremi Unuttum
        </Text>
        <MyTextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          iconName="mail-outline"
        />
        <MyButton
          title="Şifre Sıfırla"
          onPress={handlePasswordReset}
          backgroundColor={colors.login}
        />
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
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  title: {
    fontSize: width * 0.06,
    textAlign: 'center',
    marginBottom: height * 0.03,
    color: '#003366',
  },
});
