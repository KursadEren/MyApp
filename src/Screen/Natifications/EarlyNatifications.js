import notifee, { AndroidImportance, RepeatFrequency, TriggerType } from '@notifee/react-native';

async function scheduleDailyMorningNotification() {
  // Şu anki zamanı al
  const now = new Date();

  // 06:20 olarak bir tarih nesnesi oluştur
  let scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 10, 0, 0);

  // Eğer şu anki saat 06:20'yi geçtiyse, bir sonraki gün 06:20’ye ayarla
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  // Android için kanal oluştur (eğer önceden oluşturmadıysanız)
  await notifee.createChannel({
    id: 'daily_morning_channel',
    name: 'Günlük Sabah Bildirimleri',
    importance: AndroidImportance.HIGH,
  });

  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: scheduledTime.getTime(),
    repeatFrequency: RepeatFrequency.DAILY, // Her gün tekrarla
    alarmManager: true, // Android’de daha kararlı tekrarlar için
  };

  // Bildirimi zamanla
  await notifee.createTriggerNotification(
    {
      title: 'Günaydın!',
      body: '06:20, uyanma zamanı!',
      android: {
        channelId: 'daily_morning_channel',
        importance: AndroidImportance.HIGH,
      },
    },
    trigger
  );

  console.log('Her gün 06:20 için bildirim ayarlandı.');
}

// Bu fonksiyonu uygulama ilk açıldığında bir kez çağırın.
// Bundan sonra uygulamayı kapatsanız bile her gün 06:20’de bildirim gelecektir.
