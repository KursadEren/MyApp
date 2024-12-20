import { AppRegistry } from 'react-native';
import notifee, { EventType, TriggerType, AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from './App';
import { name as appName } from './app.json';

// Arka plan olay handler'ını tanımlayın
notifee.onBackgroundEvent(async ({ type, detail }) => {
  if (type === EventType.PRESS) {
    const { notification } = detail;
    console.log('Arka planda bildirime tıklandı:', notification);

    try {
      // İlerlemeyi AsyncStorage'dan yükle
      const progress = await AsyncStorage.getItem('notification_progress');
      let nextIndex = progress ? parseInt(progress, 10) : 0;

      const schedule = [2, 5, 8]; // Bildirim süreleri (saniye cinsinden)

      if (nextIndex < schedule.length) {
        const delayInSeconds = schedule[nextIndex];
        const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: Date.now() + delayInSeconds * 1000, // Gelecek zamanı hesaplar
        };

        await notifee.createTriggerNotification(
          {
            title: `Bildirim ${nextIndex + 1}`,
            body: `${nextIndex + 1}. Uyku zamanı geldi.`,
            android: {
              channelId: 'sleep_channel',
              importance: AndroidImportance.HIGH,
            },
          },
          trigger
        );

        console.log(`Bildirim ${nextIndex + 1} zamanlandı (arka planda).`);

        // Logları güncelle
        const logs = await AsyncStorage.getItem('notification_logs');
        const currentLogs = logs ? JSON.parse(logs) : [];
        const newLog = [...currentLogs, `Bildirim ${nextIndex + 1} zamanlandı (arka planda).`];
        await AsyncStorage.setItem('notification_logs', JSON.stringify(newLog));

        // İlerlemeyi güncelle
        nextIndex += 1;
        await AsyncStorage.setItem('notification_progress', nextIndex.toString());
      }
    } catch (error) {
      console.error('Arka planda bildirime tıklandığında hata:', error);
    }
  }
});


AppRegistry.registerComponent(appName, () => App);


