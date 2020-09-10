import React, { useEffect, useState, Component } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Container,
  Header,
  Button,
  Content,
  Input,
  Text,
  Item,
  Card,
  CardItem,
  Left,
  Body,
  Right,
  Icon,
  Fab,
  DatePicker,
  Toast,
} from "native-base";
import Swipeout from "react-native-swipeout";
import { Auth } from "aws-amplify";

import { API, graphqlOperation } from "aws-amplify";
import {
  createTodo,
  deleteTodo,
  updateTodo,
  updateInfo,
  deleteInfo,
  createInfo,
} from "./../../src/graphql/mutations";
import {
  listTodos,
  showlistTodos,
  listCounts,
  archiveCounts,
  ListInfo,
} from "./../../src/graphql/queries";

const initialState = {
  name: "",
  description: "",
  completed: false,
  archive: false,
  cognitoID: "",
}; //createするデータの初期値

const timeState = {
  current: new Date().toLocaleString(), // 現時刻
  year: new Date().getFullYear(), // 年
  month: new Date().getMonth() + 1, // 月
  date: new Date().getDate(), // 日
  hours: new Date().getHours(), // 時
  minutes: new Date().getMinutes(), // 分
  seconds: new Date().getSeconds(), // 秒
};

const App = () => {
  // Hook(stateなどのReactの機能をクラスを書かずに使えるようになる)
  const [formState, setFormState] = useState(initialState); //formに関する宣言
  const [todos, setTodos] = useState([]); //dynamoからfetchするデータに関する宣言
  const [total, setTotal] = useState(null); //dynamoからcountするデータに関する宣言
  const [archive, setArchive] = useState(null); //dynamoからcountするデータに関する宣言
  var [time, setTimes] = useState([]);
  var [totaltime, setTotalTime] = useState(0);
  var [lv, setUpdateInfo] = useState(1);

  var EXPTABLE = [0, 150, 400, 650, 1500, 2100, 2800, 3600]; //lv.1,2,3,4,5,6,7,8

  ///////現在時刻取得系//////
  const [now, setNow] = useState(timeState);
  const [nows, setNows] = useState([]);

  useEffect(
    function () {
      const intervalId = setInterval(function () {
        // now.current = new Date().toLocaleString(); // 現時刻
        now.year = new Date().getFullYear(); // 年
        now.month = ("0" + (new Date().getMonth() + 1)).slice(-2); // 月
        now.date = new Date().getDate(); // 日
        // now.week = weekday[new Date().getDay()]; // 曜日
        now.hours = new Date().getHours(); // 時
        now.minutes = ("0" + new Date().getMinutes()).slice(-2); // 分
        // now.seconds = new Date().getSeconds(); // 秒

        const hoge = { ...now };
        setNows([...nows, hoge]);
        setNow(timeState);
      }, 1000);
      return function () {
        clearInterval(intervalId);
      };
    },
    [now]
  );
  ///////////

  // コンポーネントをレンダリングする際に外部サーバからAPIを経由してデータを取得したり
  // コンポーネントが更新する度に別の処理を実行することができる
  useEffect(() => {
    fetchTodos(); //コンポーネントが更新する度にdynamoからデータを取得する
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  // データを取得する非同期関数
  async function fetchTodos() {
    //画面表示系
    try {
      var result = await Auth.currentUserInfo();
      result = JSON.stringify(result);
      result = JSON.parse(result);

      const todoData = await API.graphql(graphqlOperation(showlistTodos));
      var todos = todoData.data.listTodos.items;
      todos = todos.filter((data) => {
        return data.cognitoID === result.id;
      });

      todos.sort(function (a, b) {
        return (
          new Date(a.name.substr(0, 16)).getTime() -
          new Date(b.name.substr(0, 16)).getTime()
        );
      });
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos", err);
    }

    // アーカイブ数取得系
    try {
      const countArchives = await API.graphql(graphqlOperation(archiveCounts));
      var countA = countArchives.data.listTodos.items;
      countA = countA.filter((data) => {
        return data.cognitoID === result.id;
      });
      const archive = Object.keys(countA).length;

      setArchive(archive);
    } catch (err) {
      console.log("error fetching archive", err);
    }

    // タスククリア時間とDone取得系;
    try {
      const countTodos = await API.graphql(graphqlOperation(listCounts));
      var countD = countTodos.data.listTodos.items;
      countD = countD.filter((data) => {
        return data.cognitoID === result.id;
      });
      const total = Object.keys(countD).length;

      setTotal(total);
      //時間差分取得ここから
      setTimes((time = []));

      if (total != 0) {
        countD.map((todo, index) => {
          const start_hour = parseInt(todo.name.substr(11, 2)) * 60;
          const start_second = parseInt(todo.name.substr(14, 2));
          const end_hour = parseInt(todo.name.substr(17, 2)) * 60;
          const end_second = parseInt(todo.name.substr(20, 2));
          var times = end_hour + end_second - (start_hour + start_second);
          time.push(times);
        });
        setTimes(time);
        // console.log(time);
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        totaltime = time.reduce(reducer);
        console.log(totaltime);
        setTotalTime(totaltime);
      }

      //8/25追加(Lv取得後Infoテーブルupdate処理)
      if (EXPTABLE[0] <= totaltime && totaltime < EXPTABLE[1]) {
        if (lv > 1) {
          setUpdateInfo(lv);
          // Alert.alert("Downgrade Lv.1");
        }
      } else if (EXPTABLE[1] <= totaltime && totaltime < EXPTABLE[2]) {
        if (lv < 2) {
          lv = 2;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.2");
        } else if (lv > 2) {
          lv = 2;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.2");
        }
      } else if (EXPTABLE[2] <= totaltime && totaltime < EXPTABLE[3]) {
        if (lv < 3) {
          lv = 3;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.3");
        } else if (lv > 3) {
          lv = 3;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.3");
        }
      } else if (EXPTABLE[3] <= totaltime && totaltime < EXPTABLE[4]) {
        if (lv < 4) {
          lv = 4;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.4");
        } else if (lv > 4) {
          lv = 4;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.4");
        }
      } else if (EXPTABLE[4] <= totaltime && totaltime < EXPTABLE[5]) {
        if (lv < 5) {
          lv = 5;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.2");
        } else if (lv > 5) {
          lv = 5;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.5");
        }
      } else if (EXPTABLE[5] <= totaltime && totaltime < EXPTABLE[6]) {
        if (lv < 6) {
          lv = 6;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.6");
        } else if (lv > 6) {
          lv = 6;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.6");
        }
      } else if (EXPTABLE[6] <= totaltime && totaltime < EXPTABLE[7]) {
        if (lv < 7) {
          lv = 7;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.2");
        } else if (lv > 7) {
          lv = 7;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.7");
        }
      } else {
        if (lv < 8) {
          lv = 8;
          setUpdateInfo(lv);
          Alert.alert("Upgrade Lv.8");
        } else if (lv > 2) {
          lv = 2;
          setUpdateInfo(lv);
          Alert.alert("Downgrade Lv.8");
        }
      }

      await API.graphql(
        graphqlOperation(updateInfo, {
          input: {
            cognitoID: String(result.id),
            lv: lv,
          },
        })
      );

      console.log("updateInfo called!");

      //ここまで
    } catch (err) {
      console.log("error time", err);
    }
  }

  // データを追加する非同期関数
  async function addTodo() {
    try {
      result = await Auth.currentUserInfo();
      result = JSON.stringify(result);
      result = JSON.parse(result);
      formState.cognitoID = result.id;

      const todo = { ...formState };
      // console.log(todo);
      setTodos([...todos, todo]);
      setFormState(initialState);

      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      fetchTodos();
    } catch (err) {
      "error creating todo:", err;
    }
  }

  // データを削除する非同期関数
  async function removeTodo(removeId) {
    try {
      // idを取得し，await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));を実行したい
      await API.graphql(
        graphqlOperation(deleteTodo, {
          input: { id: removeId },
        })
      );
      fetchTodos();
      console.log("removeTodo called!", removeId);
    } catch (err) {
      console.log("error delete:", err);
    }
  }

  // データ に打ち消し線(タスククリア処理)をつける非同期関数
  async function doneTodo(Comp, Id) {
    try {
      // idを取得し，await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));を実行したい
      await API.graphql(
        graphqlOperation(updateTodo, {
          input: {
            id: Id,
            completed: Comp === false ? true : false,
          },
        })
      );
      fetchTodos();
    } catch (err) {
      console.log("error doneTodo:", err);
    }
  }

  // データをアーカイブする非同期関数
  async function archiveTodo(Id) {
    try {
      // idを取得し，await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));を実行したい
      await API.graphql(
        graphqlOperation(updateTodo, {
          input: {
            id: Id,
            archive: true,
          },
        })
      );
      fetchTodos();
    } catch (err) {
      console.log("error archive:", err);
    }
  }

  // レンダリング
  return (
    <Container style={{ padding: 10 }}>
      {/* DatePickerで日時指定させる場合 */}
      {/* <Item>
        <DatePicker
          defaultDate={new Date()}
          locale={"ja"}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={true}
          animationType={"fade"}
          androidMode={"default"}
          placeHolderText="年月日"
          textStyle={{ color: "green" }}
          placeHolderTextStyle={{ color: "#d3d3d3" }}
          onDateChange={(val) => setInput("name", val.toString().substr(4, 12))}
          disabled={false}
          value={formState.name}
        />
      </Item> */}

      {/* 日時指定を文字入力させる場合 */}
      <Item>
        <Input
          onChangeText={(val) => setInput("name", val)}
          value={formState.name}
          placeholder="MMMM/DD/YY HH:MM-HH:MM"
          placeholderTextColor="#d3d3d3"
        />
      </Item>
      <Item>
        <Input
          onChangeText={(val) => setInput("description", val)}
          value={formState.description}
          placeholder="内容"
          placeholderTextColor="#d3d3d3"
        />
      </Item>
      <Content style={{ padding: 10, backgroundColor: "lightgreen" }}>
        {todos.map((todo, index) => (
          <Card key={todo.id ? todo.id : index}>
            <Swipeout
              right={[
                {
                  // text: "delete",
                  // text: todo.completed === false ? "delete" : "archive",
                  component: (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="archive"
                        style={{ color: "white" }}
                      />
                      <Text style={{ color: "white" }}>
                        {todo.completed === false ? "delete" : "archive"}
                      </Text>
                    </View>
                  ),
                  onPress: () =>
                    todo.completed === false
                      ? removeTodo(todo.id)
                      : archiveTodo(todo.id),
                  // backgroundColor: "red",
                  backgroundColor: todo.completed === true ? "orange" : "red",
                },
              ]}
              autoClose={true} //勝手に閉じる
              left={[
                {
                  // text: todo.completed === true ? "undo" : "done",
                  component: (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon
                        type="FontAwesome"
                        name="check"
                        style={{ color: "white" }}
                      />
                      <Text style={{ color: "white" }}>
                        {todo.completed === true ? "undo" : "done"}
                      </Text>
                    </View>
                  ),
                  onPress: () => doneTodo(todo.completed, todo.id),
                  backgroundColor:
                    todo.completed === true ? "royalblue" : "blue",
                },
              ]}
            >
              <CardItem
                header
                style={{
                  backgroundColor:
                    todo.completed === true ? "#b3b3b3" : "white",
                }}
              >
                <Body>
                  <Text style={styles.todoName}>
                    {todo.description}&nbsp;
                    {(() => {
                      if (
                        todo.name.substr(0, 4) === String(now.year) &&
                        todo.name.substr(5, 2) === String(now.month) &&
                        todo.name.substr(8, 2) === String(now.date)
                      ) {
                        const flag =
                          (parseInt(todo.name.substr(11, 2)) - now.hours) * 60 +
                          parseInt(todo.name.substr(14, 2)) -
                          now.minutes;
                        if (flag <= 360 && flag >= 0) {
                          return (
                            <Text style={{ color: "red", fontFamily: "arial" }}>
                              {(parseInt(todo.name.substr(11, 2)) - now.hours) *
                                60 +
                                parseInt(todo.name.substr(14, 2)) -
                                now.minutes}
                              分後
                            </Text>
                          );
                        }
                        return false;
                      }
                    })()}
                  </Text>
                  <Text>{todo.name} &nbsp;</Text>
                </Body>
              </CardItem>
            </Swipeout>
          </Card>
        ))}
      </Content>
      <Fab
        style={{ backgroundColor: "#5067FF" }}
        position="bottomRight"
        onPress={addTodo}
      >
        <Icon type="FontAwesome" name="plus" />
      </Fab>
      <Text>Doneした数:{total}</Text>
      <Text>Archiveした数:{archive}</Text>
    </Container>
  );
};

export default class AppCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "green" }}>
          <Text style={styles.font}>Todo</Text>
        </Header>
        <App />
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
  todo: { marginBottom: 15, backgroundColor: "pink" },
  input: { height: 50, backgroundColor: "#ddd", marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 },
  font: {
    fontSize: 30,
    fontFamily: "Baskerville-Bold",
  },
  button: {
    fontSize: 30,
    padding: 5,
    borderRadius: 10,
    overflow: "hidden",
    fontFamily: "Baskerville-Bold",
  },
});
