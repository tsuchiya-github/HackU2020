import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Container, Header } from "native-base";

export default class AppCalendar extends Component {
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "red" }}>
          <Text style={styles.font}>Todo</Text>
        </Header>

        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Account");
            }}
          >
            <Text style={styles.button}>Button</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "hsla(40, 90%, 50%, 0.2)",
  },
  font: {
    fontSize: 30,
    fontFamily: "arial",
    margin: 15,
  },
  button: {
    fontSize: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
  },
});
