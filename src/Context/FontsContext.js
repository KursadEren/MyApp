import React, {createContext, useEffect, useState} from 'react';

// Fontların global olarak kullanılacağı Context
export const FontsContext = createContext();

// FontsProvider: Fontları yükleyen ve sağlayan component
export const FontsProvider = ({children}) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Font isimleri
  const fonts = {
    regular: 'BlenderPro-Thin', // Font ismi dosya adı olmadan
    bold: 'BlenderPro-Bold',
  };
  const fontsSize = {
    Bold: 24,
    Text: 20,
  };

  // Fontları yüklüyoruz
  useEffect(() => {
    // React Native CLI'da manuel yükleme gerekmiyor, fontsLoaded'ı true yapalım
    setFontsLoaded(true);
  }, []);

  return (
    <FontsContext.Provider value={{fontsSize, fonts, fontsLoaded}}>
      {children}
    </FontsContext.Provider>
  );
};
