# [Hack U 中部大学2020](https://hacku.yahoo.co.jp/chubu2020/) 

---
<span style="color: red; ">「中部大学賞」を受賞しました!</span>

[![](https://i.imgur.com/tDubAoE.jpg)](https://www.youtube.com/watch?v=x8g1sgeTSxQ&t=1110s)
↑プレゼン動画

## チームひびてこ　「○○ごっち」
* コロナで時間管理の重要性が高まっている
    * リマインダーなどのアプリがあるがエンドユーザが少ない
    * 開く習慣をつけさせたい(開くことに価値を見出す)
    * 普通のTodoアプリと区別化したい
    *  エンドユーザ毎に使い方が変わるものにしたい

### 新規性
* 育成ゲーム要素+によるLIFE UPDATE
### 発展性
* ガチャシステム? 位置情報の連携とか?
* システムとしても可用性が高く，ユーザが増えても安心

### 技術性
* モダンな技術(SPA，Cloud，Serverless)を使用している
* Auth,GraphQL,CDNを使用している

## 開発環境とシステム構成

### 設計書(ver 1.0)
![](https://i.imgur.com/NP13B78.png)

### OS
* MacOS

### フロントエンド
* React Native(Amplifyで簡単にバックエンドと連携出来そうだったから)

### バックエンド
* Amplify
    - S3...静的データを格納するため(画像等)
    - CloudFront...CDNを実現するため(主にキャッシュの役割をする)
    - Cognito...認証機能を入れるため
    - DynamoDB...リマインダーの内容をDBに格納するため
    - AppSync...GraphQLでDBを操作するため
    - ~~Lambda...プッシュ通知を送る際に必要なため~~
    - ~~Pinpoint...プッシュ通知を送るため~~

### コード・パッケージ管理
* [Github](https://github.com/tsuchiya-github/HackU2020)
    - ブランチを切って作業してpushする
    - clone後，anaconda環境をコピーして環境内で`npm i`
* [Anaconda](https://github.com/tsuchiya-github/HackU2020/blob/master/anaconda.txt)

### 役割分担
* フロント・バックともに協力してやる(お互いのスキルアップのため)


## Todo
* CRUD操作(AppsyncでGraphQL)
* AWSサービスとの紐付け(みんなでやる)
* イラストどうするか(アプリのロゴ，キャラ等)
* タスクをどのように決定するか(具体的な分岐処理とか難しそう)


## 参考資料
### AWS関連
* [Amplify CLI入門](https://qiita.com/rubytomato@github/items/5d9b6e184b615f974f28)
* [Amplify 使い方(qiita)](https://qiita.com/too/items/fc961283dcbef3aafdeb)
* [AWSによるクラウド入門](https://tomomano.gitlab.io/intro-aws/)
* [AWS Amplify CLIの使い方〜インストールから初期セットアップまで〜](https://qiita.com/Junpei_Takagi/items/f2bc567761880471fd54)
* [Amplify Blackbelt](https://aws.amazon.com/jp/blogs/news/webinar-bb-aws-amplify-2020/)
* [Amplify CLI Tutorial(React Native)](https://docs.amplify.aws/start/q/integration/react-native)
* [Amazon Pinpoint でユーザーに合わせたプッシュ通知を実現する
](https://speakerdeck.com/kiwi26/personalized-push-notification-with-amazon-pinpoint)
* [Amplify 環境共有方法](https://thinkami.hatenablog.com/entry/2019/07/27/210948)
* [AWS Amplify / AppSyncで画像投稿webアプリのサーバサイドを実装する](https://qiita.com/stranger1989/items/ebfce4617c748d131b10)
### その他
* [NativeBase Components](https://docs.nativebase.io/Components.html)
* [propsとstateのイメージをつかむ【はじめてのReact】](https://qiita.com/rio_threehouse/items/7632f5a593cf218b9504)
* [Anacondaを使った仮想環境を保存・再構築、複製](https://qiita.com/ozaki_physics/items/13466d6d1954a0afeb3b)
* [VSCodeでのGitの基本操作まとめ](https://qiita.com/y-tsutsu/items/2ba96b16b220fb5913be)
* [Get started with Event Calendar in React Native](https://www.youtube.com/watch?v=RdaQIkE47Og)
* [React Native Tutorial(Youtube)](https://www.youtube.com/playlist?list=PLyF8V4xT7-15c7NWNssGWTYCVwHiZFye9)
* [Make a Splash Screen](https://www.youtube.com/watch?v=9_KDgsFGLY8)
* [React+Amplify+AppSync+DynamoDBでサーバレスなWebアプリを作成する公式チュートリアルをやってみた](https://dev.classmethod.jp/articles/react-amplify-appsync-dynamodb-tutorial/)
* [土屋的分かりやすかったブログ](https://reactnative-st.com/)
* [便利なReactNativeライブラリ一覧](https://kokensha.xyz/reactnative/react-native-production-ready-library-2018/)

