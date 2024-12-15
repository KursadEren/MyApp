import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorsContext } from '../Context/ColorsContext';

const { width, height } = Dimensions.get('window');

export default function MyNavbar({ navigation }) {
  const { colors = { text: '#FFF' } } = useContext(ColorsContext) || {};
  const [menuVisible, setMenuVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(false);
    // Çıkış işlemini burada gerçekleştirin
  };

  return (
    <View style={styles.container}>
      {/* Ayarlar İkonu */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: '#C5CAE9' }]} // Ayarlar için özelleştirilmiş stil
        onPress={toggleMenu}
      >
        <Image
          source={require('../assets/img/navbar/ayarlar.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Bildirim İkonu */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: '#B2EBF2' }]} // Bildirim için özelleştirilmiş stil
        onPress={() => navigation.navigate('Bildirim')}
      >
        <Image
          source={require('../assets/img/navbar/bildirim.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Home İkonu */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Image
          source={require('../assets/img/navbar/home.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Mesaj İkonu */}
      <TouchableOpacity
        style={[styles.iconButton, { backgroundColor: '#FFECB3' }]} // Mesaj için özelleştirilmiş stil
        onPress={() => navigation.navigate('Mesaj')}
      >
        <Image
          source={require('../assets/img/navbar/mesaj.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Profil İkonu */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('ChatScreen')}
      >
        <Image
          source={require('../assets/img/navbar/profil.png')}
          style={styles.iconImage}
        />
      </TouchableOpacity>

      {/* Menü */}
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

      {/* Çıkış Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent={true}
        animationType="slide"
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  iconButton: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: width * 0.03,
    borderRadius: 50,
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  menu: {
    position: 'absolute',
    bottom: height * 0.12,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A00E0',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF5722',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#FFF',
    marginLeft: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    marginLeft: 5,
  },
});
