import { Router, Link, navigate } from '@reach/router';
import React, { useContext, useRef } from 'react';
import { IdentityContext } from '../../identity-context';
import {
  Container,
  Heading,
  Button,
  Flex,
  Input,
  Textarea,
  Label,
  NavLink
} from 'theme-ui';
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
  mutation AddSong(
    $title: String!
    $author: String!
    $key: String!
    $style: String!
    $lyrics: String!
    $youtubeId: String
  ) {
    addSong(
      title: $title,
      author: $author,
      key: $key,
      style: $style,
      lyrics: $lyrics,
      youtubeId: $youtubeId
    ) {
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
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const keyRef = useRef(null);
  const styleRef = useRef(null);
  const lyricsRef = useRef(null);
  const youtubeIdRef = useRef(null);
  const [addSong] = useMutation(ADD_SONG);
  const { loading, error, data, refetch } = useQuery(GET_SONGS);
  const onSubmit = async e => {
    e.preventDefault();
    await addSong({
      variables: {
        title: titleRef.current.value,
        key: keyRef.current.value,
        author: authorRef.current.value,
        style: styleRef.current.value,
        lyrics: lyricsRef.current.value,
        youtubeId: youtubeIdRef.current.value
      }
    });
    await refetch();
  };

  const FormLabel = ({ label, ref, textarea }) => {
    const InputComponent = textarea ? Textarea : Input;
    return (
      <Label sx={{ display: 'flex', marginBottom: 3 }}>
        <span>{label}</span>
        <InputComponent ref={ref} sx={{ marginLeft: 3 }} name={label} />
      </Label>
    );
  };

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
          <Heading as="h1" sx={{ marginBottom: 3 }}>Songs</Heading>
          <Flex as="form" onSubmit={onSubmit} sx={{ flexDirection: 'column' }}>
            <FormLabel label="title" ref={titleRef} />
            <FormLabel label="author" ref={authorRef} />
            <FormLabel label="key" ref={keyRef} />
            <FormLabel label="style" ref={styleRef} />
            <FormLabel label="lyrics" ref={lyricsRef} textarea />
            <FormLabel label="youtube id" ref={youtubeIdRef} />
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
