import React, { Component } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Home from "./screens/tabs/Home";
import AppCalendar from "./screens/tabs/Calendar";
import Account from "./screens/tabs/Account";
import { Icon } from "native-base";
import { withAuthenticator } from "aws-amplify-react-native";
import Amplify from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const Tab = createMaterialBottomTabNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRealApp: false,
      //To show the main page of the app
    };
  }
  _onDone = () => {
    this.setState({ showRealApp: true });
  };
  _onSkip = () => {
    this.setState({ showRealApp: true });
  };
  _renderItem = ({ item }) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
          alignItems: "center",
          justifyContent: "space-around",
          paddingBottom: 100,
        }}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Image style={styles.image} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          activeColor="white"
          inactiveColor="black"
          shifting={true}
        >
          {/* HomeScreen */}
          <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarLabel: "Home",
              tabBarIcon: ({ color }) => (
                <Icon
                  type="FontAwesome"
                  name="home"
                  style={{ color: "white" }}
                />
              ),
              tabBarColor: "hsla(210, 90%, 50%, 0.9)",
            }}
          />

          {/* SecondScreen */}
          <Tab.Screen
            name="AppCalendar"
            component={AppCalendar}
            options={{
              tabBarLabel: "Calendar",
              tabBarIcon: ({ color }) => (
                <Icon
                  type="FontAwesome"
                  name="calendar"
                  style={{ fontSize: 25, color: "white" }}
                />
              ),
              tabBarColor: "hsla(0, 90%, 50%, 0.7)",
            }}
          />

          {/* ThirdScreen */}
          <Tab.Screen
            name="Account"
            component={Account}
            options={{
              tabBarLabel: "Account",
              tabBarIcon: ({ color }) => (
                <Icon
                  type="FontAwesome"
                  name="user"
                  style={{ color: "white" }}
                />
              ),
              tabBarColor: "hsla(150, 90%, 40%, 0.7)",
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
    //初期画面
    return (
      <AppIntroSlider
        data={slides}
        renderItem={this._renderItem}
        onDone={this._onDone}
        showSkipButton={true}
        bottomButton={true}
        onSkip={this._onSkip}
      />
    );
  }
}
const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
});

export default withAuthenticator(App);
