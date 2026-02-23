import React from "react";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
export function LogoComponent() {

    return (<Image
        source={require("./../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
    />
    )
}
const styles = StyleSheet.create({
    logo: {
        width: 180,
        height: 180,
    },
})