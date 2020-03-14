import React, { useRef }  from 'react';
import { gql, useMutation } from '@apollo/client';

import {
  Button,
  Flex,
  Input,
  Textarea,
  Label,
  Select
} from 'theme-ui';

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
      title: $title
      author: $author
      key: $key
      style: $style
      lyrics: $lyrics
      youtubeId: $youtubeId
    ) {
      id
    }
  }
`;

const ADD_PLAYLIST = gql`
  mutation AddPlaylist(
    $name: String!
  ) {
    addSong(
      name: $name
    ) {
      id
    }
  }
`;

const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist(
    $id: ID!
    $name: String!
  ) {
    updateSong(
      id: $id
      name: $name
    ) {
      id
    }
  }
`;

const UPDATE_SONG = gql`
  mutation UpdateSong(
    $id: ID!
    $title: String!
    $author: String!
    $key: String!
    $style: String!
    $lyrics: String!
    $youtubeId: String
  ) {
    updateSong(
      id: $id
      title: $title
      author: $author
      key: $key
      style: $style
      lyrics: $lyrics
      youtubeId: $youtubeId
    ) {
      id
    }
  }
`;

const FormLabel = React.forwardRef(
  ({ defaultValue, label, textarea, selectOptions }, ref) => {
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
  }
);


const Form = ({ currentItem, refetch, collection }) => {

  const { id } = currentItem || {};

  const nameRef = useRef(null);

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const keyRef = useRef(null);
  const styleRef = useRef(null);
  const lyricsRef = useRef(null);
  const youtubeIdRef = useRef(null);

  const [addSong] = useMutation(ADD_SONG);
  const [updateSong] = useMutation(UPDATE_SONG);

  const [addPlaylist] = useMutation(ADD_PLAYLIST);
  const [updatePlaylist] = useMutation(UPDATE_PLAYLIST);

  const onSubmit = async (e, id) => {
    e.preventDefault();
    if (id) {
      if (collection === 'playlists') {
        await updatePlaylist({
          variables: {
            id,
            name: nameRef.current.value,
          }
        });
      } else {
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
      }
    } else {
      if (collection === 'playlists') {
        await addPlaylist({
          variables: {
            name: nameRef.current.value
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
    }
    await refetch();
  };

  return (
    <Flex
      as="form"
      onSubmit={e => onSubmit(e, id)}
      sx={{ flexDirection: 'column' }}
    >
      {collection === 'playlists' ? (
          <>
            <FormLabel
              defaultValue={currentItem ? currentItem.title : undefined}
              label="Name"
              ref={nameRef}
            />
          </>
        )
        : (
          <>
            <FormLabel
              defaultValue={currentItem ? currentItem.title : undefined}
              label="title"
              ref={titleRef}
            />
            <FormLabel
              label="author"
              ref={authorRef}
              defaultValue={currentItem ? currentItem.author : undefined}
            />
            <FormLabel
              label="key"
              ref={keyRef}
              selectOptions={keys}
              defaultValue={currentItem ? currentItem.key : undefined}
            />
            <FormLabel
              label="style"
              ref={styleRef}
              defaultValue={currentItem ? currentItem.style : undefined}
            />
            <FormLabel
              label="lyrics"
              ref={lyricsRef}
              textarea
              defaultValue={currentItem ? currentItem.lyrics : undefined}
            />
            <FormLabel
              label="youtube id"
              ref={youtubeIdRef}
              defaultValue={currentItem ? currentItem.youtubeId : undefined}
            />
          </>
          )
        }
        <Button sx={{ marginLeft: 1 }}>Submit</Button>
    </Flex>
  );
}

export default Form;
