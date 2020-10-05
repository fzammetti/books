module.exports = {
  plugins: [
    "gatsby-transformer-json",
    {
      resolve : "gatsby-source-filesystem",
      options : {
        name : "data",
        path : `${__dirname}/src/levels`
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "JAMJumper",
        short_name: "JAMJumper",
        start_url: "/",
        background_color: "#6b37bf",
        theme_color: "#6b37bf",
        display: "standalone",
        icon: "src/images/icon.png",
        crossOrigin: "use-credentials",
      }
    },
    {
      resolve: "gatsby-plugin-offline",
      options: {
        debug : true
      }
    }
  ]
}
