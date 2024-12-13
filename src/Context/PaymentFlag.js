import React, {createContext, useState} from 'react';

// Context oluşturma
export const PaymentFlagContext = createContext();

export const PaymentFlagProvider = ({children}) => {
  const [flag, setFlag] = useState(false);

  // Bayrağı değiştiren bir fonksiyon tanımlayın
  const toggleFlag = () => {
    setFlag(prev => !prev);
  };

  return (
    <PaymentFlagContext.Provider value={{flag, setFlag, toggleFlag}}>
      {children}
    </PaymentFlagContext.Provider>
  );
};
