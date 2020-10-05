import React from "react";
import { graphql } from "gatsby"
import Img from "gatsby-image";
import "./index.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";


/**
 * The IndexPage component itself.
 */
export default class IndexPage extends React.Component {


  /**
   * Constructor.
   */
  constructor(inProps) {

    super(inProps);

    console.log("IndexPage.constructor()");

    // Component state.
    this.state = { dialogVisible : false, username : null };

    // Capture the data passed in.
    this.data = inProps.data;

  } /* End constructor. */


  /**
   * Get username from local storage and insert into state.
   */
  componentDidMount = () => {
    const username = localStorage.getItem("username");
    console.log(`IndexPage.componentDidMount(): username=${username}`);
    const s = { ...this.state };
    s.dialogVisible = (username === null || username.trim() === "");
    this.setState((inState, inProps) => { return s; });
  }; /* End componentDidMount(). */


  /**
   * Handles when the Save button on the add comment dialog is clicked.
   */
  handleDialogSave() {

    console.log("handleDialogSave()");

    // Only react to the button click if they actually entered something.
    if (this.state.username !== null && this.state.username.trim() !== "") {

      console.log(`handleDialogSave(): Saving username=${this.state.username}`);

      // First things first: close the dialog.
      this.state.dialogVisible = false;
      //noinspection JSUnusedLocalSymbols
      this.setState((inState, inProps) => { return this.state; });

      // Finally, store the username.
      localStorage.setItem("username", this.state.username);

    }

  } /* End handleDialogSave(). */


  /**
   * Return the component tree.
   */
  render() {

    console.log("render()", this.state);

    //noinspection JSUnresolvedVariable
    return (
      <div className="outerContainer">

        {/* Enter Username dialog */}
        <Dialog open={this.state.dialogVisible} maxWidth="sm" fullWidth={true}
          disableBackdropClick={true} disableEscapeKeyDown={true}>
          <DialogTitle>You need a username to use JAMboard</DialogTitle>
          <DialogContent>
            <TextField label="Enter username here" fullWidth variant="outlined" required={true} defaultValue=""
              onChange={ (inEvent) => this.setState({ username: inEvent.target.value }) } />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogSave.bind(this)} color="primary" variant="outlined">Save</Button>
          </DialogActions>
        </Dialog>

        <h1>{this.data.site.siteMetadata.title}</h1>
        <h2>{this.data.site.siteMetadata.description}</h2>
        <h3>{this.data.site.siteMetadata.author}</h3>
        <Img fixed={this.data.divider.childImageSharp.fixed} />
        <Img fixed={this.data.splash.childImageSharp.fixed} />
        <br />
        <Img fixed={this.data.divider.childImageSharp.fixed} />
        <div className="documentListLabel">
          Select a document to collaborate on below
        </div>
        {this.data.allMarkdownRemark.edges.map((inItem, inIndex) => {
          //noinspection JSUnresolvedVariable
          return (
            <div key={inIndex} className="documentDiv">
              <a href={inItem.node.frontmatter.slug}
                onMouseOver={(inEvent) => inEvent.target.parentNode.style.backgroundColor="#ff0000"}
                onFocus={() => {}} onBlur={() => {}}
                onMouseOut={(inEvent) => inEvent.target.parentNode.style.backgroundColor="#eaeaea"}
              >
                {inItem.node.frontmatter.title}
              </a>
            </div>
          );
        })}

      </div>
    );

  } /* End render(). */

}; /* End class. */


// Our page query to get all the pertinent information from gatsby-config, the list of documents, and images.
//noinspection JSUnusedGlobalSymbols
export const pageQuery = graphql`
  query {
    splash: file(relativePath: { eq: "splash.png" }) {
      childImageSharp {
        fixed(width: 420, height: 296) { ...GatsbyImageSharpFixed }
      }
    }
    divider: file(relativePath: { eq: "divider.png" }) {
      childImageSharp {
        fixed(width: 600, height: 25) { ...GatsbyImageSharpFixed }
      }
    }
    site {
      siteMetadata {
        title
        description
        author
      }
    }
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          frontmatter {
            title
            slug
          }
        }
      }
    }
  }
`
