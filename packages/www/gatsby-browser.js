const React = require('react');
const wrapRootElement = require('./wrap-root');
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache
} = require('@apollo/client');

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://song-book.netlify.com/.netlify/functions/index'
  })
});
exports.wrapRootElement = ({ element}) => (
  <ApolloProvider client={client}>
    {wrapRootElement({ element})}
  </ApolloProvider>
);
