// Context/TransactionContext.js

import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TransactionContext = createContext();

export const TransactionProvider = ({children}) => {
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [Active, setActive] = useState(false);

  const saveSubscriptionInfo = async info => {
    try {
      await AsyncStorage.setItem('subscriptionInfo', JSON.stringify(info));
      setSubscriptionInfo(info);
    } catch (error) {
      console.error("Veriyi AsyncStorage'e kaydederken hata oluştu:", error);
    }
  };

  useEffect(() => {
    const loadSubscriptionInfo = async () => {
      try {
        const savedInfo = await AsyncStorage.getItem('subscriptionInfo');
        if (savedInfo) {
          setSubscriptionInfo(JSON.parse(savedInfo));
        }
      } catch (error) {
        console.error("AsyncStorage'den veriyi yüklerken hata oluştu:", error);
      }
    };
    loadSubscriptionInfo();
  }, []);

  return (
    <TransactionContext.Provider
      value={{subscriptionInfo, saveSubscriptionInfo}}>
      {children}
    </TransactionContext.Provider>
  );
};
