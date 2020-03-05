import React, { useContext } from 'react';
import { IdentityContext } from '../../identity-context';
import { Container, Button } from 'theme-ui';
import Nav from '../components/Nav';

export default props => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  return (
    <Container>
      <Nav user={user} identity={netlifyIdentity} />
      {!user && (
        <Button sx={{ marginTop: 2 }} onClick={() => netlifyIdentity.open()}>
          Sign up / Log in
        </Button>
      )}
    </Container>
  );
}