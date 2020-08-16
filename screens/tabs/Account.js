import React, { Component } from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";
import { Container, Header, Thumbnail, Button, Icon } from "native-base";
import { Auth } from "aws-amplify";
import { Col, Row, Grid } from "react-native-easy-grid";

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
      username: "",
      email: "",
    };
  }
  async componentDidMount() {
    const userinfo = await Auth.currentUserInfo()
      .then((result) => {
        // 処理結果が返却されるので、あとは好きな処理をする
        var result = JSON.stringify(result);
        result = JSON.parse(result);
        console.log(result.username);
        var attributes = JSON.stringify(result.attributes);
        attributes = JSON.parse(attributes);
        console.log(attributes.email);

        this.setState({
          username: result.username,
          email: attributes.email,
        });
      })
      .catch((err) => {
        // エラーハンドリングする
        console.error(err);
      });
    // };
  }

  render() {
    return (
      <View>
        <Text style={{ fontSize: 30 }}> {this.state.username} </Text>
        <Text style={{ fontSize: 30 }}> {this.state.email} </Text>
      </View>
    );
  }
}

export default class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //state初期化
      // count: 0,
    };
  }

  // stateの状態変更処理 必ずsetState()で行う！
  // countUp = () => {
  //   this.setState({
  //     count: this.state.count + 1,
  //   });
  // };

  render() {
    const thumbnail_uri = "https://i.imgur.com/yUbYzGI.png";

    return (
      <Container>
        <Header style={{ backgroundColor: "green" }}>
          <Text style={styles.font}>MyPage</Text>
        </Header>
        <Grid>
          <View style={styles.container}>
            <Row size={10} />
            <Row size={30}>
              <Thumbnail
                style={{ height: 200, width: 200, borderRadius: 100 }}
                source={{ uri: thumbnail_uri }}
              />
            </Row>
            <Row size={60}>
              <Col size={10} />
              <Col size={80}>
                <User />
                <Button
                  large
                  danger
                  block
                  iconLeft
                  style={styles.button}
                  onPress={() => {
                    signOut();
                  }}
                >
                  <Text style={styles.font}>Sign Out</Text>
                  <Icon type="FontAwesome" name="sign-out" />
                </Button>
              </Col>
              <Col size={10}></Col>
            </Row>
          </View>
        </Grid>
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
  },
  button: {
    fontSize: 30,
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: "black",
    padding: 5,
    // backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    fontFamily: "Baskerville-Bold",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
