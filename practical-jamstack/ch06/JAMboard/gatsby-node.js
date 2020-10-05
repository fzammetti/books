exports.createPages = ({ actions, graphql }) => {

  const { createPage } = actions;

  const documentTemplate = require.resolve(`./src/templates/documentTemplate.js`);

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `).then(result => {

    if (result.errors) {
      return Promise.reject(result.errors);
    }

    //noinspection JSUnresolvedVariable
    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.slug,
        component: documentTemplate,
        context: {
          slug: node.frontmatter.slug
        }
      })
    })

  })

}
