/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserActivity = /* GraphQL */ `
  query GetUserActivity($id: ID!) {
    getUserActivity(id: $id) {
      id
      phone
      cursorPosition
      createdAt
      updatedAt
    }
  }
`;
export const listUserActivitys = /* GraphQL */ `
  query ListUserActivitys(
    $filter: ModelUserActivityFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserActivitys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        phone
        cursorPosition
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
