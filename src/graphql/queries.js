/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        completed
        archive
        cognitoID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listCounts = /* GraphQL */ `
  query ListCounts {
    listTodos(filter: { completed: { eq: true } }) {
      items {
        id
        name
        description
        completed
        archive
        cognitoID
        createdAt
        updatedAt
      }
    }
  }
`;

export const archiveCounts = /* GraphQL */ `
  query ListCounts {
    listTodos(filter: { archive: { eq: true } }) {
      items {
        id
        name
        description
        completed
        archive
        cognitoID
        createdAt
        updatedAt
      }
    }
  }
`;

export const showlistTodos = /* GraphQL */ `
  query ListCounts {
    listTodos(filter: { archive: { eq: false } }) {
      items {
        id
        name
        description
        completed
        archive
        cognitoID
        createdAt
        updatedAt
      }
    }
  }
`;

export const ListInfo = /* GraphQL */ `
  query list {
    listInfo {
      items {
        cognitoID
        type
        gen
        age
        lv
      }
    }
  }
`;

export const getInfo = /* GraphQL */ `
  query GetInfo($lv: lv!) {
    getInfo(lv: $lv) {
      cognitoID
      type
      gen
      age
      lv
    }
  }
`;
