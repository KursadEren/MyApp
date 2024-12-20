import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { FontsContext } from '../Context/FontsContext';
import { BackgroundContext } from '../Context/BackGround';
import { ColorsContext } from '../Context/ColorsContext';

const { width, height } = Dimensions.get('window');

export default function Destek() {
  const { fonts } = useContext(FontsContext);
  const { Background } = useContext(BackgroundContext);
const {colors} = useContext(ColorsContext);
  return (
    <ImageBackground
      source={Background.Home}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
        <ScrollView>
      <View style={styles.container}>
        {/* Başlık */}
        <Text style={[styles.title, { fontFamily: fonts.Heavy,color:colors.login ,color:'#a78fd3' }]}>AYARLAR</Text>

        {/* Bölümler */}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: fonts.Bold }]}>Uygulama Tercihleri</Text>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular ,color:'#a78fd3' }]}>Dil</Text>
            <Text style={[styles.optionValue, { fontFamily: fonts.Heavy ,color:'#a78fd3' }]}>Türkçe</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular,color:'#a78fd3'  }]}>Ölçü Birimi</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular ,color:'#a78fd3' }]}>Bildirimler</Text>
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: fonts.Bold  }]}>Sorun Giderme</Text>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular ,color:'#a78fd3' }]}>Uygulama Bilgileri</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular,color:'#a78fd3'  }]}>Bir Sorun Bildir</Text>
          </TouchableOpacity>
        </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: fonts.Bold  }]}>Yasal</Text>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular ,color:'#a78fd3' }]}>Şartlar ve Koşullar</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.optionContainer}>
            <Text style={[styles.optionText, { fontFamily: fonts.Regular,color:'#a78fd3'  }]}>Gizlilik Politikaları</Text>
          </TouchableOpacity>
          </View>
        </View>

        {/* Butonlar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { fontFamily: fonts.Bold, color:'#a78fd3' }]}>VERİLERİ SIFIRLA</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { fontFamily: fonts.Bold,color:'#a78fd3'  }]}>ÇIKIŞ YAP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <Text style={[styles.buttonText, { fontFamily: fonts.Bold ,color:'#a78fd3' }]}>HESABI SİL</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: '#6A5ACD',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#6A5ACD',
    marginBottom: 10,
  },
  optionContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop:5,
    marginRight:2,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    color: '#555',
  },
  optionValue: {
    fontSize: 16,
    color: '#6A5ACD',
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#A38ED6',
    borderRadius: 30,
    paddingVertical: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  modalContainer: {
    marginBottom: height * 0.02,
    width:width * 0.9,
    backgroundColor: '#e3e3e3',
    borderRadius: 20,
  },
});
