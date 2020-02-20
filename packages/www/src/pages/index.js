import React, { useContext } from 'react';
import { IdentityContext } from '../../identity-context';
import { Container, Heading, Button, Flex, NavLink } from 'theme-ui';
import { Link } from '@reach/router';

export default props => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  return (
    <Container>
      <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
        <Flex as="nav">
          <NavLink as={Link} to="/" p={2}>
            Home
          </NavLink>
          {user && <NavLink as={Link} to="/app" p={2}>
            Songs
          </NavLink>}
          {user && (
            <NavLink href="#!" to="/app" p={2}>
              {user.user_metadata.full_name}
            </NavLink>
          )}
        </Flex>
        <Heading as="h1">Song book</Heading>
        <Button sx={{ marginTop: 2 }} onClick={() => netlifyIdentity.open()}>
          Sign up / Log in
        </Button>
      </Flex>
    </Container>
  );
}