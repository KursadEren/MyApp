import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SubscriptionsContext } from '../Context/SubsCriptionsContext';
import MyFlatlist from '../Components/MyFlatlist';
import { ColorsContext } from '../Context/ColorsContext';



export default function SetSubscription({ navigation }) {
  const { subscriptions,addToSubscriptions } = useContext(SubscriptionsContext);
  const { colors } = useContext(ColorsContext);

  const handleAddSubscription = () => {
    const newSubscription = {
      subs_id: Date.now().toString(), // Benzersiz bir ID oluştur
      packet_name: 'Yeni Paket',
      description: 'Bu, yeni bir abonelik paketidir.',
      subscription_duration: 6, // Örnek süre
      price:6,
      image:'',
    };

    addToSubscriptions(newSubscription); // Context'e yeni öğe eklenir
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Paketlerin Özet Görünümü */}
      <View style={styles.redContainer}>
        <Text style={styles.summaryTitle}>Tüm Paketler</Text>
        <ScrollView contentContainerStyle={styles.summaryContent}>
          {subscriptions.map((sub) => (
            <TouchableOpacity
              key={sub.id}
              style={styles.summaryBox}
              onPress={() => navigation.navigate('packagedetails', { package: sub })} // Paket detay sayfasına yönlendirme
            >
              <Text style={styles.summaryText}>{sub.packet_name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* FlatList */}
      <MyFlatlist type="exercise" admin={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 0,
  },
  redContainer: {
    backgroundColor: 'white', // Kırmızı arka plan
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 15, // İçerik için boşluk
    alignItems: 'center', // İçeriği ortalar
    width: '100%', // Genişliği tam ekran yapar
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF', // Yazı rengini beyaz yapar
    marginBottom: 10,
  },
  summaryContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // İçeriği ortalar
  },
  summaryBox: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
