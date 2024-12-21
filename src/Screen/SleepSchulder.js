// SleepScheduler.js

import React, { useContext, useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import { notificationsData } from '../../natifications'; // Doğru yol olduğundan emin olun
import { UserContext } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SleepScheduler() {
  const { user } = useContext(UserContext);
  const [activeSubscriptions, setActiveSubscriptions] = useState([]);

  // Kullanıcının aktif aboneliklerini bulma
  const findUserSubscriptions = () => {
    if (user && user.subscriptions) {
      // Aktif abonelikleri filtrele
      const activeSubs = user.subscriptions.filter((sub) => sub.is_active === true);
      const subscriptionDurations = activeSubs.map((sub) => sub.subscription_duration);
      setActiveSubscriptions(subscriptionDurations);

      // Konsola yazdır
      console.log('Aktif Abonelikler:', subscriptionDurations);
    } else {
      console.warn('Kullanıcının abonelik bilgileri mevcut değil.');
    }
  };

  useEffect(() => {
    findUserSubscriptions();
  }, [user]);

  // Bildirim kanalını oluşturma fonksiyonu
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'default',
      name: 'Varsayılan Kanal',
      importance: AndroidImportance.HIGH,
    });
  };

  useEffect(() => {
    createNotificationChannel();
  }, []);

  // Bir sonraki bildirimi planlama fonksiyonu
  const scheduleNextNotification = async (duration) => {
    const indexKey = `notificationIndex_${duration}`;
    try {
      const currentIndexStr = await AsyncStorage.getItem(indexKey);
      let currentIndex = currentIndexStr ? parseInt(currentIndexStr, 10) : 0;

      const notificationsForDuration = notificationsData[duration]?.intervals;

      if (!notificationsForDuration) {
        console.warn(`Bildirim verisi bulunamadı: ${duration} ay`);
        return;
      }

      if (currentIndex >= notificationsForDuration.length) {
        console.log(`Tüm bildirimler planlandı: ${duration} ay`);
        return;
      }

      const notification = notificationsForDuration[currentIndex];
      const delayInMinutes = notification.delayInMinutes;
      const triggerTime = Date.now() + delayInMinutes * 60 * 1000;

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTime,
      };

      await notifee.createTriggerNotification(
        {
          title: notification.title,
          body: notification.body,
          data: { subscriptionDuration: duration }, // Bildirimle ilişkili veri
          android: {
            channelId: 'default',
            smallIcon: 'ic_launcher', // Bildirim simgesini özelleştirin
          },
        },
        trigger
      );

      console.log(`Bildirim zamanlandı: ${notification.title} - ${new Date(triggerTime).toLocaleString()}`);

      // Bildirim indeksini güncelle
      currentIndex += 1;
      await AsyncStorage.setItem(indexKey, currentIndex.toString());

      console.log(`Sonraki bildirim planlandı: ${currentIndex} - ${duration} ay`);
      Alert.alert('Başarılı', `${notification.title} bildirim zamanlandı.`);
    } catch (error) {
      console.error('Bildirim planlanırken hata oluştu:', error);
      Alert.alert('Hata', `${notification.title} bildirimi planlanırken bir hata oluştu.`);
    }
  };

  // Butona tıklanınca aktif abonelikler için sıradaki bildirimi planla
  const handleScheduleNextNotifications = async () => {
    if (activeSubscriptions.length === 0) {
      Alert.alert('Bilgi', 'Aktif bir abonelik bulunmamaktadır.');
      return;
    }

    activeSubscriptions.forEach(async (duration) => {
      await scheduleNextNotification(duration);
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Schedule Next Notification" onPress={handleScheduleNextNotifications} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SleepScheduler;
