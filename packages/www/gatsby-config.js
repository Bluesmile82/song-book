module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-create-client-paths`,
      options: { prefixes: [`/app/*`] }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Song Book`,
        short_name: `SongBook`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#4444ff`,
        display: `standalone`
      }
    },
    [`gatsby-plugin-offline`]
  ]
};