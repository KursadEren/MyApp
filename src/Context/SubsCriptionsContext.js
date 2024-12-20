import React, { createContext, useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export const SubscriptionsContext = createContext();

// Firestore'dan abonelik verilerini çekme fonksiyonu
export const fetchSubscriptions = async () => {
  try {
    const subscriptionsSnapshot = await firestore().collection('subscriptions').get();
    console.log('Toplam abonelik sayısı: ', subscriptionsSnapshot.size);

    // Firestore'dan gelen verileri bir diziye dönüştürün
    const subscriptions = subscriptionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return subscriptions;
  } catch (error) {
    console.error('Abonelik planlarını alırken bir hata oluştu:', error);
    return [];
  }
};

export default function SubscriptionsProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([]);

  // Abonelik listesine sadece yerel ekleme yapacak bir fonksiyon
  const addToSubscriptions = (newSubscription) => {
    setSubscriptions((prev) => [...prev, newSubscription]); // Yeni aboneliği mevcut listeye ekler
  };

  const removeFromSubscriptions = (subscriptionId) => {
    setSubscriptions((prev) =>
      prev.filter((sub) => sub.subs_id !== subscriptionId) // ID'ye göre filtreleme
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSubscriptions(); // Firestore'dan verileri çek
      setSubscriptions(data);
    };

    fetchData();
  }, []);

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        fetchSubscriptions,
        addToSubscriptions,
        removeFromSubscriptions, // Ekleme fonksiyonunu sağlayıcıya ekliyoruz
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
}
