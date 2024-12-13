import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useContext} from 'react';
import {BackgroundContext} from '../Context/BackGround';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {UserContext} from '../Context/UserContext';

const {width} = Dimensions.get('window');

export default function ProfileScreen() {
  const {Background} = useContext(BackgroundContext);
  const {user} = useContext(UserContext);

  return (
    <ImageBackground source={Background.primary} style={styles.background}>
      
      <ScrollView contentContainerStyle={styles.Container}>
        <View style={styles.ProfileImage}>
          <Icon name="account-circle" size={width * 0.3} color="#6A5ACD" />
          <Text style={styles.userName}>
            {user ? user.username : 'Kullanıcı adı'}
          </Text>
        </View>

        <View style={styles.Subscription}>
          <Text style={styles.title}>Abonelik Bilgilerim</Text>
          {user && user.subscriptions && user.subscriptions.length > 0 ? (
            user.subscriptions.map((sub, index) => (
              <View key={index} style={styles.subscriptionBlock}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Paket:</Text>
                  <Text style={styles.infoText}>{sub.packet_name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Fiyat:</Text>
                  <Text style={styles.infoText}>{sub.amount_paid} TL</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Başlangıç:</Text>
                  <Text style={styles.infoText}>
                    {new Date(
                      sub.subscription_start.seconds * 1000,
                    ).toLocaleDateString()}{' '}
                    -{' '}
                    {new Date(
                      sub.subscription_start.seconds * 1000,
                    ).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Bitiş:</Text>
                  <Text style={styles.infoText}>
                    {new Date(
                      sub.subscription_end.seconds * 1000,
                    ).toLocaleDateString()}{' '}
                    -{' '}
                    {new Date(
                      sub.subscription_end.seconds * 1000,
                    ).toLocaleTimeString()}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Aktif:</Text>
                  <Text style={styles.infoText}>
                    {sub.is_active ? 'Evet' : 'Hayır'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noSubscription}>
              Henüz abonelik satın alınmadı.
            </Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  Container: {
    paddingHorizontal: 20,
    alignItems: 'center',
    // flexGrow ve justifyContent kaldırıldı
     flexGrow: 1 
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'center' kaldırıldı
  },
  ProfileImage: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  Subscription: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    width: width * 0.85,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20, // Alt tarafa boşluk eklendi
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4B0082',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B0082',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  noSubscription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
  subscriptionBlock: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
