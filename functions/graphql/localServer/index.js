const { ApolloServer } = require('apollo-server');
require('dotenv').config();
const { typeDefs, resolvers } = require('../index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});