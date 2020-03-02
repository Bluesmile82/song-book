import { Router, Link, navigate } from '@reach/router';
import React, { useContext, useRef } from 'react';
import { IdentityContext } from '../../identity-context';
import { Container, Heading, Button, Flex, Input, Label, NavLink } from 'theme-ui';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_SONGS = gql`
  query GetSongs {
    songs {
      id
      name
      youtubeId
    }
  }
`;

const ADD_SONG = gql`
  mutation AddSong($name: String!, $youtubeId: String) {
    addSong(name: $name, youtubeId: $youtubeId) {
      id
    }
  }
`;

// const UPDATE_SONG = gql`
//   mutation UpdateSong($id: ID!, $name: String!, $youtubeId: String) {
//     updateSong(name: $name, youtubeId: $youtubeId) {
//       id
//     }
//   }
// `;

export default props => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const nameRef = useRef(null);
  const youtubeIdRef = useRef(null);
  const formRef = useRef(null);
  const [addSong] = useMutation(ADD_SONG);
  const { loading, error, data, refetch } = useQuery(GET_SONGS);
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
            onSubmit={async e => {
              e.preventDefault();
              await addSong({
                variables: {
                  name: nameRef.current.value,
                  youtubeId: youtubeIdRef.current.value
                }
              });
              await refetch();
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
            {loading && <div>Loading...</div>}
            {error && <div>{error.message}</div>}
            {!loading && !error && (
              <ul>
                {data.songs.map(song => (
                  <li key={song.id}>
                    <span>{song.name}</span>
                  </li>
                ))}
              </ul>
            )}
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
