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
export const getEmailTemplate = /* GraphQL */ `
  query GetEmailTemplate($id: ID!) {
    getEmailTemplate(id: $id) {
      id
      name
      subject
      htmlBody
      textBody
      files
      createdAt
      updatedAt
    }
  }
`;
export const listEmailTemplates = /* GraphQL */ `
  query ListEmailTemplates(
    $filter: ModelEmailTemplateFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmailTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        subject
        htmlBody
        textBody
        files
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClientQuery = /* GraphQL */ `
  query GetClientQuery($id: ID!) {
    getClientQuery(id: $id) {
      id
      name
      query
      createdAt
      updatedAt
    }
  }
`;
export const listClientQuerys = /* GraphQL */ `
  query ListClientQuerys(
    $filter: ModelClientQueryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClientQuerys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        query
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
