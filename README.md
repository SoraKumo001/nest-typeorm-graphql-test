# nest-typeorm-graphql-test

## 概要

Nest.js + TypeORM + GraphQL のサンプルプログラムです  
現在、select文発行時のフィールドにフィルターを書けたり、余計なクエリーを抑制するための機能の実験をしています

## Start

```.sh
yarn start
```

## 動作確認方法

```.sh
http://localhost:3000/graphql
```

## GraphQL

### データの追加

```test.graphql
mutation AddMessage {
  addMessage(name: "aaaa", value: "ふぉっふぉっふぉ")
}
```

### データの取得1

一通り取得

#### Query

```test.graphql
query {
  messages(last:5) {
    count
    nodes {
      id
      name
      value
      createAt
      updateAt
    }
  }
}
```

#### 作成されるselect文

```.sql
SELECT COUNT(DISTINCT("Message"."id")) as "cnt" FROM "message" "Message"
SELECT "Message"."id" AS "Message_id", "Message"."name" AS "Message_name", "Message"."value" AS "Message_value", "Message"."createAt" AS "Message_createAt", "Message"."updateAt" AS "Message_updateAt" FROM "message" "Message" ORDER BY "Message"."id" DESC LIMIT 5
```

### データの取得2

取得する内容を限定

#### Query
```test.graphql
query {
  messages(last:5) {
    nodes {
      name
      value
    }
  }
}
```

#### 作成されるselect文

```.sql
SELECT "Message"."name" AS "Message_name", "Message"."value" AS "Message_value", "Message"."id" AS "Message_id" FROM "message" "Message" ORDER BY "Message"."id" DESC LIMIT 5
```
