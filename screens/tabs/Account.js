import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Container, Header, List, ListItem } from "native-base";
import { TextInput } from "react-native-paper";

export default class Account extends Component {
  state = { count: 0 };

  // stateの状態変更処理 必ずsetState()で行う！
  countUp = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "green" }}>
          <Text style={styles.font}>Googleアカウント情報</Text>
        </Header>
        <View style={styles.container}>
          <Text style={styles.font}>Googleアカウント情報</Text>

          <TouchableOpacity style={styles.button} onPress={this.countUp}>
            <Text>ボタン</Text>
          </TouchableOpacity>
          {/* stateのcountを表示 */}
          <Text>Count : {this.state.count}</Text>

          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate("Home");
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
    backgroundColor: "hsla(150, 90%, 50%, 0.2)",
  },
  font: {
    fontSize: 30,
    fontFamily: "arial",
    margin: 10,
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

