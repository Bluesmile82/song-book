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
      playlists {
        id
        name
      }
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
  const {
    loading: playlistsLoading,
    error: playlistsError,
    data: playlistsData,
    refetch: playlistsRefetch
  } = useQuery(GET_PLAYLISTS);

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
              {data.songs && data.songs
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

  const viewSong = (id) => {
    const song = data && data.songs.find(s => s.id === id);
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        {loading && <div>Loading...</div>}
        {error && <div>{error.message}</div>}
        {!loading && !error && song && (
          <Flex sx={{ flexDirection: 'column' }}>
            <Box p={2} color="white" bg="primary" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>
                <h1>{song.title}</h1>
                <div>{song.author}</div>
              </span>
              <div>{song.style}</div>
              <div>{song.key}</div>
            </Box>
            <Box p={4}>
              <Flex
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Box sx={{ whiteSpace: 'pre-line' }}>{song.lyrics}</Box>
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
    const playlists = (playlistsLoading || playlistsError) ? [] : playlistsData.playlists;
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
            <Form currentItem={song} refetch={refetch} playlists={playlists} />
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
    const playlists =
      playlistsLoading || playlistsError ? [] : playlistsData.playlists;
    console.log('s', playlistsError, playlistsLoading, playlistsData);
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          <Nav />
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Songs
          </Heading>
          <Form refetch={refetch} playlists={playlists}/>
          <ViewSongs />
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Songs path="/songs" />
      <Song path="/songs/:songId" />
      <EditSong path="/songs/edit/:songId" />
    </Router>
  );
}
