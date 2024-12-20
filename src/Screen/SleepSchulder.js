// SleepScheduler.js

import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import notifee, { AndroidImportance, TimestampTrigger, TriggerType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore'; // Ensure you have installed and set up react-native-firebase
import { notificationsData } from './notificationsData'; // Import your notifications data

const SleepScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  const scheduleAllNotifications = async () => {
    setLoading(true);
    try {
      // 1. Fetch current user ID
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        Alert.alert('Error', 'User not authenticated.');
        setLoading(false);
        return;
      }
      const userId = currentUser.uid;

      // 2. Fetch user subscriptions from Firestore
      const userDoc = await firestore().collection('users').doc(userId).get();
      const userData = userDoc.data();

      if (!userData || !userData.subscription) {
        Alert.alert('Error', 'No subscription data found.');
        setLoading(false);
        return;
      }

      const activeSubscriptions = userData.subscription.filter(sub => sub.is_active);

      if (activeSubscriptions.length === 0) {
        Alert.alert('No Active Subscriptions', 'User has no active subscriptions.');
        setLoading(false);
        return;
      }

      // 3. Create notification channel
      await createNotificationChannel();

      // 4. Schedule daily 7:00 AM wake-up notification
      await scheduleDailyWakeUpNotification(7, 0); // 7:00 AM

      // 5. For each active subscription, schedule sleep and wake-up notifications
      let allScheduled = [];

      for (const sub of activeSubscriptions) {
        const monthKey = sub.subscription_duration; // 6,7,8,9,11,12
        const planData = notificationsData[monthKey];

        if (!planData) {
          console.warn(`No notification data for month: ${monthKey}`);
          continue; // Skip if no data for this subscription duration
        }

        // Base time is today at 7:00 AM
        const baseWakeTime = new Date();
        baseWakeTime.setHours(7, 0, 0, 0); // 7:00 AM today

        // If current time is past 7:00 AM, decide whether to schedule for today or next day
        const now = new Date();
        if (baseWakeTime <= now) {
          // Optionally, you can adjust to next day if you prefer
          // baseWakeTime.setDate(baseWakeTime.getDate() + 1);
          // For this example, we'll schedule relative to today
        }

        // Initialize current time pointer
        let currentTime = new Date(baseWakeTime);

        for (let i = 0; i < planData.intervals.length; i++) {
          const interval = planData.intervals[i];
          currentTime = addMinutes(currentTime, interval.delayInMinutes);

          // Schedule notification
          const notification = await scheduleNotificationAtTime(
            interval.title,
            interval.body,
            currentTime
          );
          if (notification) allScheduled.push(notification);

          // If this is a wake-up notification, no further action needed
          if (interval.title.toLowerCase().includes('uyandırma zamanı') || interval.title.toLowerCase().includes('uyanma zamanı')) {
            continue;
          }

          // After sleep notification, schedule wake-up notification 2 hours later
          let wakeTimeAfterSleep = addMinutes(currentTime, 120); // 2 hours later

          // Special rule for 6th month: Ensure second wake-up is before 11:00 AM
          if (planData.month === 6) {
            // Determine if this is the second wake-up notification
            // Since wake-up notifications are after sleep notifications, count how many wake-ups have been scheduled
            const wakeUpCount = allScheduled.filter(n => n.title.toLowerCase().includes('uyanma zamanı')).length;

            if (wakeUpCount === 2) { // Second wake-up
              const elevenAM = new Date(currentTime);
              elevenAM.setHours(11, 0, 0, 0); // 11:00 AM

              if (wakeTimeAfterSleep > elevenAM) {
                // Adjust to 10:59 AM
                wakeTimeAfterSleep = new Date(currentTime);
                wakeTimeAfterSleep.setHours(10, 59, 0, 0);
              }
            }
          }

          // Determine body text based on the preceding sleep notification
          let wakeBody = '';
          switch (interval.title) {
            case '1. Uyku':
              wakeBody = '1. uyku bitti.';
              break;
            case '2. Uyku':
              wakeBody = '2. uyku bitti.';
              break;
            case 'Şekerleme':
              wakeBody = 'Şekerleme bitti.';
              break;
            case 'Akşam Uykusu':
              wakeBody = 'Akşam uykusu bitti.';
              break;
            default:
              wakeBody = 'Uyanma zamanı geldi.';
          }

          // Schedule wake-up notification
          const wakeNotification = await scheduleNotificationAtTime(
            'Uyandırma Zamanı',
            wakeBody,
            wakeTimeAfterSleep
          );
          if (wakeNotification) allScheduled.push(wakeNotification);

          // Update currentTime to wakeTimeAfterSleep for next iteration
          currentTime = new Date(wakeTimeAfterSleep);
        }
      }

      // Update state to display scheduled notifications
      setScheduledNotifications(allScheduled);

      Alert.alert('Başarılı', 'Tüm bildirimler planlandı.');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      Alert.alert('Hata', 'Bildirimler planlanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get current user
  const getCurrentUser = async () => {
    // Implement your authentication logic here
    // For example, using Firebase Auth:
    // return firebase.auth().currentUser;
    // Placeholder:
    return { uid: 'exampleUserId' }; // Replace with actual user ID retrieval
  };

  // Helper function to create notification channel
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'daily_notification_channel',
      name: 'Günlük Bildirimler',
      importance: AndroidImportance.HIGH,
    });
  };

  // Helper function to schedule a notification at a specific time
  const scheduleNotificationAtTime = async (title, body, date) => {
    // Ensure the scheduled time is in the future
    const now = new Date();
    if (date <= now) {
      console.warn('Planlanan zaman geçmişte:', date);
      return null;
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    const notification = {
      title,
      body,
      android: {
        channelId: 'daily_notification_channel',
        importance: AndroidImportance.HIGH,
      },
    };

    const notificationId = await notifee.createTriggerNotification(
      notification,
      trigger
    );

    return {
      id: notificationId,
      title,
      body,
      scheduledTime: date.toLocaleString(),
    };
  };

  // Helper function to schedule daily wake-up notification
  const scheduleDailyWakeUpNotification = async (hour, minute) => {
    const now = new Date();
    let firstOccurrence = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (firstOccurrence <= now) {
      firstOccurrence.setDate(firstOccurrence.getDate() + 1);
    }

    // Schedule the wake-up notification
    const wakeNotification = await scheduleNotificationAtTime(
      'Günaydın!',
      'Saat 7:00, uyanma zamanı.',
      firstOccurrence
    );

    return wakeNotification;
  };

  // Utility function to add minutes to a date
  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  return (
    <View style={styles.container}>
      <Button
        title={loading ? 'Planlanıyor...' : 'Tüm Bildirimleri Planla'}
        onPress={scheduleAllNotifications}
        disabled={loading}
      />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>Planlanmış Bildirimler:</Text>
        {scheduledNotifications.map((notif, index) => (
          <View key={index} style={styles.notificationItem}>
            <Text style={styles.notificationTitle}>{notif.title}</Text>
            <Text>{notif.body}</Text>
            <Text style={styles.notificationTime}>{notif.scheduledTime}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  scrollView: {
    marginTop: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notificationTime: {
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default SleepScheduler;
