const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('../index');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context && context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },
  playground: true,
  introspection: true
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});