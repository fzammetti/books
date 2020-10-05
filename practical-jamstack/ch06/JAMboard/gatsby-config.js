module.exports = {

  siteMetadata: {
    title: "JAMboard",
    description: "A Gatsby-based JAMstack whiteboard-like application for collaborative markup of documents",
    author: "Frank W. Zammetti"
  },

  plugins: [

    // For image handling.
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",

    // For Markdown handling.
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "documents",
        path: `${__dirname}/src/documents`
      }
    },
    "gatsby-transformer-remark"

  ]

}
