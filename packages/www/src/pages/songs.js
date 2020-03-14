import { Router, Link } from '@reach/router';
import React, { useState } from 'react';
import {
  Container,
  Heading,
  Flex,
  Input,
  NavLink,
  Box,
} from 'theme-ui';
import { gql, useQuery } from '@apollo/client';
import Nav from '../components/Nav';
import Form from '../components/Form';

const GET_SONGS = gql`
  query GetSongs {
    songs {
      id
      title
      author
      key
      lyrics
      style
      youtubeId
    }
  }
`;

const GET_PLAYLISTS = gql`
  query GetPlaylists {
    playlists {
      id
      name
    }
  }
`;

export default () => {
  const { loading, error, data, refetch } = useQuery(GET_SONGS);
  const { loading: playlistLoading, error: playlistError, data: playlistData, refetch: refetchPlaylists } = useQuery(GET_PLAYLISTS);

  const ViewSongs = () => {
    const [search, setSearch] = useState('');
    return(
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
              {data.songs
                .filter(song => (search ? song.title.startsWith(search) : true))
                .map(song => (
                  <li key={song.id}>
                    <NavLink as={Link} to={`/songs/${song.id}`} p={2}>
                      {song.title}
                    </NavLink>
                    <NavLink as={Link} to={`/songs/edit/${song.id}`} p={2}>
                      Edit
                    </NavLink>
                  </li>
                ))}
            </ol>
          </>
        )}
      </Flex>
    )
  };

  const ViewPlaylists = () => {
    const [search, setSearch] = useState('');
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {playlistLoading && <div>Loading...</div>}
        {playlistError && <div>{playlistError.message}</div>}
        {!playlistLoading && !playlistError && (
          <>
            <Input
              placeholder="Search for..."
              onChange={term => setSearch(term.target.value)}
            />
            <ol>
              {playlistData.playlists
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

  const viewSong = (id) => {
    const song = data && data.songs.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && song && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary">
              {song.title}
            </Box>
            <Box p={4}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div>{song.author}</div>
                <div>{song.key}</div>
                <div>{song.style}</div>
                <div>{song.lyrics}</div>
              </Flex>
            </Box>
            {song.youtubeId && (
              <iframe
                title={song.title}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${song.youtubeId}`}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            )}
            <NavLink as={Link} to={`/songs/edit/${song.id}`} p={2}>
              Edit
            </NavLink>
          </Flex>
        )}
      </Flex>
    );
  }

  const editSong = (id) => {
    const song = data && data.songs.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && song && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary">
              {song.title}
            </Box>
            <Box p={4}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <div>{song.author}</div>
                <div>{song.key}</div>
                <div>{song.style}</div>
                <div>{song.lyrics}</div>
              </Flex>
            </Box>
            {song.youtubeId && (
              <iframe
                title={song.title}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${song.youtubeId}`}
                frameborder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            )}
            <Form currentItem={song} refetch={refetch}/>
          </Flex>
        )}
      </Flex>
    );
  }

  let Song = ({ songId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/songs/`} p={2}>
          {'<'} Back
        </NavLink>
        {viewSong(songId)}
      </Container>
    );
  }

  let EditSong = ({ songId }) => {
    return (
      <Container>
        <NavLink as={Link} to={`/songs/`} p={2}>
          {'<'} Back
        </NavLink>
        {editSong(songId)}
      </Container>
    );
  }

  const Songs = () => {
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          <Nav />
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Songs
          </Heading>
          <Form refetch={refetch} />
          <ViewSongs />
        </Flex>
      </Container>
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
          <Form refetch={refetchPlaylists} collection="playlists" />
          <ViewPlaylists />
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Songs path="/songs" />
      <Playlists path="/playlists" />
      <Song path="/songs/:songId" />
      <EditSong path="/songs/edit/:songId" />
    </Router>
  );
}
