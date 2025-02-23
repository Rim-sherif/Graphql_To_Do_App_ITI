const schema=`

interface IUser {
  name: String!
  email: String!
} 

enum STATUS {
  TODO
  IN_PROGRESS
  DONE
}

type User implements IUser {
  _id: ID
  name: String!
  email: String!
  role: String!
}

type Todo {
  _id: ID!
  title: String!
  status: STATUS!
  userId: ID!
  time: String!
}

# Add these input type definitions
input TodoInput {
  title: String!
  status: STATUS!
}

input TodoUpdateInput {
  title: String
  status: STATUS
}

type Query {
  users: [User]
  user(id: ID): User
  getAllTodos: [Todo!]!
  getTodo(id: ID!): Todo
}

type Mutation {
  register(user: newUser): User!
  login(user: loggedInUser): String
  updateUser(id: ID!, newFields: UpdateUser!): User
  deleteUser(id: ID!): String
  addTodo(todo: TodoInput!): Todo!        # Now using defined input
  updateTodo(id: ID!, updates: TodoUpdateInput!): Todo!  # Now using defined input
  deleteTodo(id: ID!): String!
}

input newUser {
  name: String!
  email: String!
  password: String!
  role: String
}

input UpdateUser {
  name: String
  email: String
}

input loggedInUser {
  email: String!
  password: String!
}

`


export default schema