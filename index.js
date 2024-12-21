import { AppRegistry } from 'react-native';
import notifee, { EventType, TriggerType } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { notificationsData } from './natifications'; // Doğru yol olduğundan emin olun

import App from './App';
import { name as appName } from './app.json';


// notificationHandler.js

// Arka plan bildirim olaylarını işleyen fonksiyon
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Arka plan bildirim etkinliği:', type);

  switch (type) {
    case EventType.ACTION_PRESS:
      console.log('Kullanıcı bildirimi tıkladı:', detail.notification);

      // Bildirimle ilişkili abonelik süresini al
      const { subscriptionDuration } = detail.notification.data || {};

      if (subscriptionDuration) {
        // Mevcut bildirimin ardından gelen bildirimi planla
        await scheduleNextNotification(subscriptionDuration);
      }
      break;

    case EventType.DISMISSED:
      console.log('Bildirim kapatıldı:', detail.notification);
      break;

    default:
      console.log('Başka bir olay gerçekleşti:', type);
  }
});

// Bir sonraki bildirimi planlamak için yardımcı fonksiyon
const scheduleNextNotification = async (duration) => {
  try {
    const indexKey = `notificationIndex_${duration}`;
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
  } catch (error) {
    console.error('Bir sonraki bildirim planlanırken hata oluştu:', error);
  }
};


AppRegistry.registerComponent(appName, () => App);


