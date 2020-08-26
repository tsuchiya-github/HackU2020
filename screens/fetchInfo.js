async function fetchInfos() {
  try {
    // Infoテーブル参照(auth, username, lv, type取得)
    var result = await Auth.currentUserInfo();
    result = JSON.stringify(result);
    result = JSON.parse(result);

    // queryでInfoとTodo取得
    const InfoData = await API.graphql(graphqlOperation(ListInfo));
    const todoData = await API.graphql(graphqlOperation(showlistTodos));

    var infos = InfoData.data.listInfo.items;
    var todos = todoData.data.listTodos.items;

    infos = infos.filter((data) => {
      return data.cognitoID === result.id;
    });
    todos = todos.filter((data) => {
      return data.cognitoID === result.id;
    });
    todos.sort(function (a, b) {
      return new Date(a.name).getTime() - new Date(b.name).getTime();
    });

    setInfos(infos);
    setUser(result.username);
    setTodos(todos);

    infos.map((info) => {
      lv = info.lv;
      setLv(lv);
    });
    console.log(lv);
  } catch (err) {
    console.log("error fetching infos", err);
  }
}
