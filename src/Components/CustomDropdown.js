import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

const CustomDropdown = ({ data, placeholder, onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item);
    setVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setVisible(true)}>
        <Text style={styles.selectedText}>
          {selectedItem ? selectedItem.label : placeholder || 'Seçiniz'}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleSelect(item)}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function App() {
  const [selectedGender, setSelectedGender] = useState(null);

  const genderOptions = [
    { label: 'Erkek', value: 'male' },
    { label: 'Kız', value: 'female' },
    { label: 'Diğer', value: 'other' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cinsiyet Seçiniz:</Text>
      <CustomDropdown
        data={genderOptions}
        placeholder="Cinsiyet Seçiniz"
        onSelect={(item) => setSelectedGender(item.value)}
      />
      <Text style={styles.resultText}>Seçilen Cinsiyet: {selectedGender || '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  dropdownContainer: {
    width: '90%',
  },
  dropdownHeader: {
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 3,
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 5,
    paddingVertical: 10,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
  },
});
