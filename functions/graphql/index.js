const { ApolloServer, gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    songs: [Song]
  }
  type Song {
    id: ID!
    title: String!
    author: String
    key: String
    style: String
    lyrics: String
    youtubeId: String
  }
  type Mutation {
    addSong(
      title: String!,
      author: String,
      key: String,
      style: String,
      lyrics: String,
      youtubeId: String
    ): Song
    updateSong(
      id: ID!,
      title: String!,
      author: String,
      key: String,
      style: String,
      lyrics: String,
      youtubeId: String
    ): Song
  }
`;

let songIndex = 0;
const songs = {};
const resolvers = {
  Query: {
    songs: () => Object.values(songs)
  },
  Mutation: {
    addSong: (_, {title, author, key, style, lyrics, youtubeId}) => {
      songIndex++;
      const id = songIndex;
      songs[id] = { id, title, author, key, style, lyrics, youtubeId };
      return songs[id];
    },
    updateSong: (_, {id, title, author, key, style, lyrics, youtubeId}) => {
      songs[id] = { id, title, author, key, style, lyrics, youtubeId };
      return songs[id];
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});