const React = require('react');
const { ThemeProvider } = require('theme-ui');
const { future } = require('@theme-ui/presets');
const updatedTheme = {
  ...future,
  sizes: { container: 1024 }
};
const fetch = require('node-fetch');
const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache
} = require('@apollo/client');

const httpLink = new HttpLink({
  uri: 'https://song-book.netlify.com/.netlify/functions/index',
  fetch
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

module.exports = ({ element }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={updatedTheme}>{element}</ThemeProvider>
  </ApolloProvider>
);
