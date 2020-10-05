module.exports = {
  plugins: [
    "gatsby-transformer-json",
    {
      resolve : "gatsby-source-filesystem",
      options : {
        name : "data",
        path : `${__dirname}/src/levels`
      }
    }
  ]
}
