import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const MyTextInput = ({ placeholder, value, onChangeText, secureTextEntry }) => {
  return (
    <View style={styles.outerContainer}>
      {/* İç gölge efekti için gradient */}
      <LinearGradient
        colors={["#e3e3e3","#f8f8f8", "#fff"]} // Gradient tonları iç gölgeyi simüle eder
        style={styles.innerContainer}
        start={{ x: 1, y: 0.1 }}
        end={{ x: 1, y: 0.7 }}
      >
        <View style={styles.innerShadow}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={placeholder.toLowerCase().includes("password") ? secureTextEntry : false}
            placeholderTextColor="#B0C4CC"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: width * 0.8,
    height: height * 0.075,
    alignSelf: "center",
    borderRadius: 25,
    backgroundColor: "#e3e3e3",
    overflow: "hidden", // Taşan içeriği gizler
    marginVertical: height * 0.01,
  },
  innerContainer: {
    flex: 1,
    borderRadius: 25,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
   
  },
  innerShadow: {
    flex: 1,
    borderRadius: 25,
    marginTop: height*0.01, // İç gölge için boşluk
    backgroundColor: "#FFFFFF",
    width: width * 0.85,
    marginRight:width*0.1,
    left:0,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: "transparent",
    color: "#3E3E3E", // Yazı rengi
  },
});

export default MyTextInput;
