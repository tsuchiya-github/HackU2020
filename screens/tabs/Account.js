import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Container, Header, Thumbnail } from "native-base";
// import { TextInput } from "react-native-paper";
import { Auth } from "aws-amplify";
// import { listPosts } from "./../../src/graphql/queries";
// import Amplify from "aws-amplify";

// Amplify.configure({
//   Auth: {
//     // REQUIRED - Amazon Cognito Identity Pool ID
//     identityPoolId: "ap-northeast-1:4a662227-265d-4b15-8573-7ca2629687fd",
//     // REQUIRED - Amazon Cognito Region
//     region: "ap-northeast-1",
//     // OPTIONAL - Amazon Cognito User Pool ID
//     userPoolId: "ap-northeast-1_od59uSDaH",
//     // OPTIONAL - Amazon Cognito Web Client ID
//     userPoolWebClientId: "2atme8u1ko30pttptd4lai12uu",
//     oauth: {},
//   },
//   Analytics: {
//     disabled: true,
//   },
// });

const signOut = () => {
  Auth.signOut().catch((error) => console.log("サインアウト失敗: ", error));
};

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: "",
    };
  }
  async componentDidMount() {
    const userinfo = await Auth.currentUserInfo()
      .then((result) => {
        // 処理結果が返却されるので、あとは好きな処理をする
        var username = JSON.stringify(result);
        username = JSON.parse(username);
        this.setState({
          auth: username.username,
        });
      })
      .catch((err) => {
        // エラーハンドリングする
        console.error(err);
      });
    // };
  }

  render() {
    return <Text>{this.state.auth}</Text>;
  }
}

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state初期化
      count: 0,
    };
  }

  // stateの状態変更処理 必ずsetState()で行う！
  countUp = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    const thumbnail_uri =
      "https://facebook.github.io/react-native/docs/assets/favicon.png";

    return (
      <Container>
        <Header style={{ backgroundColor: "green" }}>
          <Text style={styles.font}>MyPage</Text>
        </Header>
        <View style={styles.container}>
          <Thumbnail large source={{ uri: thumbnail_uri }} />
          <TouchableOpacity style={styles.button} onPress={this.countUp}>
            <Text>ボタン</Text>
          </TouchableOpacity>
          {/* stateのcountを表示 */}
          <Text>Count : {this.state.count}</Text>

          <TouchableOpacity
            onPress={() => {
              signOut();
            }}
          >
            <Text style={styles.button}>サインアウト</Text>
          </TouchableOpacity>
        </View>
        <User />
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
    fontFamily: "Baskerville-Bold",
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
    fontFamily: "Baskerville-Bold",
  },
});
