import { Router, Link, navigate } from '@reach/router';
import React, { useContext, useRef, useState, useReducer } from 'react';
import { IdentityContext } from '../../identity-context';
import { Container, Heading, Button, Flex, Input, Label, NavLink } from 'theme-ui';

const songsReducer = (state, action) => {
  switch (action.type) {
    case 'addSong':
      return [...state, action.payload]
    default:
      break;
  }
}
export default props => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const [songs, dispatch] = useReducer(songsReducer, [])
  const nameRef = useRef(null);
  const youtubeIdRef = useRef(null);
  const formRef = useRef(null);

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
                netlifyIdentity.logout();
                navigate(`/`);
              }}
            >
              Log out
            </Button>
          </Flex>
          <Heading as="h1">Songs</Heading>
          <Flex
            as="form"
            ref={formRef}
            onSubmit={e => {
              e.preventDefault();
              dispatch({
                type: 'addSong',
                payload: {
                  name: nameRef.current.value,
                  youtubeId: youtubeIdRef.current.value
                }
              });
            }}
          >
            <Label sx={{ display: 'flex' }}>
              <span>Name</span>
              <Input ref={nameRef} sx={{ marginLeft: 1 }} name="name" />
            </Label>
            <Label sx={{ display: 'flex' }}>
              <span>Youtube id</span>
              <Input
                ref={youtubeIdRef}
                sx={{ marginLeft: 1 }}
                name="youtubeId"
              />
            </Label>
            <Button sx={{ marginLeft: 1 }}>Submit</Button>
          </Flex>
          <Flex sx={{ flexDirection: 'column' }}>
            <ul>
              {songs.map(song => (
                <li key={song.name}>
                  <span>{song.name}</span>
                </li>
              ))}
            </ul>
          </Flex>
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
