const { typeDefs, resolvers } = require("./graphql/index");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");

const app = require("express")();
const PORT = process.env.PORT || 8080;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: () => {
      console.log("coneected");
    },
    onDisconnect: () => {
      console.log("disconected");
    },
  },
});

// Initialize the app
server.applyMiddleware({ app });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Wrap the Express server
httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
