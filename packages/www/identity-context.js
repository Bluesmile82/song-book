const React = require('react');
const netlifyIdentity = require('netlify-identity-widget');

const IdentityContext = React.createContext({});

exports.IdentityContext = IdentityContext;

const IdentityProvider = props => {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    netlifyIdentity.init({});
    netlifyIdentity.on('login', user => {
      netlifyIdentity.close()
      setUser(user);
    });
    netlifyIdentity.on('logout', () => {
      setUser(null);
      netlifyIdentity.close()
    });
  }, []);
  return (
    <IdentityContext.Provider value={{ identity: netlifyIdentity, user }}>
      {props.children}
    </IdentityContext.Provider>
  )
}

exports.IdentityProvider = IdentityProvider;
