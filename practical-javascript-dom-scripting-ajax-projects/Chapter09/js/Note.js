/**
 * The Note class represents a single note the user has written.
 */
function Note() {


  /**
   * This is the index in the array that the Note object belongs to where the
   * note is found.  IMPORTANT: This is only set when getNote() in JSNotes is
   * used!  The value should NOT be considered valid at any other time!
   */
  var arrayIndex = null;


  /**
   * This is the tree node object in the treeview representing this Note.
   * IMPORTANT: This is only set when getNote() in JSNotes is
   * used!  The value should NOT be considered valid at any other time!
   */
  var treeNode = null;


  /**
   * The category the note belongs to.
   */
  var noteCategory = null;


  /**
   * The date the note was written.
   */
  var noteDate = null;


  /**
   * The time the note was written.
   */
  var noteTime = null;


  /**
   * The subject of the note.
   */
  var noteSubject = null;


  /**
   * The text of the note.
   */
  var noteText = null;


  /**
   * Field mutator.
   *
   * @param inArrayIndex New value for the field.
   */
  this.setArrayIndex = function(inArrayIndex) {

    arrayIndex = inArrayIndex;

  } // End setArrayIndex().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getArrayIndex = function() {

    return arrayIndex;

  } // End getArrayIndex().


  /**
   * Field mutator.
   *
   * @param inTreeNode New value for the field.
   */
  this.setTreeNode = function(inTreeNode) {

    treeNode = inTreeNode;

  } // End setTreeNode().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getTreeNode = function() {

    return treeNode;

  } // End getTreeNode().


  /**
   * Field mutator.
   *
   * @param inNoteCategory New value for the field.
   */
  this.setNoteCategory = function(inNoteCategory) {

    noteCategory = inNoteCategory;

  } // End setNoteCategory().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getNoteCategory = function() {

    return noteCategory;

  } // End getNoteCategory().


  /**
   * Field mutator.
   *
   * @param inNoteDate New value for the field.
   */
  this.setNoteDate = function(inNoteDate) {

    noteDate = inNoteDate;

  } // End setNoteDate().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getNoteDate = function() {

    return noteDate;

  } // End getNoteDate().


  /**
   * Field mutator.
   *
   * @param inNoteTime New value for the field.
   */
  this.setNoteTime = function(inNoteTime) {

    noteTime = inNoteTime;

  } // End setNoteTime().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getNoteTime = function() {

    return noteTime;

  } // End getTime().


  /**
   * Field mutator.
   *
   * @param inNoteSubject New value for the field.
   */
  this.setNoteSubject = function(inNoteSubject) {

    noteSubject = inNoteSubject;

  } // End setNoteSubject().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getNoteSubject = function() {

    return noteSubject;

  } // End getNoteSubject().


  /**
   * Field mutator.
   *
   * @param inNoteText New value for the field.
   */
  this.setNoteText = function(inNoteText) {

    noteText = inNoteText;

  } // End setNoteText().


  /**
   * Field accessor.
   *
   * @return The current value of the field.
   */
  this.getNoteText = function() {

    return noteText;

  } // End getNoteText().


  /**
   * Overwritten toString() method.
   *
   * @return A meaningful string representation of a Note instance.
   */
  this.toString = function() {

    var s = "Note : { ";
    s += "arrayIndex=" + arrayIndex + ", ";
    s += "treeNode=" + treeNode + ", ";
    s += "noteCategory=" + noteCategory + ", ";
    s += "noteDate=" + noteDate + ", ";
    s += "noteTime=" + noteTime + ", ";
    s += "noteSubject=" + noteSubject + ", ";
    s += "noteText=" + noteText;
    s += " }";
    return s;

  } // End toString().


} // End Note class.
