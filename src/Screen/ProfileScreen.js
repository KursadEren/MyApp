import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { UserContext } from '../Context/UserContext';
import { BackgroundContext } from '../Context/BackGround';
import { FontsContext } from '../Context/FontsContext';
import { ColorsContext } from '../Context/ColorsContext';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { Background } = useContext(BackgroundContext);
  const { user, updateUser } = useContext(UserContext); // setUser yerine updateUser
  const { colors } = useContext(ColorsContext);
  const { fonts } = useContext(FontsContext);

  // children array'inden ilk çocuğu alıyoruz, mevcutsa
  const initialChild = user?.children?.length > 0 ? user.children[0] : {};

  // child state'ini height ve weight ekleyerek güncelliyoruz
  const [child, setChild] = useState({
    name: initialChild?.name || '',
    gender: initialChild?.gender || '',
    birthDate: initialChild?.birthDate ? new Date(initialChild.birthDate) : null,
    estimatedBirthDate: initialChild?.estimatedBirthDate
      ? new Date(initialChild.estimatedBirthDate)
      : null,
    height: initialChild?.height ? String(initialChild.height) : '', // cm cinsinden
    weight: initialChild?.weight ? String(initialChild.weight) : '', // kg cinsinden
  });

  const [isBirthDatePickerVisible, setBirthDatePickerVisibility] = useState(false);
  const [isEstimatedDatePickerVisible, setEstimatedDatePickerVisibility] = useState(false);
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);

  useEffect(() => {
    console.log('Kullanıcı Verisi:', user);
  }, [user]);

  const handleSave = async () => {
    if (!child.name || !child.gender || !child.birthDate) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // Boy ve kilo doğrulaması
    if (
      child.height &&
      (isNaN(parseFloat(child.height)) ||
        parseFloat(child.height) <= 30 ||
        parseFloat(child.height) > 250)
    ) {
      Alert.alert('Hata', 'Lütfen geçerli bir boy giriniz (30-250 cm).');
      return;
    }

    if (
      child.weight &&
      (isNaN(parseFloat(child.weight)) ||
        parseFloat(child.weight) <= 0 ||
        parseFloat(child.weight) > 300)
    ) {
      Alert.alert('Hata', 'Lütfen geçerli bir kilo giriniz (1-300 kg).');
      return;
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      Alert.alert('Hata', 'Kullanıcı oturumu açık değil.');
      return;
    }
    const userid = currentUser.uid;

    const childData = {
      name: child.name,
      gender: child.gender,
      birthDate: child.birthDate ? child.birthDate.toISOString().split('T')[0] : '',
      estimatedBirthDate: child.estimatedBirthDate
        ? child.estimatedBirthDate.toISOString().split('T')[0]
        : '',
      height: child.height ? parseFloat(child.height) : null, // cm cinsinden
      weight: child.weight ? parseFloat(child.weight) : null, // kg cinsinden
    };

    try {
      if (user?.children?.length > 0) {
        // Mevcut çocuğu güncellemek için önce mevcut çocuğu array'den çıkarıyoruz
        await firestore()
          .collection('users')
          .doc(userid)
          .update({
            children: firestore.FieldValue.arrayRemove(initialChild),
          });

        // Daha sonra güncellenmiş çocuğu ekliyoruz
        await firestore()
          .collection('users')
          .doc(userid)
          .update({
            children: firestore.FieldValue.arrayUnion(childData),
          });

        Alert.alert(
          'Başarılı',
          'Çocuk bilgileri başarıyla güncellendi ve Firestore "children" arrayine eklendi.'
        );
      } else {
        // Çocuk yoksa yeni çocuğu ekliyoruz
        await firestore()
          .collection('users')
          .doc(userid)
          .update({
            children: firestore.FieldValue.arrayUnion(childData),
          });

        Alert.alert(
          'Başarılı',
          'Çocuk bilgileri başarıyla kaydedildi ve Firestore "children" arrayine eklendi.'
        );
      }

      // Firestore'dan güncellenmiş kullanıcı verisini çekmek için istekte bulunun
      const updatedUserDoc = await firestore().collection('users').doc(userid).get();
      if (updatedUserDoc.exists) {
        const updatedUser = updatedUserDoc.data();
        updateUser(updatedUser); // setUser yerine updateUser kullanıyoruz
        console.log('Güncellenmiş kullanıcı:', updatedUser);
      }

      // Formu temizleyin (isteğe bağlı)
      setChild({
        name: '',
        gender: '',
        birthDate: null,
        estimatedBirthDate: null,
        height: '',
        weight: '',
      });
    } catch (error) {
      console.error('Firestore güncelleme hatası: ', error);
      Alert.alert('Hata', 'Bilgiler kaydedilirken bir hata oluştu.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Tarih Seçiniz';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <ImageBackground source={Background.Home} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profil Resmi */}
        <View style={styles.profileImageContainer}>
          <Image
            source={user?.photoUrl ? { uri: user.photoUrl } : null}
            style={styles.profileImage}
          />
        </View>

        {/* Kullanıcı Bilgileri */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>Bilgileriniz</Text>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <Text style={[styles.label, { fontFamily: fonts.bold }]}>Adınız</Text>
            <Text style={[styles.infoText, { fontFamily: fonts.bold }]}>
              {user?.username || 'Adınız'}
            </Text>
          </View>
        </View>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <Text style={[styles.label, { fontFamily: fonts.bold }]}>E-posta adresin</Text>
            <Text style={[styles.infoText, { fontFamily: fonts.bold }]}>
              {user?.email || 'email@ornek.com'}
            </Text>
          </View>
        </View>

        {/* Çocuğun Bilgileri */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.bold }]}>Bebeğin Bilgileri</Text>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TextInput
              style={[styles.textInput, { fontFamily: fonts.bold }]}
              placeholder="Bebeğinizin Adı"
              value={child.name}
              onChangeText={(text) => setChild({ ...child, name: text })}
              placeholderTextColor={"#a990db"}
            />
          </View>
        </View>

        {/* Boy Alanı */}
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TextInput
              style={[styles.textInput, { fontFamily: fonts.bold }]}
              placeholder="Boyu (cm)"
              value={child.height}
              onChangeText={(text) => setChild({ ...child, height: text })}
              keyboardType="numeric"
              placeholderTextColor={"#a990db"}
            />
          </View>
        </View>

        {/* Kilo Alanı */}
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TextInput
              style={[styles.textInput, { fontFamily: fonts.bold }]}
              placeholder="Kilosu (kg)"
              value={child.weight}
              onChangeText={(text) => setChild({ ...child, weight: text })}
              keyboardType="numeric"
              placeholderTextColor={"#a990db"}
            />
          </View>
        </View>

        {/* Cinsiyet Seçimi */}
        <View style={styles.outerContainer}>
          <TouchableOpacity
            style={styles.innerContainer}
            onPress={() => setGenderPickerVisible(true)}>
            <Text style={[styles.label, { fontFamily: fonts.bold }]}>
              {child.gender || 'Cinsiyet Seçiniz'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cinsiyet Seçim Modalı */}
        <Modal
          transparent={true}
          visible={isGenderPickerVisible}
          animationType="slide">
          <TouchableWithoutFeedback onPress={() => setGenderPickerVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalContent2}>
                  {/* Erkek Seçeneği */}
                  <TouchableOpacity
                    style={styles.genderButton}
                    onPress={() => {
                      setChild({ ...child, gender: 'Erkek' });
                      setGenderPickerVisible(false);
                    }}>
                    <View
                      style={{
                        borderColor: '#e3e3e3',
                        backgroundColor: '#fff',
                        height: height * 0.07,
                        width: width * 0.33,
                        borderRadius: 30,
                        marginTop: 3,
                        marginRight: 1,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderWidth:1,
                        
                      }}>
                      <Text
                        style={[
                          styles.cancelText,
                          {
                            fontFamily: fonts.baby,
                            color: colors.login,
                            fontSize: 25,
                          },
                        ]}>
                        Erkek
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Kız Seçeneği */}
                  <TouchableOpacity
                    style={styles.genderButton}
                    onPress={() => {
                      setChild({ ...child, gender: 'Kız' });
                      setGenderPickerVisible(false);
                    }}>
                    <View
                      style={{
                        borderColor: '#e3e3e3',
                        backgroundColor: '#fff',
                        height: height * 0.07,
                        width: width * 0.33,
                        borderRadius: 30,
                        marginTop: 3,
                        marginRight: 1,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderWidth:1
                      }}>
                      <Text
                        style={[
                          styles.cancelText,
                          {
                            fontFamily: fonts.baby,
                            color: colors.login,
                            fontSize: 25,
                          },
                        ]}>
                        Kız
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Kapat Seçeneği */}
                  <TouchableOpacity
                    style={styles.genderButton}
                    onPress={() => setGenderPickerVisible(false)}>
                    <View
                      style={{
                        borderColor: '#e3e3e3',
                        backgroundColor: '#fff',
                        height: height * 0.07,
                        width: width * 0.33,
                        borderRadius: 30,
                        marginTop: 3,
                        marginRight: 1,
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        borderWidth:1
                      }}>
                      <Text
                        style={[
                          styles.cancelText,
                          {
                            fontFamily: fonts.baby,
                            color: colors.login,
                            fontSize: 25,
                          },
                        ]}>
                        Kapat
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Doğum Tarihi */}
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.datePickerContainer}
              onPress={() => setBirthDatePickerVisibility(true)}>
              <Text style={styles.label}>Doğum Tarihi</Text>
              <Text style={styles.dateText}>{formatDate(child.birthDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isBirthDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setBirthDatePickerVisibility(false);
            setChild({ ...child, birthDate: date });
          }}
          onCancel={() => setBirthDatePickerVisibility(false)}
          maximumDate={new Date()}
        />

        {/* Tahmini Doğum Tarihi */}
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.datePickerContainer}
              onPress={() => setEstimatedDatePickerVisibility(true)}>
              <Text style={styles.label}>Tahmini Doğum Tarihi</Text>
              <Text style={styles.dateText}>{formatDate(child.estimatedBirthDate)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={isEstimatedDatePickerVisible}
          mode="date"
          onConfirm={(date) => {
            setEstimatedDatePickerVisibility(false);
            setChild({ ...child, estimatedBirthDate: date });
          }}
          onCancel={() => setEstimatedDatePickerVisibility(false)}
          minimumDate={child.birthDate || undefined}
        />

        {/* Save Button - Tasarımı Değiştirilmedi */}
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: '#e3e3e3',
            backgroundColor: '#e3e3e3',
            height: height * 0.07,
            width: width * 0.33,
            borderRadius: 30,
            marginTop: 3,
            marginRight: 1,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
          onPress={handleSave}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e3e3e3',
              backgroundColor: 'white',
              height: height * 0.07,
              borderRadius: 30,
              width: width * 0.33,
              marginTop: 3,
              marginRight: 1,
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <Text
              style={[
                styles.cancelText,
                {
                  fontFamily: fonts.baby,
                  color: colors.login,
                  fontSize: 25,
                },
              ]}>
              Kaydet
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    flexGrow: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    backgroundColor: '#EDE7F6',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#4B0082',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#a990db',
    marginBottom: 5,
  },
  datePickerContainer: {},
  dateText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#e3e3e3',
    borderRadius: 30,
    height: height * 0.07,
    width: width * 0.3,
    marginBottom: width * 0.02,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonInner: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    backgroundColor: 'white',
    height: height * 0.07,
    borderRadius: 30,
    marginTop: 3,
    marginRight: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  saveButtonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  outerContainer: {
    width: width * 0.85,
    backgroundColor: '#e3e3e3',
    borderRadius: 30,
    marginVertical: height * 0.02,
  },
  innerContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 100,
    height: height * 0.07,
    justifyContent: 'center',
    paddingLeft: width * 0.05,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
  },
  genderButton: {
    borderColor: '#e3e3e3',
    backgroundColor: '#e3e3e3',
    height: height * 0.07,
    width: width * 0.33,
    borderRadius: 30,
    marginTop: 3,
    marginRight: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderWidth:1,
    marginBottom:10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#e3e3e3',
    height: height * 0.406,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: width*0.1,
    borderBottomLeftRadius: width*0.1,
  },
  modalContent2: {
    backgroundColor: 'white',
    width: '100%',
    height:'100%',
    justifyContent:"center",
    alignItems: 'center',
    borderTopRightRadius: width*0.1+5,
    borderBottomLeftRadius: width*0.1+5,
    marginTop:10,
    marginRight:8,
  },
  cancelText: {
    color: 'black',
    fontSize: 16,
  },
});
