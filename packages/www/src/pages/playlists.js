import { Router, Link } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Input,
  NavLink
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

  return (
    <Router>
      <Playlists path="/playlists" />
    </Router>
  );
}
