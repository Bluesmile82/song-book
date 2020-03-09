import React from 'react';
import { Button, Flex, NavLink } from 'theme-ui';
import { Link, navigate } from '@reach/router';

const Nav = ({ user, identity }) => (
  <Flex as="nav" sx={{ justifyContent: 'space-between' }}>
    <NavLink as={Link} to="/songs" p={2}>
      Songs
    </NavLink>
    {/* {user && (
      <Flex>
        <NavLink href="#!" to="/songs" p={2}>
          {user.user_metadata.full_name}
        </NavLink>
        <Button
          sx={{ marginTop: 2, float: 'right' }}
          onClick={() => {
            identity.logout();
            navigate(`/`);
          }}
        >
          Log out
        </Button>
      </Flex>
    )} */}
  </Flex>
);

export default Nav;
