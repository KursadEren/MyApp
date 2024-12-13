import firestore from "@react-native-firebase/firestore"

export const fetchAdminUID = async () => {
  try {
    const settingsRef = doc(firestore, 'settings', 'fJof16fQSh0A3AMp3k8r'); // Doğru Document ID
    const settingsDoc = await getDoc(settingsRef);

    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (data && data.adminUID) {
        return data.adminUID;
      } else {
        console.error('Admin UID alanı eksik veya hatalı.');
        throw new Error('Admin UID alanı eksik veya hatalı.');
      }
    } else {
      console.error('Belge bulunamadı.');
      throw new Error('Belge bulunamadı.');
    }
  } catch (error) {
    console.error('Admin UID alınırken hata:', error);
    throw error;
  }
};
