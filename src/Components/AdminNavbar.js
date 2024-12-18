import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { ColorsContext } from '../Context/ColorsContext';

const AdminNavbar = ({ navigation }) => {
  const { colors } = useContext(ColorsContext);

  // handleLogout fonksiyonunu tanımlayın
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('login');
    } catch (error) {
      console.error('Çıkış işlemi sırasında hata:', error);
      Alert.alert('Hata', 'Çıkış yaparken bir sorun oluştu.');
    }
  };

  return (
    <View style={[styles.navbar, { backgroundColor: "#a68cd5", borderWidth:1 }]}>
      {/* Profile Button */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('profile')}
      >
        <MaterialIcons name="person-outline" size={24} color="#FFFFFF" />
        <Text style={styles.iconText}>Profil</Text>
      </TouchableOpacity>

      {/* Messages Button */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('AdminConversationsScreen')}
      >
        <Feather name="message-square" size={24} color="#FFFFFF" />
        <Text style={styles.iconText}>Mesajlar</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.iconContainer} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#FFFFFF" />
        <Text style={styles.iconText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#4B0082',
   
    
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
});

export default AdminNavbar;
