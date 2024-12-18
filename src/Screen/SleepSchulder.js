// SleepScheduler.js

import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from "react-native";
import notifee, { AndroidImportance, TriggerType, EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notificationsData } from "../../natifications"; // Doğru yolu kontrol edin

import { UserContext } from "../Context/UserContext";

const SleepScheduler = () => {
  const { user } = useContext(UserContext); // UserContext'ten user verisini al
  const [notificationLog, setNotificationLog] = useState([]); // Bildirim logları
  const nextNotificationIndex = useRef(0); // Hangi bildirimin gönderileceğini takip eder
  const [subscriptionDuration, setSubscriptionDuration] = useState(null); // Kullanıcı abonelik süresi
  const isMounted = useRef(true); // Mounted flag

  // Bileşen unmount olduğunda flag'i güncelle
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Bildirim izni ve kanal oluşturma
  const setupNotifications = async () => {
    try {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus !== 1) {
        console.warn("Bildirim izni verilmedi!");
        if (isMounted.current) {
          Alert.alert("Uyarı", "Bildirim izinlerini etkinleştirmeniz gerekmektedir.");
        }
        return;
      }

      await notifee.createChannel({
        id: "sleep_channel",
        name: "Uyku Planı Bildirimleri",
        importance: AndroidImportance.HIGH,
      });
      console.log("Bildirim kanalı oluşturuldu.");
    } catch (error) {
      console.error("Bildirim izinlerini ayarlarken hata:", error);
    }
  };

  // Kullanıcının en son aktif aboneliğini bulma
  const getLatestActiveSubscription = (subscriptions) => {
    if (!subscriptions || subscriptions.length === 0) {
      return null;
    }

    // Aktif abonelikleri filtrele
    const activeSubscriptions = subscriptions.filter(sub => sub.is_active === true);

    if (activeSubscriptions.length === 0) {
      return null;
    }

    // En son aboneliği seç (subscription_start'a göre sıralama)
    activeSubscriptions.sort((a, b) => b.subscription_start.toMillis() - a.subscription_start.toMillis());
    return activeSubscriptions[0];
  };

  // Kullanıcının abonelik verilerini işleme ve state'e set etme
  const processSubscriptionData = () => {
    if (!user || !user.subscriptions || user.subscriptions.length === 0) {
      if (isMounted.current) {
        Alert.alert("Bilgi", "Aktif bir aboneliğiniz bulunmamaktadır.");
      }
      return;
    }

    const latestActiveSubscription = getLatestActiveSubscription(user.subscriptions);

    if (latestActiveSubscription) {
      setSubscriptionDuration(latestActiveSubscription.subscription_duration);
      console.log("En son aktif abonelik süresi:", latestActiveSubscription.subscription_duration);
    } else {
      if (isMounted.current) {
        Alert.alert("Bilgi", "Aktif bir aboneliğiniz bulunmamaktadır.");
      }
      console.log("Aktif abonelik bulunamadı.");
    }
  };

  // AsyncStorage'dan ilerlemeyi yükle
  const loadProgress = async () => {
    try {
      const progress = await AsyncStorage.getItem("notification_progress");
      const logs = await AsyncStorage.getItem("notification_logs");

      if (progress !== null) nextNotificationIndex.current = parseInt(progress, 10);
      if (logs) setNotificationLog(JSON.parse(logs));

      console.log("Progress yüklendi:", nextNotificationIndex.current);
      const currentMonthData = getCurrentMonthData();
      if (currentMonthData && nextNotificationIndex.current < currentMonthData.intervals.length) {
        scheduleNextNotification(currentMonthData.intervals[nextNotificationIndex.current].delayInMinutes);
      }
    } catch (error) {
      console.error("Progress yüklenirken hata:", error);
    }
  };

  // AsyncStorage'ı temizle
  const clearStorage = async () => {
    try {
      await AsyncStorage.removeItem("notification_progress");
      await AsyncStorage.removeItem("notification_logs");
      console.log("AsyncStorage temizlendi.");
      setNotificationLog([]);
      nextNotificationIndex.current = 0;
    } catch (error) {
      console.error("AsyncStorage temizlenirken hata:", error);
    }
  };

  // Şu anki aboneliğin bildirim verisini al
  const getCurrentMonthData = () => {
    return notificationsData[subscriptionDuration] || notificationsData[6]; // Abonelik süresine göre veya varsayılan 6. ay
  };

  // Bildirimi tetikleme ve kaydetme
  const scheduleNextNotification = async (delayInMinutes) => {
    if (!subscriptionDuration) {
      console.warn("Abonelik süresi belirlenmedi.");
      return;
    }

    try {
      const currentMonthData = getCurrentMonthData();
      if (!currentMonthData) {
        console.warn("Geçerli ayın bildirim verisi bulunamadı.");
        return;
      }

      const currentInterval = currentMonthData.intervals[nextNotificationIndex.current];
      if (!currentInterval) {
        console.warn("Geçerli aboneliğin tüm bildirimleri tamamlandı.");
        return;
      }

      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: Date.now() + delayInMinutes * 60 * 1000, // Gelecek zamanı hesaplar
      };

      await notifee.createTriggerNotification(
        {
          title: currentInterval.title,
          body: currentInterval.body,
          android: {
            channelId: "sleep_channel",
            importance: AndroidImportance.HIGH,
          },
        },
        trigger
      );

      console.log(`${currentInterval.title} zamanlandı.`);
      const newLog = [
        ...notificationLog,
        `${currentInterval.title} zamanlandı.`,
      ];
      setNotificationLog(newLog);
      nextNotificationIndex.current += 1;
      await AsyncStorage.setItem("notification_progress", nextNotificationIndex.current.toString());
      await AsyncStorage.setItem("notification_logs", JSON.stringify(newLog));
    } catch (error) {
      console.error("Bildirim zamanlanırken hata:", error);
    }
  };

  // Bildirim tıklama olayını dinleme
  const onForegroundEvent = ({ type, detail }) => {
    if (type === EventType.PRESS) {
      const { notification } = detail;
      console.log("Bildirim tıklandı:", notification);

      // Bir sonraki bildirimi zamanla
      const currentMonthData = getCurrentMonthData();
      if (currentMonthData && nextNotificationIndex.current < currentMonthData.intervals.length) {
        scheduleNextNotification(currentMonthData.intervals[nextNotificationIndex.current].delayInMinutes);
      } else {
        if (isMounted.current) {
          Alert.alert("Bilgi", "Günün tüm bildirimleri tamamlandı.");
        }
      }
    }
  };

  // Başlatma fonksiyonu
  const handleNotificationClick = () => {
    if (!subscriptionDuration) {
      Alert.alert("Hata", "Abonelik süresi belirlenmedi.");
      return;
    }

    if (nextNotificationIndex.current >= getCurrentMonthData().intervals.length) {
      Alert.alert("Bilgi", "Günün tüm bildirimleri zaten tamamlandı.");
      return;
    }
    scheduleNextNotification(getCurrentMonthData().intervals[nextNotificationIndex.current].delayInMinutes);
  };

  // Kullanıcı eski bildirimlerini görüntüleyebilir
  const viewNotificationHistory = () => {
    Alert.alert("Bildirim Logları", notificationLog.join("\n"));
  };

  // Uygulama ilk çalıştığında kanal oluştur, abonelik verisini çek ve ilerlemeyi yükle
  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
      processSubscriptionData();
    };

    initialize();

    // Abonelik verisi çekildikten sonra ilerlemeyi yükle
    if (subscriptionDuration) {
      loadProgress();
    }
  }, [subscriptionDuration, user]);

  // Foreground event listener ekle
  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(onForegroundEvent);
    return () => {
      unsubscribe();
    };
  }, [notificationLog, subscriptionDuration]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uyku Aralıkları</Text>
      <Text style={styles.subtitle}>Abonelik Süresi: {subscriptionDuration || "Yükleniyor..."}</Text>
      <Button
        title="Bildirimleri Başlat"
        onPress={handleNotificationClick}
        disabled={!subscriptionDuration}
      />

      <View style={{ marginTop: 10 }}>
        <Button
          title="AsyncStorage Temizle"
          color="red"
          onPress={clearStorage}
        />
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Bildirim Geçmişini Görüntüle"
          onPress={viewNotificationHistory}
        />
      </View>

      <Text style={styles.logTitle}>Bildirim Logları:</Text>
      {notificationLog.map((log, index) => (
        <TouchableOpacity key={index}>
          <Text style={styles.logText}>{log}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { marginBottom: 10, fontSize: 24, fontWeight: 'bold' },
  subtitle: { marginBottom: 20, fontSize: 18 },
  logTitle: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  logText: { color: "blue", marginTop: 5 },
});

export default SleepScheduler;
