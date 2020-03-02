const { ApolloServer, gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Query {
    songs: [Song]
  }
  type Song {
    id: ID!
    name: String!
    youtubeId: String
  }
  type Mutation {
    addSong(): Song
    updateSongDone(id: ID!): Song
  }
`;

let songIndex = 0;
const songs = {};
const resolvers = {
  Query: {
    songs: () => Object.values(songs)
  },
  Mutation: {
    addSong: (_, {name, youtubeId}) => {
      songIndex++;
      const id = `key-${songIndex}`;
      songs[id] = { id, name, youtubeId };
      return songs[id];
    }
  },
  updateSongDone: (_, {id, name, youtubeId}) => {
    songs[id] = { id, name, youtubeId };
    return songs[id];
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.handler = server.createHandler();