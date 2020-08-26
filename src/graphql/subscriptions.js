/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo {
    onCreateTodo {
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
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo {
    onUpdateTodo {
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
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo {
    onDeleteTodo {
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
`;

export const onDeleteInfo = /* GraphQL */ `
  subscription OnDeleteInfo {
    onDeleteInfo {
      cognitoID
      type
      gen
      age
      lv
    }
  }
`;

export const onUpdateInfo = /* GraphQL */ `
  subscription OnUpdateInfo {
    onUpdateInfo {
      cognitoID
      type
      gen
      age
      lv
    }
  }
`;
