/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserActivity = /* GraphQL */ `
  mutation CreateUserActivity(
    $input: CreateUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    createUserActivity(input: $input, condition: $condition) {
      id
      phone
      cursorPosition
      createdAt
      updatedAt
    }
  }
`;
export const updateUserActivity = /* GraphQL */ `
  mutation UpdateUserActivity(
    $input: UpdateUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    updateUserActivity(input: $input, condition: $condition) {
      id
      phone
      cursorPosition
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserActivity = /* GraphQL */ `
  mutation DeleteUserActivity(
    $input: DeleteUserActivityInput!
    $condition: ModelUserActivityConditionInput
  ) {
    deleteUserActivity(input: $input, condition: $condition) {
      id
      phone
      cursorPosition
      createdAt
      updatedAt
    }
  }
`;
