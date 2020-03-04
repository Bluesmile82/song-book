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
        start_url: `/songs`,
        display: `standalone`,
        icon: `src/images/icon.png`
      }
    },
    [`gatsby-plugin-offline`]
  ]
};