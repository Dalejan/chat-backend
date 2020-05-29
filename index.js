const { typeDefs, resolvers } = require("./graphql/index");
const { ApolloServer } = require("apollo-server-express");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Initialize the app
const app = require("express")();
server.applyMiddleware({ app });

const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(
    `Go to http://localhost:${PORT}${server.graphqlPath} to run queries!`
  );
});
