import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
 const{height} = Dimensions.get("window")
export default function SubsUserScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('username');
  const [loading, setLoading] = useState(true);

  // Kullanıcıları ve abonelikleri Firestore'dan çek
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollectionRef = firestore().collection('users');
        const usersSnapshot = await usersCollectionRef.get();

        if (usersSnapshot.empty) {
          Alert.alert('Hata', 'Hiç kullanıcı bulunamadı.');
          navigation.goBack(); // Önceki sayfaya yönlendir
          return;
        }

        const userList = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSubscriptions(userList);
      } catch (error) {
        console.error('Kullanıcılar alınırken hata oluştu:', error);
        Alert.alert('Hata', 'Kullanıcı verileri alınırken bir sorun oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const sortData = () => {
    let sortedData = [...subscriptions];

    sortedData.sort((a, b) => {
      if (sortBy === 'username') {
        const usernameA = a.username?.toLowerCase() || '';
        const usernameB = b.username?.toLowerCase() || '';
        return sortOrder === 'asc'
          ? usernameA.localeCompare(usernameB)
          : usernameB.localeCompare(usernameA);
      }

      if (sortBy === 'start_date') {
        const dateA = new Date(a.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        const dateB = new Date(b.subscriptions?.[0]?.subscription_start?.seconds * 1000 || 0);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }

      if (sortBy === 'plan') {
        const planA = a.subscriptions?.[0]?.packet_name || 'Free';
        const planB = b.subscriptions?.[0]?.packet_name || 'Free';
        return sortOrder === 'asc' ? planA.localeCompare(planB) : planB.localeCompare(planA);
      }

      return 0;
    });

    return sortedData;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortControls}>
        <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} style={styles.button}>
          <Text style={styles.buttonText}>Sırala: {sortOrder === 'asc' ? 'Artan' : 'Azalan'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('username')} style={styles.button}>
          <Text style={styles.buttonText}>İsme Göre</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('start_date')} style={styles.button}>
          <Text style={styles.buttonText}>Başlangıç Tarihi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('plan')} style={styles.button}>
          <Text style={styles.buttonText}>Planlara Göre</Text>
        </TouchableOpacity>
      </ScrollView>
      <FlatList
        data={sortData()}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.userName}>Kullanıcı Adı: {item.username || 'Bilinmiyor'}</Text>
            <Text style={styles.userEmail}>E-posta: {item.email || 'Bilinmiyor'}</Text>
            <Text style={styles.subHeader}>Abonelikler:</Text>
            {item.subscriptions && item.subscriptions.length > 0 ? (
              item.subscriptions.map((subscription, index) => (
                <View key={index} style={styles.subscriptionContainer}>
                  <Text style={styles.subscriptionDetail}>🎁 Paket: {subscription.packet_name}</Text>
                  <Text style={styles.subscriptionDetail}>
                    📅 Başlangıç: {subscription.subscription_start?.seconds ? new Date(subscription.subscription_start.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </Text>
                  <Text style={styles.subscriptionDetail}>
                    📅 Bitiş: {subscription.subscription_end?.seconds ? new Date(subscription.subscription_end.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </Text>
                  <Text style={styles.subscriptionDetail}>💵 Fiyat: {subscription.amount_paid} TL</Text>
                </View>
              ))
            ) : (
              <Text style={styles.subscriptionDetail}>Abonelik Yok</Text>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 30 : 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortControls: {
    flexDirection: 'row',
    marginBottom: 10,
    height:height*0.0001,
  },
  button: {
    backgroundColor: '#4B0082',
    justifyContent:"center",    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf:"center",
    justifyContent:"center"
  },
  card: {
    backgroundColor: '#FFF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subscriptionContainer: {
    marginTop: 5,
    padding: 5,
    backgroundColor: '#EFEFEF',
    borderRadius: 5,
  },
  subscriptionDetail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
});
