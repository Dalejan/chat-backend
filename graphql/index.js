const { USERS_TYPES } = require("./schemas/users.schema");
const { MESSAGE_TYPES } = require("./schemas/message.schema");
const { gql } = require("apollo-server-express");
const { getMessages, addMessage } = require("../data/sql/messages");
const { signin, signup, findUser } = require("../data/sql/users");
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

const QUERY = gql`
  type Query {
    user(usr: String): User
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

const SUBSCRIPTION = gql`
  type Subscription {
    messageAdded: Message
  }
`;

const typeDefs = [QUERY, MUTATION, SUBSCRIPTION, USERS_TYPES, MESSAGE_TYPES];

const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: () => {
        return pubsub.asyncIterator(["MESSAGE_ADDED"]);
      },
    },
  },
  Mutation: {
    signInUser: async (parent, args) => {
      return await signin({ ...args });
    },
    signUpUser: async (parent, args) => {
      return await signup({ ...args });
    },
    createMessage: async (parent, args) => {
      pubsub.publish("MESSAGE_ADDED", {
        messageAdded: { ...args },
      });
      return await addMessage({ ...args });
    },
  },
  Query: {
    messages: async () => {
      return await getMessages();
    },
    user: async (paretn, args) => {
      return await findUser(args.usr);
    },
  },
};

module.exports = { typeDefs, resolvers };
