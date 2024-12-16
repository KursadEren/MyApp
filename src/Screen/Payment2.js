import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TokenContext } from '../Context/UserToken';


import { PaymentFlagContext } from '../Context/PaymentFlag';
 // Import react-native-uuid
import { ColorsContext } from '../Context/ColorsContext';
import { FontsContext } from '../Context/FontsContext';
import { LinearGradient } from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import uuid from 'react-native-uuid';
const { width, height } = Dimensions.get('window');

export default function Payment2({ route,navigation }) {
  const { data } = route.params;
  const { token } = useContext(TokenContext);
  const { setFlag } = useContext(PaymentFlagContext);
  const { colors } = useContext(ColorsContext);
  const { fonts } = useContext(FontsContext);

  const handlePayment = async () => {
    if (!data.subs_id || !data.price || !data.subscription_duration) {
      Alert.alert('Hata', 'Eksik bilgi gönderildi.');
      return;
    }
  
    try {
      const currentUser = auth().currentUser;
  
      if (!currentUser) {
        Alert.alert('Hata', "Kullanıcı oturumu bulunamadı.");
        console.log('Hata: Oturum bulunamadı. auth().currentUser null döndü.');
        return;
      }
  
      const userId = currentUser.uid;
  
      const transactionId = uuid.v4(); // UUID oluşturma
      const subscriptionStart = firestore.Timestamp.now();
  
      // Burada 30 gün çarpımı ile süreyi gün olarak ekliyoruz
      const currentDate = new Date();
      const totalDays = parseInt(data.subscription_duration) * 30; // Her paket için 30 gün baz alınıyor
      currentDate.setDate(currentDate.getDate() + totalDays); // Tarihe gün ekleme
      const subscriptionEnd = firestore.Timestamp.fromDate(currentDate);
  
      const subscriptionData = {
        amount_paid: data.price,
        is_active: true,
        subs_id: data.subs_id,
        subscription_start: subscriptionStart,
        subscription_end: subscriptionEnd,
        transaction_id: transactionId,
        packet_name: data.packet_name || "Bilinmeyen Paket",
      };
  
      console.log("Firestore'a eklenecek veri:", subscriptionData);
  
      // Kullanıcının referansını alıyoruz
      const userRef = firestore().collection('users').doc(userId);
      console.log("Kullanıcı referansı alındı:", userRef.path);
  
      // Kullanıcının altındaki 'subscriptions' koleksiyonuna ekleme yapıyoruz
      const subscriptionsRef = userRef.collection('subscriptions');
      console.log("Koleksiyon referansı alındı: subscriptions");
  
      // Yeni aboneliği 'subscriptions' koleksiyonuna ekliyoruz
      await subscriptionsRef.add(subscriptionData);
      console.log("Abonelik Firestore'a başarıyla eklendi.");
  
      Alert.alert('Başarılı', 'Abonelik alındı.');
      setFlag(true);
      navigation.navigate("Home");
    } catch (error) {
      console.error('Abonelik oluşturulurken bir hata oluştu:', error);
      console.log('Hata Detayları:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      Alert.alert(
        'Hata',
        `Sunucuya bağlanırken bir sorun oluştu. Detay: ${error.message || 'Bilinmeyen hata'}`
      );
    }
  };
  
  
  return (
    <LinearGradient
      colors={['#4A00E0', '#8E2DE2']}
      style={[styles.container]}
    >
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { fontFamily: fonts.regular }]}>
          {data.title}
        </Text>

        <Text style={[styles.text, { fontFamily: fonts.light }]}>
          Açıklama:
        </Text>
        {Array.isArray(data.PlanContent) ? (
          data.PlanContent.map((content, index) => (
            <Text key={index} style={[styles.text, { fontFamily: fonts.light }]}>
              - {content}
            </Text>
          ))
        ) : (
          <Text style={[styles.text, { fontFamily: fonts.light }]}>
            {data.PlanContent}
          </Text>
        )}

        <Text style={[styles.text, { fontFamily: fonts.bold }]}>
          Fiyat: {data.price} TL
        </Text>

        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={[styles.buttonText, { fontFamily: fonts.bold }]}>
            Abonelik Al
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    width: width * 0.9,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#EEE',
    marginBottom: 10,
  },
  paymentButton: {
    marginTop: 20,
    backgroundColor: '#4A00E0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
  },
});
