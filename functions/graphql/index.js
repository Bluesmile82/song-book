const { ApolloServer, gql } = require('apollo-server-lambda');
const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNA });

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

const resolvers = {
  Query: {
    songs: async (parent, args, { user }) => {
      if (!user) {
        return [];
      } else {
        const results = await client.query(
          q.Paginate(q.Match(q.Index('songs_by_user'), user))
        );
        return results.data.map(([ref, title, youtubeId]) => ({
          id: ref.id,
          title,
          youtubeId
        }));
      }
    }
  },
  Mutation: {
    addSong: async (_, {title, author, key, style, lyrics, youtubeId}, { user }) => {
      if (!user) {
        throw new Error("Must be authenticated to create a song")
      }
      const results = await client.query(
        q.Create(q.Collection("songs"), {
          data: {
            title,
            author,
            key,
            style,
            lyrics,
            youtubeId,
            owner: user
          }
        })
      );
      return {
        ...results.data,
        id: results.ref.id
      };
    },
    updateSong: async (_, {id, title, author, key, style, lyrics, youtubeId}) => {
      if (!user) {
        throw new Error("Must be authenticated to create a song")
      }
       const results = await client.query(
        q.Update(q.Ref(q.Collection("songs"), id), {
          data: {
            title,
            author,
            key,
            style,
            lyrics,
            youtubeId
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
  context: ({ context }) => {
    if (context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    } else {
      return {};
    }
  },
  playground: true,
  introspection: true
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true
  }
});