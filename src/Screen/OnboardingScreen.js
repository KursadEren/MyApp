import React, { useContext } from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"
import { ColorsContext } from "../Context/ColorsContext";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const { colors } = useContext(ColorsContext);

  const handleNext = () => {
    navigation.replace("login");
  };

  return (
    <View style={styles.container}>
      {/* Görsel */}
      <ImageBackground
        source={require("../assets/img/Hosgeldiniz.jpg")}
        style={styles.image}
      >
        {/* Devam Butonu */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >

          <Icon name="chevron-right" size={width * 0.06} color="#FFF" />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end", // Buton görüntünün alt kısmında yer alacak
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 50, // Alt boşluk
    alignSelf: "center", // Ortada yer alacak
  },
  buttonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "bold",
    marginRight: 10, // Yazı ile ikon arasında boşluk
  },
});

export default OnboardingScreen;
