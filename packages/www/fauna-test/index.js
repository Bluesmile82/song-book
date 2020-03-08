require('dotenv').config();
const faunadb = require("faunadb");
const q = faunadb.query;

const client = new faunadb.Client({ secret: process.env.FAUNA });
async function run() {
  try {
    // const results = await client.query(
    //   q.Create(q.Collection("songs"), {
    //     data: {
    //       title: "la masdf sdfm sddsde",
    //       youtubeId: "thisisisiannsnid",
    //       owner: "other"
    //     }
    //   })
    // );
    const results = await client.query(
      q.Paginate(q.Match(q.Index("songs_by_user"), "other"))
    )
    console.log(results);
  } catch (error) {

    console.log(error);
  }
};

run();