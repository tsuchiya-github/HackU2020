import React, { useEffect, useState, Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Container, Header, Button, Content } from "native-base";

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
  const [remove, setDelete] = useState([]); //dynamoからdeleteするデータに関する宣言

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
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  // データを削除する非同期関数
  async function removeTodo(a) {
    // idを取得し，await API.graphql(graphqlOperation(deleteTodo, { input: { id: todoId }}));を実行したい
    //const remove = { ...deleteState };
    const remove = a;
    console.log("removeTodo called!", remove);
  }

  // レンダリング
  return (
    <View>
      <TextInput
        onChangeText={(val) => setInput("name", val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={(val) => setInput("description", val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button large danger style={styles.button} onPress={addTodo}>
        <Text style={styles.font}>Create Todo</Text>
      </Button>

      {todos.map((todo, index) => (
        <View key={todo.id ? todo.id : index} style={styles.todo}>
          <Grid>
            <Col size={10}>
              <Button>
                <Text>done</Text>
              </Button>
            </Col>
            <Col size={80}>
              <Text style={styles.todoName}>{todo.name}</Text>
              <Text>
                {todo.description}, {todo.id}
              </Text>
            </Col>
            <Col size={10}>
              <Button onPress={() => removeTodo(todo.id)}>
                <Text>delete</Text>
              </Button>
            </Col>
          </Grid>
        </View>
      ))}
    </View>
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
        <Content style={styles.container}>
          <App />
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

//export default App;
