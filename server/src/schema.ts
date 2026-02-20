// server/src/schema.ts
const typeDefs = `#graphql
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
  }

  input CreateTodoInput {
    title: String!
  }

  input UpdateTodoInput {
    id: ID!
    title: String
    completed: Boolean
  }

  type Query {
    todos: [Todo!]!
  }

  type Mutation {
    createTodo(input: CreateTodoInput!): Todo!
    updateTodo(input: UpdateTodoInput!): Todo!
    deleteTodo(id: ID!): Boolean!
    toggleTodo(id: ID!): Todo!
  }
`;

export default typeDefs;