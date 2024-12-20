const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.checkSubscriptions = functions.pubsub
    .schedule("30 3 * * *") // Gece 03:30
    .timeZone("Europe/Istanbul") // Zaman dilimini ayarla
    .onRun(async (context) => {
      try {
        const db = admin.firestore();

        // Yerel tarih (Istanbul zaman dilimi)
        const today = new Date();
        const options = {
          timeZone: "Europe/Istanbul",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        };
        const localDate = new Date(
            new Intl.DateTimeFormat("en-US", options).format(today),
        );
        localDate.setHours(0, 0, 0, 0); // Bugün saat 00:00

        console.log("Bugünün tarihi (Istanbul TZ):", localDate);

        const usersSnapshot = await db.collection("users").get();

        const batch = db.batch(); // Batch işlemi başlat

        for (const userDoc of usersSnapshot.docs) {
          const userData = userDoc.data();

          if (userData.subscriptions && Array.isArray(userData.subscriptions)) {
            const updatedSubscriptions = userData.subscriptions.map(
                (subscription) => {
                  if (
                    subscription.subscription_end &&
                new Date(subscription.subscription_end.toDate()) < localDate
                  ) {
                    // Abonelik sonlanmışsa is_active'i false yap
                    return {...subscription, is_active: false};
                  }
                  return subscription;
                },
            );

            const userRef = db.collection("users").doc(userDoc.id);
            batch.update(userRef, {subscriptions: updatedSubscriptions});
          }
        }

        await batch.commit(); // Tüm işlemleri toplu olarak gerçekleştir

        console.log("Tüm abonelikler kontrol edildi.");
      } catch (error) {
        console.error("Abonelik kontrolü sırasında hata oluştu:", error);
      }
    });
