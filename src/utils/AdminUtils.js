import firestore from "@react-native-firebase/firestore"

// Admin UID'sini alma fonksiyonu
export const fetchAdminUID = async () => {
  try {
    const settingsRef = doc(firestore, 'settings', 'adminUID');
    const settingsDoc = await getDoc(settingsRef);
    if (settingsDoc.exists()) {
      return settingsDoc.data().uid;
    } else {
      console.error('Admin UID bulunamadı.');
      throw new Error('Admin UID bulunamadı.');
    }
  } catch (error) {
    console.error('Admin UID alınırken hata:', error);
    throw error;
  }
};
