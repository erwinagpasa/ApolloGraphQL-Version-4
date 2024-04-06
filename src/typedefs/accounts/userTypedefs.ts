
const userTypeDefs = `#graphql

type User {
  id: ID!
  name: String
  username: String
  password: String
  email: String
}

  type Query {
    hello: String
    user: [User]
    userByUsername(username: String): [User]
   }


  type Mutation {
    createUser(input: CreateUserInput!): User
    updateUser(id: ID!, input: UpdateUserInput): User
    deleteUser(id:ID):String
  }


input CreateUserInput {
  name: String
  username: String
  password: String
  email: String
  }


input UpdateUserInput {
  name: String
  username: String
  password: String
  email: String
}

`;

export default userTypeDefs;