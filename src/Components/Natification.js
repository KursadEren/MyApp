import React from 'react';
import { Button, View, StyleSheet, Alert } from 'react-native';
import notifee, { TriggerType } from '@notifee/react-native';

async function scheduleNotification() {
  try {
    // 20 saniye sonrasını hesapla
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: Date.now() + 2 * 60 * 60 * 1000, // Şu andan itibaren 20 saniye sonrası
    };

    // Zamanlanmış bildirimi oluştur
    await notifee.createTriggerNotification(
      {
        title: 'Zamanlanmış Bildirim',
        body: 'Bu bildirim 20 saniye sonra gönderildi!',
        android: {
          channelId: 'default', // Daha önce oluşturulmuş bir kanal
          smallIcon: 'ic_launcher', // Bildirim simgesi
        },
      },
      trigger
    );

    Alert.alert('Başarılı', '20 saniye sonra bildirim gönderilecek!');
  } catch (error) {
    console.error('Bildirim zamanlanamadı:', error);
  }
}

function NotificationButton() {
  return (
    <View style={styles.container}>
      <Button title="Bildirim Gönder" onPress={scheduleNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationButton;
