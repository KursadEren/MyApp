import React from 'react';
import { StyleSheet, Text, ImageBackground, Dimensions,View } from 'react-native';

const { width,height } = Dimensions.get('window');

const CustomBackground = () => {
  return (
    <View style={{
        flex:1,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        backgroundColor:'#e3e3e3',
        height:height * 0.2,

       // Gerekirse genişliği sınırlandırın
      }}>
        <View style={{backgroundColor:'white', height:height * 0.2, padding:width * 0.02, borderRadius:30, marginTop:5,marginRight:3,alignItems:'center',justifyContent:'space-evenly'}}>
      <Text style={styles.title}>Bebeğinizin Geleceğini Şekillendirin</Text>
      <Text style={styles.subtitle}>
        Eğitim planlarımızla bebeğinizin gelişimini izleyin ve daha sağlıklı bir uyku düzeni geliştirmesine yardımcı olun.
      </Text>
 </View>
 </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    // Genişliği ekranın %90'ı yapıyoruz
    width: width * 0.9,
    // Daha fazla dikey alan kaplaması için sabit bir yükseklik veriyoruz
    // (Örneğin ekran genişliğinin yarısı)
    height: width * 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 30, // Metinleri biraz yukarıda göstermek için
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A6D98',
    textAlign: 'center',


  },
  subtitle: {
    fontSize: 16,
    color: '#8B8B8B',
    textAlign: 'center',
    lineHeight: 24,



  },
});

export default CustomBackground;
