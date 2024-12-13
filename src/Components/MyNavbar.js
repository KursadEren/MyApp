import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { ColorsContext } from '../Context/ColorsContext';
import { FontsContext } from '../Context/FontsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'react-native-linear-gradient';


import SearchInput from './SearchInput'; // Arama çubuğu bileşeni

const { width, height } = Dimensions.get('window');

export default function MyNavbar({ navigation }) {
  const { colors = { text: '#FFF' } } = useContext(ColorsContext) || {};
  const { fonts } = useContext(FontsContext);
 
 



 
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8E2DE2', '#8E2DE2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeTextBorder}>
          <Text style={styles.welcomeText}>Merhaba, Güzel Anne</Text>

        </View>
        {/* Arama Çubuğu */}

        <View style={styles.searchContainer}>
          <SearchInput />
        </View>

      </View>




    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.22, // Navbar yüksekliği artırıldı
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: height * 0.02, // Üst boşluk eklendi
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderBottomLeftRadius: width * 0.08,
    borderBottomRightRadius: width * 0.08,
  },
  welcomeSection: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: height * 0.02, // Merhaba yazısı ve arama çubuğu arası boşluk
  },
  welcomeTextBorder: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  welcomeText: {
    fontSize: width * 0.045,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    marginTop: height * 0.001, // Daha iyi hizalama için üst boşluk
  },
  circleButton: {
    width: width * 0.1, // Daha küçük boyut
    height: width * 0.1,
    borderRadius: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.02,
  },
  rightActions: {
    flexDirection: 'row',
    marginTop: height * 0.01, // Arama çubuğu ile ikonlar arası boşluk
  },
 
  
});
