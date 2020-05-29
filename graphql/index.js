const { USERS_TYPES } = require("./schemas/users.schema");
const { MESSAGE_TYPES } = require("./schemas/message.schema");
const { gql } = require("apollo-server-express");
const { getMessages, addMessage } = require("../data/sql/messages");
const { signin, signup } = require("../data/sql/users");

const QUERY = gql`
  type Query {
    users: [User]
    messages: [Message]
  }
`;

const MUTATION = gql`
  type Mutation {
    createMessage(text: String, date: String, usr: String): Message
    signInUser(usr: String, password: String): User
    signUpUser(usr: String, name: String, password: String, type: String): User
  }
`;

const typeDefs = [QUERY, MUTATION, USERS_TYPES, MESSAGE_TYPES];
const resolvers = {
  Mutation: {
    signInUser: async (parent, args) => {
      return await signin({ ...args });
    },
    signUpUser: async (parent, args) => {
      return await signup({ ...args });
    },
    createMessage: async (parent, args) => {
      return await addMessage({ ...args });
    },
  },
  Query: {
    messages: async () => {
      return await getMessages();
    },
  },
};

module.exports = { typeDefs, resolvers };
