import { Router, Link, navigate } from '@reach/router';
import React, { useContext } from 'react';
import { IdentityContext } from '../../identity-context';
import { Container, Heading, Button, Flex, NavLink } from 'theme-ui';


export default props => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);

  let Dash = () => {
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          <Flex as="nav">
            <NavLink as={Link} to="/" p={2}>
              Home
            </NavLink>
            <NavLink as={Link} to="/app" p={2}>
              Songs
            </NavLink>
            {user && (
              <NavLink href="#!" to="/app" p={2}>
                {user.user_metadata.full_name}
              </NavLink>
            )}
            <Button
              sx={{ marginTop: 2 }}
              onClick={() => {
                netlifyIdentity.logout()
                navigate(`/`);
              }}
            >
              Log out
            </Button>
          </Flex>
          <Heading as="h1">Songs</Heading>
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Dash path="app" />
    </Router>
  );
}
