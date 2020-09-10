import React, { useEffect, useState, Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Container, Header, Icon, Fab, Button } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import TypeWriter from "react-native-typewriter";
import { PieChart } from "react-native-chart-kit";
import Modal from "react-native-modal";
import { Auth } from "aws-amplify"; //Auth
import { API, graphqlOperation } from "aws-amplify"; //Graphql
import { updateInfo, deleteInfo } from "./../../src/graphql/mutations";
import {
  ListInfo,
  showlistTodos,
  listCounts,
} from "./../../src/graphql/queries";

const timeState = {
  current: new Date().toLocaleString(), // 現時刻
  year: new Date().getFullYear(), // 年
  month: new Date().getMonth() + 1, // 月
  date: new Date().getDate(), // 日
  hours: new Date().getHours(), // 時
  minutes: new Date().getMinutes(), // 分
  seconds: new Date().getSeconds(), // 秒
};

// 配列の最小値を取得する関数
const aryMin = function (a, b) {
  return Math.min(a, b);
};

//健康レコメンド配列
const health_30 = [
  "バナナはエネルギーいっぱい!",
  "シャワーで汗を流してスッキリ♪",
  "少し運動しませんか?",
  "完食はほどほどに...",
];
const health_60 = [
  "家でエクササーイズ!",
  "1時間の有酸素運動はカラダにGood!",
  "日光浴でリフレーッシュ!",
  "すきま時間だよ!ストレッチできるね♪",
];
const health_90 = [
  "次のタスクまでウォーキングはいかが?",
  "ジムで軽く運動するのはどう?",
  "適度な仮眠も健康には必須!",
];

const levelState = {
  lv1: "",
  lv2: "",
  lv3: "",
  lv4: "",
  lv5: "",
  lv6: "",
  lv7: "",
  lv8: "",
};

// 追加

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const data = [
  {
    name: "Seoul",
    population: 60,
    color: "hsla(0, 0%, 0%, 1)",
    legendFontColor: "#7F7F7F", // ラベルの色
    legendFontSize: 15, // ラベルサイズ
  },
  {
    name: "Toronto",
    population: 40,
    color: "hsla(0, 0%, 20%, 0.8)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Beijing",
    population: 33,
    color: "hsla(0, 0%, 40%, 0.6)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "New York",
    population: 21,
    color: "hsla(0, 0%, 60%, 0.4)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
  {
    name: "Moscow",
    population: 9,
    color: "hsla(0, 0%, 80%, 0.2)",
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  },
];

const App = () => {
  // Hook(stateなどのReactの機能をクラスを書かずに使えるようになる)
  const [infos, setInfos] = useState([]); //dynamoからfetchするデータに関する宣言
  const [active, setActive] = useState(false);
  const [user, setUser] = useState([]);
  const [modalTrigger, setTrigger] = useState(false);
  var [lv, setLv] = useState(1);
  const [todos, setTodos] = useState([]); //dynamoからfetchするデータに関する宣言
  var [time, setTimes] = useState([]);
  var [rec_todo, setRecTodo] = useState("");
  var [rec_time, setRecTime] = useState(null);
  ///////ランキング系取得系///

  const [rankState, setFormState] = useState(levelState); //formに関する宣言
  const [ranks, setRanks] = useState([]); //dynamoからfetchするデータに関する宣言
  const [modalrank, setModalRanks] = useState([]); //dynamoからfetchするデータに関する宣言

  ///////現在時刻取得系//////
  const [now, setNow] = useState(timeState);
  const [nows, setNows] = useState([]);

  const chartConfig = {
    backgroundGradientFrom: "black",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "black",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => "black",
  };

  useEffect(
    //1秒毎に時刻取得
    function () {
      const intervalTime = setInterval(function () {
        // now.current = new Date().toLocaleString(); // 現時刻
        now.year = new Date().getFullYear(); // 年
        now.month = ("0" + (new Date().getMonth() + 1)).slice(-2); // 月
        now.date = new Date().getDate(); // 日
        // now.week = weekday[new Date().getDay()]; // 曜日
        now.hours = new Date().getHours(); // 時
        now.minutes = ("0" + new Date().getMinutes()).slice(-2); // 分
        now.seconds = new Date().getSeconds(); // 秒

        const hoge = { ...now };
        setNows([...nows, hoge]);
        setNow(timeState);
      }, 1000);
      return function () {
        clearInterval(intervalTime);
      };
    },
    [now]
  );
  /////////

  // 一分毎にfetchInfosを読む(本当はLVが上がったら読むようにしたい/デモでは5秒にして);
  useEffect(function () {
    const intervalComp = setInterval(function () {
      fetchInfos(); //コンポーネントが更新する度にdynamoからデータを取得する
      console.log("fetchInfo called!");
    }, 10000);
    return function () {
      clearInterval(intervalComp);
    };
  }, []);

  useEffect(() => {
    fetchInfos(); //コンポーネントが更新する度にdynamoからデータを取得する
  }, []);

  //データを取得する関数
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
        new Date(a.name.substr(0, 16)).getTime() -
          new Date(b.name.substr(0, 16)).getTime();
      });

      rec_todos = todos.filter((data) => {
        return data.completed === false;
      });
      // console.log(rec_todos);

      rec_todos.sort(function (a, b) {
        return (
          new Date(a.name.substr(0, 16)).getTime() -
          new Date(b.name.substr(0, 16)).getTime()
        );
      });
      // console.log(rec_todos);

      if (Object.keys(rec_todos).length != 0) {
        // const num = Object.keys(rec_todos).length;
        // console.log(rec_todos);
        rec_todo = rec_todos[0].description;
        setRecTodo(rec_todo);
      }

      if (Object.keys(rec_todos).length != 0) {
        // console.log("Todoがあります");
        // console.log(rec_todo);

        setTimes((time = []));

        rec_todos.map((todo, index) => {
          if (
            todo.name.substr(0, 4) === String(now.year) &&
            todo.name.substr(5, 2) ===
              ("0" + (new Date().getMonth() + 1)).slice(-2) &&
            todo.name.substr(8, 2) === String(now.date)
          ) {
            // console.log("日付が同じです");
            var rec =
              (parseInt(todo.name.substr(11, 2)) - now.hours) * 60 +
              parseInt(todo.name.substr(14, 2)) -
              now.minutes;
            time.push(rec);
            // console.log(time, rec_time);
          } else {
            // console.log("日付が違います");
            rec = 10000;
            time.push(rec);
            // console.log(time, rec_time);
          }
        });
        setTimes(time); //時間配列
        rectime = time.reduce(aryMin); //時間配列の最小値取得
        setRecTime(rectime); //rec_timeに値反映
        // console.log(time);
      } else {
        //todoがない時(一番最初)
        // console.log("Todoがありません");
        setTimes((time = []));
        var rec = 0;
        time.push(rec);
        setRecTime(rec);
        // console.log(rec_time);
      }

      setInfos(infos);
      setUser(result.username);
      setTodos(todos);

      infos.map((info) => {
        lv = info.lv;
        setLv(lv);
      });
    } catch (err) {
      console.log("error fetching infos", err);
    }

    ///////////////ここから編集中
    try {
      const rankData = await API.graphql(graphqlOperation(ListInfo));
      var rank = rankData.data.listInfo.items;
      rank = rank.map((rank) => rank.lv);

      var count = rank.length;

      const all = { ...levelState };
      setRanks([...ranks, all]);

      for (var i = 0; i < count; ++i) {
        if (rank[i] == 1) all.lv1++;
        if (rank[i] == 2) all.lv2++;
        if (rank[i] == 3) all.lv3++;
        if (rank[i] == 4) all.lv4++;
        if (rank[i] == 5) all.lv5++;
        if (rank[i] == 6) all.lv6++;
        if (rank[i] == 7) all.lv7++;
        if (rank[i] == 8) all.lv8++;
      }
      setRanks([...ranks, all]);
      setFormState(levelState);

      const ranking = [
        {
          name: "Lv.1",
          population: all.lv1,
          color: "#ff7f7f",
          legendFontColor: "#ff7f7f", // ラベルの色
          legendFontSize: 15, // ラベルサイズ
        },
        {
          name: "Lv.2",
          population: all.lv2,
          color: "#ff7fbf",
          legendFontColor: "#ff7fbf",
          legendFontSize: 15,
        },
        {
          name: "Lv.3",
          population: all.lv3,
          color: "#bf7fff",
          legendFontColor: "#bf7fff",
          legendFontSize: 15,
        },
        {
          name: "Lv.4",
          population: all.lv4,
          color: "#7f7fff",
          legendFontColor: "#7f7fff",
          legendFontSize: 15,
        },
        {
          name: "Lv.5",
          population: all.lv5,
          color: "#7fffff",
          legendFontColor: "#7fffff",
          legendFontSize: 15,
        },
        {
          name: "Lv.6",
          population: all.lv6,
          color: "#7fffbf",
          legendFontColor: "#7fffbf",
          legendFontSize: 15,
        },
        {
          name: "Lv.7",
          population: all.lv7,
          color: "#bfff7f",
          legendFontColor: "#bfff7f",
          legendFontSize: 15,
        },
        {
          name: "Lv.8",
          population: all.lv8,
          color: "#ffbf7f",
          legendFontColor: "#ffbf7f",
          legendFontSize: 15,
        },
      ];

      setModalRanks(ranking);
    } catch (err) {
      console.log("error fetching infos_all", err);
    }
  }

  return (
    <Container>
      <Header style={{ backgroundColor: "#5067FF" }}>
        <Grid>
          <Col size={40}>
            {/* cognitoのユーザ名を表示させる,Authから取得 */}
            <Text style={styles.abovefont}>{user}</Text>
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
              <Text style={styles.abovefont}>Lv.{lv}</Text>
            </View>
          </Col>
        </Grid>
      </Header>
      <Grid>
        <Row size={85}>
          <View style={styles.abovecontainer}>
            {/* bg (Viewの中で有効) */}
            <ImageBackground
              source={{
                uri:
                  "https://hacku2020s3bucket144145-dev.s3-ap-northeast-1.amazonaws.com/hibi-test/bg5.png",
              }}
              style={styles.image}
            >
              <Fab
                active={active}
                direction="right"
                containerStyle={{}}
                style={{ backgroundColor: "#5067FF" }}
                position="topLeft"
                onPress={() => setActive(!active)}
              >
                <Icon type="FontAwesome" name="list" />
                <Button
                  style={{ backgroundColor: "#34A34F" }}
                  onPress={() => setTrigger(true)}
                >
                  {/* モーダル */}
                  <Modal
                    isVisible={modalTrigger}
                    swipeDirection={["up", "down", "left", "right"]}
                    onSwipeComplete={() => setTrigger(false)}
                    backdropOpacity={0.5}
                    animationInTiming={700}
                    animationOutTiming={700}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        height: 300,
                      }}
                    >
                      <Text style={{ fontWeight: "bold" }}>
                        「健康」タイプのLv分布図
                      </Text>
                      <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setTrigger(true)}
                      >
                        <PieChart
                          data={modalrank}
                          chartConfig={chartConfig}
                          width={windowWidth * 0.99}
                          height={windowHeight / 4}
                          accessor="population"
                          bgColor="transparent"
                          paddingLeft={30}
                          // absolute
                        />
                      </TouchableOpacity>
                    </View>
                  </Modal>
                  <Icon type="FontAwesome" name="trophy" />
                </Button>
              </Fab>

              <Image
                // キャラクター
                resizeMode="contain"
                source={{
                  uri:
                    "https://hacku2020s3bucket144145-dev.s3-ap-northeast-1.amazonaws.com/hibi-test/lv/lv" +
                    lv +
                    ".gif",
                }}
                style={styles.lv}
              />
              <View style={styles.talkWrap}>
                <TypeWriter typing={1} style={styles.talk}>
                  {/* {(() => {
                    if (rec_time % 3 === 0) {
                      //3で割った余りが0の時(レコメンド頻度減らすため)
                      if (rec_time <= 30 && rec_time > 0) {
                        return health_30[
                          Math.floor(Math.random() * health_30.length)
                        ];
                      } else if (rec_time <= 60 && rec_time > 30) {
                        return health_60[
                          Math.floor(Math.random() * health_60.length)
                        ];
                      } else if (rec_time <= 90 && rec_time > 60) {
                        return health_90[
                          Math.floor(Math.random() * health_90.length)
                        ];
                      }
                    } else if (rec_time === 0) {
                      return "「Account」で設定してね";
                    } else if (rec_time === 10000) {
                      return "タスクが少ないかも...?\n追加しよう♪";
                    } else if (rec_time != null) {
                      return "タスクを追加してみよう♪";
                    }
                  })()} */}

                  {(() => {
                    if (rec_time <= 30 && rec_time > 0) {
                      if (now.seconds <= 15 && now.seconds > 0) {
                        return health_30[0];
                      } else if (now.seconds <= 30 && now.seconds > 15) {
                        return health_30[1];
                      } else if (now.seconds <= 45 && now.seconds > 30) {
                        return health_30[2];
                      } else if (now.seconds <= 60 && now.seconds > 45) {
                        return health_30[3];
                      }
                    } else if (rec_time <= 60 && rec_time > 30) {
                      if (now.seconds <= 15 && now.seconds > 0) {
                        return health_60[0];
                      } else if (now.seconds <= 30 && now.seconds > 15) {
                        return health_60[1];
                      } else if (now.seconds <= 45 && now.seconds > 30) {
                        return health_60[2];
                      } else if (now.seconds <= 60 && now.seconds > 45) {
                        return health_60[3];
                      }
                    } else if (rec_time <= 90 && rec_time > 60) {
                      if (now.seconds <= 20 && now.seconds > 0) {
                        return health_90[0];
                      } else if (now.seconds <= 40 && now.seconds > 20) {
                        return health_90[1];
                      } else if (now.seconds <= 60 && now.seconds > 40) {
                        return health_90[2];
                      }
                    }
                    if (rec_time === 0) {
                      return "「Account」で設定してね";
                    } else if (rec_time === 10000) {
                      return "タスクが少ないかも...?\n追加しよう♪";
                    } else if (rec_time != null) {
                      return "タスクを追加しよう!";
                    }
                  })()}
                </TypeWriter>
              </View>
            </ImageBackground>
          </View>
        </Row>
        <Row size={15}>
          <View style={styles.belowcontainer}>
            <Text style={styles.belowfont}>Next Task</Text>
            <Text style={styles.belowfont}>{rec_todo}</Text>
          </View>
        </Row>
      </Grid>
    </Container>
  );
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      modalTrigger: false,
      username: "",
    };
  }
  render() {
    return <App />;
  }
}

const styles = StyleSheet.create({
  abovecontainer: {
    flex: 1,
    flexDirection: "column",
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
  lv: {
    flex: 1,
    width: 250,
    height: 250,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 150,
    marginBottom: "auto",
  },
  talk: {
    color: "#eee",
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    justifyContent: "center",
  },
  talkWrap: {
    backgroundColor: "#000",
    opacity: 0.8,
    borderColor: "#ccc",
    borderRadius: 15,
    borderWidth: 3,
    margin: 1,
    padding: 25,
  },
});
