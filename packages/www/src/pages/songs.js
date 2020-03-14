import { Router, Link } from '@reach/router';
import React, { useRef, useState } from 'react';
import {
  Container,
  Heading,
  Button,
  Flex,
  Input,
  Textarea,
  Label,
  NavLink,
  Box,
  Select
} from 'theme-ui';
import { gql, useMutation, useQuery } from '@apollo/client';
import Nav from '../components/Nav';

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

const UPDATE_SONG = gql`
  mutation UpdateSong(
    $id: ID!,
    $title: String!
    $author: String!
    $key: String!
    $style: String!
    $lyrics: String!
    $youtubeId: String
  ) {
    updateSong(
      id: $id,
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

export default props => {
  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const keyRef = useRef(null);
  const styleRef = useRef(null);
  const lyricsRef = useRef(null);
  const youtubeIdRef = useRef(null);
  const [addSong] = useMutation(ADD_SONG);
  const [updateSong] = useMutation(UPDATE_SONG);
  const { loading, error, data, refetch } = useQuery(GET_SONGS);
  const onSubmit = async (e, id) => {
    e.preventDefault();
    if (id) {
      console.log({
        id,
        title: titleRef.current.value,
        key: keyRef.current.value,
        author: authorRef.current.value,
        style: styleRef.current.value,
        lyrics: lyricsRef.current.value,
        youtubeId: youtubeIdRef.current.value
      });
      await updateSong({
        variables: {
          id,
          title: titleRef.current.value,
          key: keyRef.current.value,
          author: authorRef.current.value,
          style: styleRef.current.value,
          lyrics: lyricsRef.current.value,
          youtubeId: youtubeIdRef.current.value
        }
      });
    } else {
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
    }
    await refetch();
  };

  const FormLabel = React.forwardRef(({ defaultValue, label, textarea, selectOptions }, ref) => {
    if (selectOptions) {
      return (
        <Label
          sx={{
            display: 'flex',
            marginBottom: 3,
            justifyContent: 'space-between'
          }}
        >
          <span>{label}</span>
          <Select
            ref={ref}
            name={label}
            sx={{
              minWidth: '60px'
            }}
            defaultValue={defaultValue}
          >
            {selectOptions.map(s => (
              <option key={s}>{s}</option>
            ))}
          </Select>
        </Label>
      );
    }
    const InputComponent = textarea ? Textarea : Input;
    return (
      <Label
        sx={{
          display: 'flex',
          marginBottom: 3,
          justifyContent: 'space-between'
        }}
      >
        <span>{label}</span>
        <InputComponent
          ref={ref}
          sx={{ marginLeft: 3, whiteSpace: 'pre-wrap' }}
          name={label}
          defaultValue={defaultValue}
        />
      </Label>
    );
  });

  const keys = [
    'C',
    'C#',
    'Cb',
    'D',
    'D#',
    'Db',
    'E',
    'E#',
    'Eb',
    'F',
    'F#',
    'Fb',
    'G',
    'G#',
    'Gb',
    'A',
    'A#',
    'Ab',
    'B',
    'B#',
    'Bb'
  ];
  const form = (editId = false, currentSong) => (
    <Flex
      as="form"
      onSubmit={e => onSubmit(e, editId)}
      sx={{ flexDirection: 'column' }}
    >
      <FormLabel
        defaultValue={editId ? currentSong.title : undefined}
        label="title"
        ref={titleRef}
      />
      <FormLabel
        label="author"
        ref={authorRef}
        defaultValue={editId ? currentSong.author : undefined}
      />
      <FormLabel
        label="key"
        ref={keyRef}
        selectOptions={keys}
        defaultValue={editId ? currentSong.key : undefined}
      />
      <FormLabel
        label="style"
        ref={styleRef}
        defaultValue={editId ? currentSong.style : undefined}
      />
      <FormLabel
        label="lyrics"
        ref={lyricsRef}
        textarea
        defaultValue={editId ? currentSong.lyrics : undefined}
      />
      <FormLabel
        label="youtube id"
        ref={youtubeIdRef}
        defaultValue={editId ? currentSong.youtubeId : undefined}
      />
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
            {form(id, song)}
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

  let Dash = (props) => {
    return (
      <Container>
        <Flex sx={{ flexDirection: 'column', padding: 3, align: 'right' }}>
          <Nav />
          <Heading as="h1" sx={{ marginBottom: 3 }}>
            Songs
          </Heading>
          {form()}
          <ViewSongs />
        </Flex>
      </Container>
    );
  };

  return (
    <Router>
      <Dash path="/songs" />
      <Song path="/songs/:songId" />
      <EditSong path="/songs/edit/:songId" />
    </Router>
  );
}
