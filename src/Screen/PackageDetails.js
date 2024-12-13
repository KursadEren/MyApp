import React, { useState, useContext,useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, ScrollView, Dimensions, StatusBar, Alert } from 'react-native';
import { SubscriptionsContext } from '../Context/SubsCriptionsContext';
import MyTextInput from '../Components/MyTextInput';
import { ColorsContext } from '../Context/ColorsContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PackageDetails({ route, navigation }) {
    const { package: selectedPackage } = route.params; // Seçilen paketi alıyoruz
    const { subscriptions, setSubscriptions, removeFromSubscriptions } = useContext(SubscriptionsContext);
    const { colors } = useContext(ColorsContext);
    const [editedPackage, setEditedPackage] = useState({
        subs_id: selectedPackage.subs_id,
        packet_name: selectedPackage.packet_name,
        description: selectedPackage.description,
        subscription_duration: selectedPackage.subscription_duration,
        price: selectedPackage.price,
        image: selectedPackage.image,
    });
    useEffect(() => {
        console.log('Abonelikler güncellendi:', subscriptions);
    }, [subscriptions]);
    
    const [isEditing, setIsEditing] = useState(false); // Düzenleme modunu kontrol eder

    // Değişiklikleri kaydetmek için bir fonksiyon
    const handleSave = () => {
        const updatedSubscriptions = subscriptions.map((sub) =>
            sub.subs_id === editedPackage.subs_id ? editedPackage : sub
        );
        setSubscriptions(updatedSubscriptions); // Context'teki veriyi güncelle
        setIsEditing(false); // Düzenleme modundan çık
    };

    // Silme işlemi
    const handleDelete = () => {
        Alert.alert(
            'Silme İşlemi',
            'Bu paketi silmek istediğinizden emin misiniz?',
            [
                { text: 'Hayır', style: 'cancel' },
                {
                    text: 'Evet',
                    onPress: () => {
                        removeFromSubscriptions(selectedPackage.subs_id); // Context'teki silme fonksiyonunu çağır
                        navigation.goBack(); // Silme işleminden sonra bir önceki ekrana dön
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Görsel */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/img/5.jpeg')} // Örnek resim
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>

                {/* Başlık */}
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>{editedPackage.packet_name}</Text>
                </View>

                {/* Detaylar */}
                <View style={styles.content}>
                    {!isEditing ? (
                        <View style={styles.detailsContainer}>
                            <Text style={styles.label}>Paket Adı:</Text>
                            <Text style={styles.value}>{editedPackage.packet_name}</Text>

                            <Text style={styles.label}>Açıklama:</Text>
                            <Text style={styles.value}>{editedPackage.description}</Text>

                            <Text style={styles.label}>Süre (Ay):</Text>
                            <Text style={styles.value}>{editedPackage.subscription_duration}</Text>

                            <Text style={styles.label}>Fiyat:</Text>
                            <Text style={styles.value}>{editedPackage.price} ₺</Text>

                            <Text style={styles.label}>Resim URL:</Text>
                            <Text style={styles.value}>{editedPackage.image || 'Belirtilmemiş'}</Text>
                        </View>
                    ) : (
                        <View style={styles.editContainer}>
                            <MyTextInput
                                placeholder="Paket Adı"
                                value={editedPackage.packet_name}
                                onChangeText={(text) =>
                                    setEditedPackage((prev) => ({ ...prev, packet_name: text }))
                                }
                                iconName="cube-outline"
                            />

                            <MyTextInput
                                placeholder="Açıklama"
                                value={editedPackage.description}
                                onChangeText={(text) =>
                                    setEditedPackage((prev) => ({ ...prev, description: text }))
                                }
                                iconName="text-outline"
                            />

                            <MyTextInput
                                placeholder="Süre (Ay)"
                                value={String(editedPackage.subscription_duration)}
                                onChangeText={(text) =>
                                    setEditedPackage((prev) => ({
                                        ...prev,
                                        subscription_duration: parseInt(text, 10) || 0,
                                    }))
                                }
                                iconName="time-outline"
                            />

                            <MyTextInput
                                placeholder="Fiyat"
                                value={String(editedPackage.price)}
                                onChangeText={(text) =>
                                    setEditedPackage((prev) => ({
                                        ...prev,
                                        price: parseFloat(text) || 0,
                                    }))
                                }
                                iconName="pricetag-outline"
                            />

                            <MyTextInput
                                placeholder="Resim URL"
                                value={editedPackage.image}
                                onChangeText={(text) =>
                                    setEditedPackage((prev) => ({ ...prev, image: text }))
                                }
                                iconName="image-outline"
                            />
                        </View>
                    )}

                    {/* Düzenle/Kaydet Butonları */}
                    {!isEditing ? (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => setIsEditing(true)}
                        >
                            <Text style={styles.actionButtonText}>Düzenle</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.actionButtonText}>Kaydet</Text>
                        </TouchableOpacity>
                    )}

                    {/* Sil Butonu */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Text style={styles.actionButtonText}>Sil</Text>
                    </TouchableOpacity>

                    {/* Geri Dön Butonu */}
                    <TouchableOpacity
                        style={[styles.actionButton, styles.backButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonText}>Geri Dön</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0, // Android'de StatusBar'ı dikkate alır
    },
    imageContainer: {
        width: '100%',
        height: 400,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    headerContainer: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 15,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    content: {
        paddingHorizontal: 20,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#FFF',
        marginBottom: 15,
        paddingLeft: 10,
    },
    editContainer: {
        marginBottom: 20,
    },
    actionButton: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    editButton: {
        backgroundColor: '#FFC107',
    },
    saveButton: {
        backgroundColor: '#28a745',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    backButton: {
        backgroundColor: '#007BFF',
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
