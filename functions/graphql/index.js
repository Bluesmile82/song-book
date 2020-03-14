const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA });

const typeDefs = gql`
  type Query {
    songs: [Song]
    playlists: [Playlist]
  }
  type Playlist {
    id: ID!
    name: String!
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
    playlists: [Playlist]
  }
  type Mutation {
    addPlaylist(name: String!): Playlist
    addSong(
      title: String!
      author: String
      key: String
      style: String
      lyrics: String
      youtubeId: String
      playlists: [ID]
    ): Song
    updatePlaylist(id: ID!, name: String, songs: [ID]): Playlist
    updateSong(
      id: ID!
      title: String
      author: String
      key: String
      style: String
      lyrics: String
      youtubeId: String
      playlists: [ID]
    ): Song
  }
`;

const resolvers = {
  Query: {
    songs: async () => {
      const results = await client.query(q.Paginate(q.Match(q.Index('songs'))));
      if (!results) return [];
      return results.data.map(d => {
        const [
          ref,
          title,
          author,
          key,
          style,
          lyrics,
          youtubeId,
          playlists
        ] = d;
        return {
          id: ref.id,
          title,
          author,
          key,
          style,
          lyrics,
          youtubeId,
          playlists
        };
      });
    }
  },
  Query: {
    playlists: async () => {
      const results = await client.query(q.Paginate(q.Match(q.Index('playlists'))));
      if (!results) return [];
      return results.data.map(d => {
        const [
          ref,
          name,
          songs
        ] = d;
        return {
          id: ref.id,
          name,
          songs
        };
      });
    }
  },
  Mutation: {
    addPlaylist: async (_, { name }) => {
      const results = await client.query(
        q.Create(q.Collection('playlists'), {
          data: {
            name
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    addSong: async (
      _,
      { title, author, key, style, lyrics, youtubeId, playlists }
    ) => {
      const results = await client.query(
        q.Create(q.Collection('songs'), {
          data: {
            title,
            author,
            key,
            style,
            lyrics,
            youtubeId,
            playlists
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    updatePlaylist: async (_, { id, name, songs }) => {
      const updatedSongs = await client.query(
        q.Paginate(q.Match(q.Index('songs_by_ref'), songs))
      );
      const results = await client.query(
        q.Update(q.Ref(q.Collection('playlists'), id), {
          data: {
            name,
            songs
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    updateSong: async (
      _,
      { id, title, author, key, style, lyrics, youtubeId, playlists }
    ) => {
      const updatedPlaylists = await client.query(
        q.Paginate(q.Match(q.Index('playlists_by_name'), playlists))
      );
      const results = await client.query(
        q.Update(q.Ref(q.Collection('songs'), id), {
          data: {
            title,
            author,
            key,
            style,
            lyrics,
            youtubeId,
            playlists: updatedPlaylists.data
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
});

exports.typeDefs = typeDefs;
exports.resolvers = resolvers;

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});