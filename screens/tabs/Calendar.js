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
} from "native-base";
import Swipeout from "react-native-swipeout";

import { API, graphqlOperation } from "aws-amplify";
import {
  createTodo,
  deleteTodo,
  updateTodo,
} from "./../../src/graphql/mutations";
import { listTodos } from "./../../src/graphql/queries";

const initialState = { name: "", description: "", completed: false }; //createするデータの初期値
const deleteState = { id: "" }; //deleteするデータのidの初期値

const App = () => {
  // Hook(stateなどのReactの機能をクラスを書かずに使えるようになる)
  const [formState, setFormState] = useState(initialState); //formに関する宣言
  const [todos, setTodos] = useState([]); //dynamoからfetchするデータに関する宣言
  const [remove, setDelete] = useState(deleteState); //dynamoからdeleteするデータに関する宣言

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
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos", err);
    }
  }

  // データを追加する非同期関数
  async function addTodo() {
    try {
      const todo = { ...formState };
      console.log(todo);
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      fetchTodos();
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  // データを削除する非同期関数
  async function removeTodo(removeId) {
    try {
      // idを取得し，await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));を実行したい
      await API.graphql(
        graphqlOperation(deleteTodo, { input: { id: removeId } })
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
        //graphqlOperation(updateTodo, { input: { id: Id , completed: ((completed===false)? true : false)}})
        graphqlOperation(updateTodo, {
          input: { id: Id, completed: Comp === false ? true : false },
        })
      );
      fetchTodos();
      console.log("DoneTodo called!", Id);
    } catch (err) {
      console.log("error delete:", err);
    }
    Alert.alert("Conglatulations!");
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
          placeholder="時間"
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
                  text: "delete",
                  onPress: () => removeTodo(todo.id),
                  backgroundColor: "red",
                },
              ]}
              autoClose={true} //勝手に閉じる
              left={[
                {
                  text: todo.completed === true ? "undo" : "done",
                  onPress: () => doneTodo(todo.completed, todo.id),
                  backgroundColor: "blue",
                },
              ]}
            >
              <CardItem
                header
                style={{
                  backgroundColor: todo.completed === true ? "yellow" : "white",
                }}
              >
                <Body>
                  <Text style={styles.todoName}>{todo.description}</Text>
                  <Text>
                    {todo.name},{String(todo.completed)}
                  </Text>
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
