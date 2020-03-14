import { Router, Link } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Input,
  NavLink,
  Box
} from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Form from '../components/Form';

const GET_PLAYLISTS = gql`
  query GetPlaylists {
    playlists {
      id
      name
    }
  }
`;

export default () => {
  const { loading, error, data, refetch } = useQuery(GET_PLAYLISTS);

  const ViewPlaylists = () => {
    const [search, setSearch] = useState('');
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && (
          <>
            <Input
              placeholder="Search for..."
              onChange={term => setSearch(term.target.value)}
            />
            <ol>
              {data.playlists
                .filter(playlist =>
                  search ? playlist.title.startsWith(search) : true
                )
                .map(playlist => (
                  <li key={playlist.id}>
                    <NavLink as={Link} to={`/playlists/${playlist.id}`} p={2}>
                      {playlist.name}
                    </NavLink>
                    <NavLink
                      as={Link}
                      to={`/playlists/edit/${playlist.id}`}
                      p={2}
                    >
                      Edit
                    </NavLink>
                  </li>
                ))}
            </ol>
          </>
        )}
      </Flex>
    );
  };

  const viewPlaylist = id => {
    const playlist = data && data.playlists.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && playlist && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary">
              {playlist.name}
            </Box>
            <NavLink as={Link} to={`/playlists/edit/${playlist.id}`} p={2}>
              Edit
            </NavLink>
          </Flex>
        )}
      </Flex>
    );
  };

  const editPlaylist = id => {
    const playlist = data && data.playlists.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && playlist && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary">
              {playlist.name}
            </Box>
            <Form currentItem={playlist} collection="playlists" refetch={refetch} />
          </Flex>
        )}
      </Flex>
    );
  };

  const Playlists = () => {
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          <Nav />
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Playlists
          </Heading>
          <Form refetch={refetch} collection="playlists" />
          <ViewPlaylists />
        </Flex>
      </Container>
    );
  };

  let Playlist = ({ playlistId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/playlists/`} p={2}>
          {'<'} Back
        </NavLink>
        {viewPlaylist(playlistId)}
      </Container>
    );
  };

  let EditPlaylist = ({ playlistId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/playlists/`} p={2}>
          {'<'} Back
        </NavLink>
        {editPlaylist(playlistId)}
      </Container>
    );
  };

  return (
    <Router>
      <Playlists path="/playlists" />
      <Playlist path="/playlists/:playlistId" />
      <EditPlaylist path="/playlists/edit/:playlistId" />
    </Router>
  );
}
