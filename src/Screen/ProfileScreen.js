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
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { UserContext } from '../Context/UserContext';
import { BackgroundContext } from '../Context/BackGround';
import MyTextInput from '../Components/MyTextInput';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { Background } = useContext(BackgroundContext);
  const { user, setUser } = useContext(UserContext);

  // İlk çocuk bilgilerini state'e yükle
  const initialChild = user?.child?.length > 0 ? user.child[0] : {};
  const [child, setChild] = useState({
    name: initialChild?.name || '',
    gender: initialChild?.gender || '',
    birthDate: initialChild?.birthDate ? new Date(initialChild.birthDate) : null,
    estimatedBirthDate: initialChild?.estimatedBirthDate
      ? new Date(initialChild.estimatedBirthDate)
      : null,
  });

  const [isBirthDatePickerVisible, setBirthDatePickerVisibility] = useState(false);
  const [isEstimatedDatePickerVisible, setEstimatedDatePickerVisibility] = useState(false);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const handleSave = () => {
    const updatedUser = {
      ...user,
      child: [
        {
          ...child,
          birthDate: child.birthDate ? child.birthDate.toISOString().split('T')[0] : '',
          estimatedBirthDate: child.estimatedBirthDate
            ? child.estimatedBirthDate.toISOString().split('T')[0]
            : '',
        },
      ],
    };
    setUser(updatedUser);
    console.log('Güncellenen Kullanıcı:', updatedUser);
  };

  const formatDate = (date) => {
    if (!date) return 'Tarih Seçiniz';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <ImageBackground source={Background.primary} style={styles.background}>
      <LinearGradient colors={['#fce6ff', '#c2b6ff']} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.profileImageContainer}>
            <Image
              source={user?.photoUrl ? { uri: user.photoUrl } : null}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.addPhotoButton}>
              <Text style={styles.addPhotoText}>Foto Ekle</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Bilgileriniz</Text>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Adınız</Text>
            <Text style={styles.infoText}>{user?.username || 'Adınız'}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>E-posta adresin</Text>
            <Text style={styles.infoText}>{user?.email || 'email@ornek.com'}</Text>
          </View>

          <Text style={styles.sectionTitle}>Bebeğin Bilgileri</Text>
          <View style={styles.infoCard}>
            <MyTextInput
              placeholder="Bebeğinizin Adı"
              value={child.name}
              onChangeText={(text) => setChild({ ...child, name: text })}
            />
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Cinsiyet</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={child.gender}
                onValueChange={(itemValue) => setChild({ ...child, gender: itemValue })}
                style={styles.picker}>
                <Picker.Item label="Cinsiyet Seçiniz" value="" />
                <Picker.Item label="Kız" value="female" />
                <Picker.Item label="Erkek" value="male" />
                <Picker.Item label="Diğer" value="other" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setBirthDatePickerVisibility(true)}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <Text style={styles.dateText}>{formatDate(child.birthDate)}</Text>
          </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.datePickerContainer}
            onPress={() => setEstimatedDatePickerVisibility(true)}>
            <Text style={styles.label}>Tahmini Doğum Tarihi</Text>
            <Text style={styles.dateText}>{formatDate(child.estimatedBirthDate)}</Text>
          </TouchableOpacity>
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

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Kaydet</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
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
  addPhotoButton: {
    marginTop: 10,
    backgroundColor: '#D1C4E9',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  addPhotoText: {
    color: '#7E57C2',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
    marginVertical: 10,
  },
  infoCard: {
    width: width * 0.9,
    marginBottom: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B0082',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  datePickerContainer: {
    width: width * 0.9,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#7E57C2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});