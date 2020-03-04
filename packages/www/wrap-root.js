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
const { setContext } = require("apollo-link-context");
const netlifyIdentity = require("netlify-identity-widget");

const httpLink = new HttpLink({
  uri: 'https://song-book.netlify.com/.netlify/functions/index',
  fetch
});

const authLink = setContext((_, { headers }) => {
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

module.exports = ({ element }) => (
  <IdentityProvider>
    <ApolloProvider client={client}>
      <ThemeProvider theme={updatedTheme}>{element}</ThemeProvider>
    </ApolloProvider>
  </IdentityProvider>
);
