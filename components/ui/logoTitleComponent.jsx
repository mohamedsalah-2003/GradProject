import { StyleSheet, View, Animated, Text } from "react-native";


export function logoTitleComponent() {
    return (
        <View style={styles.content}>
            <Animated.Text style={styles.title}>Aegis</Animated.Text>
            <Animated.Text style={styles.subtitle}>IQ</Animated.Text>
        </View>
    );
}
const styles = StyleSheet.create({
      content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
      title: {
        marginTop: 20,
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        letterSpacing: 1,
    },
    subtitle: {
        marginTop: 20,
        fontSize: 32,
        fontWeight: "bold",
        color: "#46b50a",
        letterSpacing: 1,
    },
})

