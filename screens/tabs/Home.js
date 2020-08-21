import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { Container, Header, Icon, Fab, Button } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Modal from "react-native-modal";

var x = "2"; //LV用

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      modalTrigger: false,
    };
  }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "blue" }}>
          <Grid>
            <Col size={40}>
              {/* cognitoのユーザ名を表示させる */}
              <Text style={styles.abovefont}>tsuchiya</Text>
            </Col>
            <Col size={20}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backcolor: "white",
                }}
              >
                <Icon
                  style={{ fontSize: 50 }}
                  type="FontAwesome"
                  name="user-circle"
                />
              </View>
            </Col>
            <Col size={20}></Col>
            {/* 追加 (hibi)    heder右上     */}
            <Col size={20}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  backcolor: "white",
                }}
              >
                <Text style={styles.abovefont}>Lv.{x}</Text>
              </View>
            </Col>
            {/* 追加 (hibi)          */}
          </Grid>
        </Header>

        <Grid>
          <Row size={80}>
            <View style={styles.abovecontainer}>
              {/* bg (Viewの中で有効) */}
              <ImageBackground
                source={{
                  uri:
                    "https://hacku2020s3bucket144145-dev.s3-ap-northeast-1.amazonaws.com/hibi-test/bg-sample.jpeg",
                }}
                style={{ width: "100%", height: "100%" }}
              >
                <Fab
                  active={this.state.active}
                  direction="right"
                  containerStyle={{}}
                  style={{ backgroundColor: "#5067FF" }}
                  position="topLeft"
                  onPress={() => this.setState({ active: !this.state.active })}
                >
                  <Icon type="FontAwesome" name="list" />
                  <Button
                    style={{ backgroundColor: "#34A34F" }}
                    onPress={() => this.setState({ modalTrigger: true })}
                  >
                    {/* モーダル */}
                    <Modal
                      isVisible={this.state.modalTrigger}
                      swipeDirection={["up", "down", "left", "right"]}
                      onSwipeComplete={() =>
                        this.setState({ modalTrigger: false })
                      }
                      backdropOpacity={0.5}
                      animationInTiming={700}
                      animationOutTiming={700}
                      animationIn="zoomIn"
                      animationOut="zoomOut"
                    >
                      <View style={styles.modalView}>
                        {/* バー */}
                        <View style={styles.bar}></View>
                        {/* 閉じるボタン */}
                        <TouchableOpacity
                          style={styles.modalButton}
                          onPress={() => this.setState({ modalTrigger: false })}
                        >
                          <Text style={styles.font}>
                            棒グラフで現在のランク分布を表示させるモーダル
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Modal>
                    <Icon type="FontAwesome" name="trophy" />
                  </Button>
                  <Button style={{ backgroundColor: "#3B5998" }}>
                    <Icon name="logo-facebook" />
                  </Button>
                  <Button disabled style={{ backgroundColor: "#DD5144" }}>
                    <Icon name="mail" />
                  </Button>
                </Fab>

                {/* <Icon
                type="FontAwesome"
                name="twitter"
                style={{ fontSize: 300, color: "black" }}
              /> */}

                <Image
                  //source={{ uri: 'https://hacku2020s3bucket144145-dev.s3-ap-northeast-1.amazonaws.com/hibi-test/mio'+x+'.jpeg' }}
                  // キャラクター
                  source={{
                    uri:
                      "https://hacku2020s3bucket144145-dev.s3-ap-northeast-1.amazonaws.com/hibi-test/smple.gif",
                  }}
                  style={{ width: 170, height: 158 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("AppCalendar");
                  }}
                >
                  <Text style={styles.button}>Let's Add Todo</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </Row>
          <Row size={20}>
            <View style={styles.belowcontainer}>
              <Text style={styles.belowfont}>aaaaaa</Text>
            </View>
          </Row>
        </Grid>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  abovecontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "hsla(210, 90%, 50%, 0.2)",
    backgroundColor: "white",
  },
  belowcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "hsla(255, 90%, 50%, 0.2)",
  },
  abovefont: {
    fontSize: 20,
    fontFamily: "Baskerville-Bold",
    margin: 15,
    color: "white",
  },
  belowfont: {
    fontSize: 30,
    fontFamily: "Baskerville-Bold",
    margin: 15,
    color: "black",
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
  modalView: {
    backgroundColor: "hsl(0, 0%, 97%)",
    width: "80%",
    height: 200,
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  bar: {
    height: 7,
    borderRadius: 20,
    alignSelf: "center",
    backgroundColor: "lightgray",
    width: 50,
    marginTop: 5,
    position: "absolute",
    top: 10,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
