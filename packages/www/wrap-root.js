const React = require('react');
const { ThemeProvider } = require('theme-ui');
const { future } = require('@theme-ui/presets');
const { IdentityProvider } = require('./identity-context');
const updatedTheme = {
  ...future,
  sizes: { container: 1024 }
};

module.exports = ({ element }) => (
  <IdentityProvider>
    <ThemeProvider theme={updatedTheme}>{element}</ThemeProvider>
  </IdentityProvider>
);
