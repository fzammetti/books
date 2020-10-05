/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// Need this to avoid build error about window not being defined.
// This tells Webpack to ignore the Phaser module during SSR.
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module : {
        rules : [
          { test : /phaser/, use : loaders.null() }
        ]
      }
    })
  }
};
