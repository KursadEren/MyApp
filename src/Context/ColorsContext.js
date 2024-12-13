import React, {createContext, useState} from 'react';

// ColorsContext'i oluşturuyoruz
export const ColorsContext = createContext();

// ColorsProvider ile renkleri sağlayacağız
export const ColorsProvider = ({children}) => {
  const [colors, setColors] = useState({
    primary: '#8E2DE2', // Gradient başlangıç rengi
    secondary: '#4A00E0', // Gradient bitiş rengi
    accent: '#B2EBF2', // Vurgu rengi (ikonlar, özel bölümler için)
    backgroundLight: '#ffffff', // Açık arka plan
    backgroundMedium: '#f0f0f0', // Orta tonlu arka plan
    overlay: 'rgba(255, 255, 255, 0.1)', // Şeffaf katman
    textLight: '#FFF', // Açık metin rengi
    textDark: '#000', // Koyu metin rengi
  });

  return (
    <ColorsContext.Provider value={{colors, setColors}}>
      {children}
    </ColorsContext.Provider>
  );
};
