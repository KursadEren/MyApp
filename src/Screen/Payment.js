import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity,StatusBar, Dimensions ,Platform, SafeAreaView } from 'react-native';

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight || 0;
const Payment = ({route ,navigation}) => {
  const { data } = route.params;

  
    
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Arkaplan Görseli */}
      <Image
        source={require('../assets/img/Payment/background.png')} // Arkaplan görseli
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Başlık Görseli */}
      <Image
        source={require('../assets/img/Payment/saglik.png')} // Sağlıklı uyku başlığı
        style={[styles.fullWidthImage,{marginTop:statusBarHeight}]}
        resizeMode="contain"
      />

      <Image
        source={require('../assets/img/Payment/merveCakir.png')} // Merve Çakır başlığı
        style={styles.MerveCakir}
        resizeMode="contain"
      />

      {/* İlk Kart Görseli */}
      <Image
        source={require('../assets/img/Payment/uzman.png')} // Uzman desteği
        style={styles.cardImage}
        resizeMode="contain"
      />

      {/* İkinci Kart Görseli */}
      <Image
        source={require('../assets/img/Payment/bilimsel.png')} // Bilimsel ve etkili yaklaşım
        style={styles.cardImage}
        resizeMode="contain"
      />

      {/* Üçüncü Kart Görseli */}
      <Image
        source={require('../assets/img/Payment/sorular.png')} // Sorularınıza yanıt
        style={styles.cardImage}
        resizeMode="contain"
      />

      {/* SATIN AL Butonu Görseli */}
      <TouchableOpacity onPress={()=> navigation.navigate('Payment2', { data: data })} 
      activeOpacity={0.8} style={styles.buttonWrapper}>
        <Image
          source={require('../assets/img/Payment/satinal.png')} // Satın Al butonu
          style={styles.buttonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  fullWidthImage: {
    width: width ,
    height: height * 0.2,
    
  
  },
  MerveCakir:{
    width: width * 0.9,
    height: height * 0.1,
    marginVertical: 5,
  },
  cardImage: {
    width: width * 0.9,
    height: height * 0.15,
    marginVertical: 5, // Kartlar arasındaki boşluk
  },
  buttonWrapper: {
    marginTop: 10,
    width: width * 0.8,
  },
  buttonImage: {
    width: '100%',
    height: height * 0.08,
  },
});

export default Payment;
