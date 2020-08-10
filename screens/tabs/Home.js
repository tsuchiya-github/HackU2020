import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Container, Header, Icon } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";

const weekday = ["日", "月", "火", "水", "木", "金", "土"];

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        current: new Date().toLocaleString(), // 現時刻
        year: new Date().getFullYear(), // 年
        month: new Date().getMonth() + 1, // 月
        date: new Date().getDate(), // 日
        week: weekday[new Date().getDay()], // 曜日
        hours: new Date().getHours(), // 時
        minutes: ("0" + new Date().getMinutes()).slice(-2), //分
        seconds: new Date().getSeconds(), // 秒
      });
    }, 1000);
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "blue" }}>
          <Text style={styles.abovefont}>HOME</Text>
        </Header>
        <Grid>
          <Row size={10}>
            <View>
              <Text style={styles.belowfont}>
                {this.state.year}年{this.state.month}月{this.state.date}日 (
                {this.state.week}) {this.state.hours}:{this.state.minutes}
              </Text>
            </View>
          </Row>

          <Row size={70}>
            <View style={styles.abovecontainer}>
              <Icon
                type="FontAwesome"
                name="twitter"
                style={{ fontSize: 300, color: "black" }}
              />

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AppCalendar");
                }}
              >
                <Text style={styles.button}>Button</Text>
              </TouchableOpacity>
            </View>
          </Row>
          <Row size={20}>
            <View style={styles.belowcontainer}>
              <Text style={styles.belowfont}>〇〇しよう!クリアで2pt</Text>
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
    backgroundColor: "hsla(210, 90%, 50%, 0.2)",
  },
  belowcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "hsla(255, 90%, 50%, 0.2)",
  },
  abovefont: {
    fontSize: 30,
    fontFamily: "arial",
    margin: 15,
    color: "white",
  },
  belowfont: {
    fontSize: 30,
    fontFamily: "arial",
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
  },
});
