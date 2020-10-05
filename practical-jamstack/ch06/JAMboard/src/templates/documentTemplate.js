import React from "react"
import { graphql } from "gatsby"
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import * as StorageManager from "../StorageManager.js";


// The document's markdownRemark and frontmatter data elements, as returned by the page query.  Populated in component
// de-facto render() method.
let mr = null;
let fm = null;


// The key of the currently displayed marker, if any.
let currentMarkerKey = null;


// The text of the currently displayed marker, if any.  We need this because we can't make render() async, which means
// we can't call StorageManager.getMarkerFromStorage() like was done in the last chapter.
let currentMarkerText = "";


// The state of the component.  While state is most usually included in the component class itself, in this case
// it's externalized so that all of this code can get to it as needed.
let state = {
  addCommentButtonDisabled : true, addCommentDialogVisible : false,
  spinnerVisible : false, newComment : "", comments : [ ]
};


/**
 * The Template component itself.
 */
export default class Template extends React.Component {


  /**
   * Constructor.
   */
  constructor(inProps) {

    super(inProps);

    console.log("Template.constructor()");

    // Get shortened reference to sub-elements of data returned by query and cache at module level.
    //noinspection JSUnresolvedVariable
    mr = inProps.data.markdownRemark;
    fm = mr.frontmatter;
    console.log("Template.constructor(): mr", mr);
    console.log("Template.constructor(): fm", fm);

    // These functions mutate state, so they have to be bound to this component or they won't be able to
    // call setState().
    global.showComments = global.showComments.bind(this);
    global.maskScreen = global.maskScreen.bind(this);
    addComment = addComment.bind(this);
    handleDialogClose = handleDialogClose.bind(this);

  } /* End constructor. */


  /**
   * When the component mounts, load all markers, if any, and "linkify" them.
   */
  componentDidMount = () => loadMarkers();


  /**
   * Return the component tree.
   */
  render() {

    console.log("render()", state);

    return (
      <div style={{ display : "flex", flexDirection : "column", height : "96vh" }}>
        <Backdrop style={{ color : "#ffffff", zIndex : "999" }} open={state.spinnerVisible}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* Add comment dialog. */}
        <Dialog open={state.addCommentDialogVisible} onClose={handleDialogClose} maxWidth="lg" fullWidth={true}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <TextField label="Enter comment here" fullWidth variant="outlined"
              onChange={(inEvent) => state.newComment = inEvent.target.value} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
            <Button onClick={handleDialogSave} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Control bar. */}
        <Paper elevation={5} style={{ margin : "10px", padding : "4px", height : "46px" }}>
          <Grid container>
            <Grid item>
              <Button variant="contained" color="primary" style={{ marginRight : "10px" }}
                onClick={() => window.location = "/"}>
                Document List
              </Button>
              <Button variant="contained" color="secondary" style={{ marginRight : "10px" }} onClick={addMarker}>
                Add Marker
              </Button>
              <Button variant="contained" style={{ marginRight : "10px" }}
                onClick={addComment} disabled={state.addCommentButtonDisabled}>
                Add Comment
              </Button>
              {fm.title}&nbsp;({fm.id}) - {fm.date}
            </Grid>
          </Grid>
        </Paper>

        {/* Document area. */}
        <Paper elevation={5} style={{ margin : "10px", padding : "4px", height : "70vh", overflow : "auto" }}>
          <Grid container>
            <Grid item>
              <div dangerouslySetInnerHTML={{ __html : mr.html }} />
            </Grid>
          </Grid>
        </Paper>

        {/* Comments. */}
        <Paper elevation={5} style={{ margin : "10px", padding : "4px", height : "30vh", overflow : "auto" }}>
          <div style={{ fontWeight : "bold", position : "sticky", top : "2px", padding : "10px",
              backgroundColor : "#eaeaea", zIndex : 99 }}>
            { currentMarkerText }
          </div>
          <Grid container>
            <Grid item xs>
              <List>
                { currentMarkerKey !== null && state.comments.length === 0 ?
                    <ListItem key={0}><ListItemText primary="No comments for this marker" /></ListItem>
                  :
                  state.comments.map((inItem, inIndex) => { return (
                    <ListItem key={inIndex}>
                      <ListItemText primary={inItem.comment}
                        secondary={`${inItem.author} - ${inItem.dateTime}`} />
                    </ListItem>
                  )})
                }
              </List>
            </Grid>
          </Grid>
        </Paper>

      </div>
    );

  } /* End render(). */


} /* End class. */


/**
 * Loads all markers for the document, which really means "linkify" them all.
 */
async function loadMarkers() {

  console.log("loadMarkers()");

  const markerKeys = await StorageManager.getAllMarkerKeysFromStorage(fm.id);
  console.log("loadMarkers(): markerKeys", markerKeys);
  markerKeys.forEach(function(inKey) {
    console.log(`loadMarkers(): inKey=${inKey}`);
    linkifyMarker(inKey);
  });

} /* End loadMarkers(). */


/**
 * Gets the current range, if any, saves it as a marker to persistent storage, and clears the range.
 */
async function addMarker() {

  console.log("addMarker()");

  // Get the selection range, if any abort if none.
  let range = null;
  if (window.getSelection().rangeCount !== 0) {
    range = window.getSelection().getRangeAt(0);
  }
  if (!range) { return; }
  console.log("addMarker(): range", range);

  // Construct the marker object to save.
  //noinspection JSUnresolvedVariable
  const marker = {
    startOffset : range.startOffset,
    endOffset : range.endOffset,
    parentNodeData : range.startContainer.data,
    markerText : range.toString(),
    comments : [ ]
  };
  console.log("addMarker(): marker", marker);

  // Save the marker.  The key is a unique ID formed with the document's ID and a timestamp (this means there is the
  // potential for ID collisions, but the odds are pretty low... but ideally, instead of a timestamp, a GUID would
  // be produced - sounds like a "suggested exercise" to me!).
  const key = `${fm.id}${new Date().getTime()}`;
  await StorageManager.saveMarkerToStorage(key, marker, false);

  // Clear the range.
  document.getSelection().removeAllRanges();

  // Finally, "linkify" the marker.
  await linkifyMarker(key);

} /* End addMarker(). */


/**
 * Inserts a marker onto the page ("linkifying" it, so to speak).
 *
 * @param inKey The key of the marker to insert.
 */
async function linkifyMarker(inKey) {

  console.log("linkifyMarker()", inKey);

  // Load marker from persistent storage, abort if not found.
  let marker = await StorageManager.getMarkerFromStorage(inKey);
  console.log("linkifyMarker(): marker", marker);

  // Get list of all text nodes on the page.
  const textNodes = [];
  let node = document.body.childNodes[0];
  while (node != null) {
    if (node.nodeType === 3) { textNodes.push(node); }
    if (node.hasChildNodes()) {
      node = node.firstChild;
    } else {
      while (node.nextSibling == null && node !== document.body) {
        node = node.parentNode;
      }
      node = node.nextSibling;
    }
  }

  // Find the parent text node of the marker based on its data content.
  let parentNode = null;
  for (let i = 0; i < textNodes.length; i++) {
    if (textNodes[i].data === marker.parentNodeData) {
      parentNode = textNodes[i];
      break;
    }
  }

  // Construct the range.
  const range = document.createRange();
  range.setStart(parentNode, marker.startOffset);
  range.setEnd(parentNode, marker.endOffset);

  // Linkify it.
  const link = document.createElement("a");
  link.setAttribute("href", "#");
  link.setAttribute("onClick", `showComments("${inKey}");`);
  range.surroundContents(link);

  // Clear the range.
  document.getSelection().removeAllRanges();

} /* End linkifyMarker(). */


/**
 * Shows the comments associated with a clicked marker.  Note that this is appended to the window object so that it's
 * easily accessible when we add marker links.  Note the difference: this needs to be accessible to the code attached
 * to the link that's added, and it won't be usually, so we add it to the window object so it's available.
 *
 * @param inKey The key of the marker.
 */
global.showComments = async function(inKey) {

  console.log("showComments()", inKey);

  // Store off the marker's key.
  currentMarkerKey = inKey;

  // Get the data for this marker from storage.
  const marker = await StorageManager.getMarkerFromStorage(inKey);
  console.log("showComments(): markedData", marker);

  // Make sure we show the marker text in the comments section header.
  currentMarkerText = marker.markerText;

  // Clear the comments array in state, fill it with the comments for this marker, reverse it so newest shows on top,
  // and tell React about the update.
  state.comments.length = 0;
  state.addCommentButtonDisabled = false;
  marker.comments.forEach(inValue => state.comments.push(inValue) );
  state.comments.reverse();
  console.log("showComments(): state", state);
  //noinspection JSUnusedLocalSymbols
  this.setState((inState, inProps) => { return state; });

} /* End showComments(). */


/**
 * Adds a comment to the current marker.
 */
function addComment() {

  console.log("addComment()");

  // Toggle the dialog's visibility flag, clear any previous newComment, and tell React about the update.
  state.addCommentDialogVisible = true;
  state.newComment = "";
  //noinspection JSUnusedLocalSymbols
  this.setState((inState, inProps) => { return state; });

} /* End addComment(). */


/**
 * Handles when the add comment dialog is closed, either by clicking ESC or the Cancel button.
 */
function handleDialogClose() {

  console.log("handleDialogClose()");

  // Toggle the dialog's visibility flag and tell React about the update.
  state.addCommentDialogVisible = false;
  //noinspection JSUnusedLocalSymbols
  this.setState((inState, inProps) => { return state; });

} /* End handleDialogClose(). */


/**
 * Handles when the Save button on the add comment dialog is clicked.
 */
async function handleDialogSave() {

  console.log("handleDialogSave()");

  // First things first: close the dialog.
  handleDialogClose();

  // Abort if nothing was entered.
  if (state.newComment === null || state.newComment.trim() === "") { return; }

  // Now we have to add the comment to this marker, so pull it from storage, add the comment, then save it again.
  const marker = await StorageManager.getMarkerFromStorage(currentMarkerKey);
  marker.comments.push({
    author : localStorage.getItem("username"),
    dateTime : new Date().toLocaleDateString(),
    comment : state.newComment
  });
  await StorageManager.saveMarkerToStorage(currentMarkerKey, marker, true);

  // Finally, re-show the comments so the new one is displayed too.
  await global.showComments(currentMarkerKey);

} /* End handleDialogSave(). */


/**
 * Mask (or unmask) the screen for server calls.
 *
 * @param inMask True to mask the screen, false to unmask it.
 */
global.maskScreen = function(inMask) {

  state.spinnerVisible = inMask;
  //noinspection JSUnusedLocalSymbols
  this.setState((inState, inProps) => { return state; });

} /* End maskScreen(). */


// Our page query to get all the pertinent information about the document we're marking up.
export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        id
        date(formatString: "MM/DD/YYYY")
        slug
        title
      }
    }
  }
`
