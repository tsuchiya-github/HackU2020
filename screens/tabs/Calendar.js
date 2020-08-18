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
} from "native-base";
import Swipeout from "react-native-swipeout";

import { API, graphqlOperation } from "aws-amplify";
import { createTodo, deleteTodo } from "./../../src/graphql/mutations";
import { listTodos } from "./../../src/graphql/queries";
import { Col, Row, Grid } from "react-native-easy-grid";

const initialState = { name: "", description: "" }; //createするデータの初期値
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

  // データに打ち消し線(タスククリア処理)をつける非同期関数
  async function doneTodo() {
    Alert.alert("doneTodo called!");
  }

  // レンダリング
  return (
    <Container style={{ padding: 10 }}>
      <Item>
        <Input
          onChangeText={(val) => setInput("name", val)}
          style={styles.input}
          value={formState.name}
          placeholder="時間"
        />
      </Item>
      <Item>
        <Input
          onChangeText={(val) => setInput("description", val)}
          style={styles.input}
          value={formState.description}
          placeholder="内容"
        />
      </Item>
      <Content style={{ padding: 10, backgroundColor: "grey" }}>
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
              left={[
                {
                  text: "done",
                  onPress: () => doneTodo(),
                  backgroundColor: "blue",
                },
              ]}
            >
              <CardItem itemHeader first>
                <Body>
                  <Text style={styles.todoName}>{todo.name}</Text>
                  <Text>{todo.description}</Text>
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
  // input: { height: 50, backgroundColor: "#ddd", marginBottom: 10, padding: 8 },
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
