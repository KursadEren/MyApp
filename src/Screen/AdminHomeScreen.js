import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import Card from '../Components/Card';
import AdminNavbar from '../Components/AdminNavbar';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation }) {
  const [usersWithSubscriptions, setUsersWithSubscriptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          Alert.alert('Hata', 'Giriş yapmış kullanıcı bulunamadı.');
          return;
        }
        const currentUserId = currentUser.uid;

        const usersCollectionRef = firestore().collection('users');
        const usersSnapshot = await usersCollectionRef.get();

        const userList = [];

        for (const doc of usersSnapshot.docs) {
          if (doc.id !== currentUserId) {
            const userData = doc.data();
            const userId = doc.id;

            // Kullanıcının 'subscriptions' alt koleksiyonunu çekiyoruz
            const subscriptionsRef = usersCollectionRef
              .doc(userId)
              .collection('subscriptions');
            const subscriptionsSnapshot = await subscriptionsRef.get();

            const subscriptions = [];
            subscriptionsSnapshot.forEach((subscriptionDoc) => {
              subscriptions.push({
                id: subscriptionDoc.id,
                ...subscriptionDoc.data(),
              });
            });

            // Kullanıcı verilerini ve subscriptions'ı ekle
            userList.push({
              id: userId,
              ...userData,
              subscriptions,
            });
          }
        }

        setUsersWithSubscriptions(userList);
        console.log('Kullanıcı ve abonelik verileri yüklendi:', userList);
      } catch (error) {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
        Alert.alert('Hata', 'Kullanıcılar alınırken bir hata oluştu.');
      }
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={styles.Container}>
      <AdminNavbar navigation={navigation} />
      <ScrollView contentContainerStyle={styles.CardWrapper}>
        <View style={styles.CardContainer}>
          <Card
            title="DashBoard"
            iconName="home-outline"
            navigation={navigation}
            targetScreen="DashBoard"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
         <Card
  title="Users"
  iconName="people-outline"
  navigation={navigation}
  targetScreen="SubsUserScreen"
  cardWidth={(width / 2) - 30}
  cardHeight={150}
  onPress={() => {
    console.log('Navigating with users:', usersWithSubscriptions); // Debug için log ekleyin
    navigation.navigate('SubsUserScreen', { users: usersWithSubscriptions });
  }}
/>

        </View>
        <View style={styles.CardContainer}>
          <Card
            title="Settings"
            iconName="settings-outline"
            navigation={navigation}
            targetScreen="Settings"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
          <Card
            title="Reports"
            iconName="document-text-outline"
            navigation={navigation}
            targetScreen="Reports"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
        </View>
        <View style={styles.CardContainer}>
          <Card
            title="Abonelik Planı Düzenle"
            iconName="document-text-outline"
            navigation={navigation}
            targetScreen="SetSubscription"
            cardWidth={(width / 2) - 30}
            cardHeight={150}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  CardWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  CardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
});
