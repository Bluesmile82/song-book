const React = require('react');
const { ThemeProvider } = require('theme-ui');
const { future } = require('@theme-ui/presets');
const { IdentityProvider } = require('./identity-context');
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'https://song-book.netlify.com/.netlify/functions/index',
    fetch
  })
});

module.exports = ({ element }) => (
  <IdentityProvider>
    <ApolloProvider client={client}>
      <ThemeProvider theme={updatedTheme}>{element}</ThemeProvider>
    </ApolloProvider>
  </IdentityProvider>
);
