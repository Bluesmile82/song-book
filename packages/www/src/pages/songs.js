import { Router, Link, navigate } from '@reach/router';
import React, { useContext, useRef, useState } from 'react';
import { IdentityContext } from '../../identity-context';
import {
  Container,
  Heading,
  Button,
  Flex,
  Input,
  Textarea,
  Label,
  NavLink,
  Box
} from 'theme-ui';
import { gql, useMutation, useQuery } from '@apollo/client';

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

  const FormLabel = React.forwardRef(({ label, textarea }, ref) => {
    const InputComponent = textarea ? Textarea : Input;
    return (
      <Label sx={{ display: 'flex', marginBottom: 3 }}>
        <span>{label}</span>
        <InputComponent ref={ref} sx={{ marginLeft: 3 }} name={label} />
      </Label>
    );
  });

  const nav = (
    <Flex as="nav">
      <NavLink as={Link} to="/songs" p={2}>
        Songs
      </NavLink>
      {user && (
        <NavLink href="#!" to="/songs" p={2}>
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
  );

  const form = (
    <Flex as="form" onSubmit={onSubmit} sx={{ flexDirection: 'column' }}>
      <FormLabel label="title" ref={titleRef} />
      <FormLabel label="author" ref={authorRef} />
      <FormLabel label="key" ref={keyRef} />
      <FormLabel label="style" ref={styleRef} />
      <FormLabel label="lyrics" ref={lyricsRef} textarea />
      <FormLabel label="youtube id" ref={youtubeIdRef} />
      <Button sx={{ marginLeft: 1 }}>Submit</Button>
    </Flex>
  );
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
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${song.youtubeId}`}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <NavLink as={Link} to={`/songs/edit/${song.id}`} p={2}>
              Edit
            </NavLink>
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

  let Dash = (props) => {
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          {nav}
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Songs
          </Heading>
          {form}
          <ViewSongs/>
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Dash path="/songs" />
      <Song path="/songs/:songId" />
    </Router>
  );
}