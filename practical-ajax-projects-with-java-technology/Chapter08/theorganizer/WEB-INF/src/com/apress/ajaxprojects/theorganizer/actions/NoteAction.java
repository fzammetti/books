package com.apress.ajaxprojects.theorganizer.actions;


import com.apress.ajaxprojects.theorganizer.daos.NoteDAO;
import com.apress.ajaxprojects.theorganizer.objects.AccountObject;
import com.apress.ajaxprojects.theorganizer.objects.NoteObject;
import com.opensymphony.webwork.interceptor.SessionAware;
import com.opensymphony.xwork.Action;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


/**
 * Action providing CRUD services for working with Notes.
 */
public class NoteAction implements Action, SessionAware {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The session map for this request.
   */
  private Map session;


  /**
   * The createdDT field value of the note to retrieve.
   */
  private long createdDT;


  /**
   * The NoteObject retrieved.
   */
  private NoteObject note;


  /**
   * The collection of notes for the user retrieved from the database.
   */
  private List notes;


  /**
   * The subject of the note.
   */
  private String subject;


  /**
   * The text of the note.
   */
  private String text;


  /**
   * Mutator for session.
   *
   * @param inSession New value for session.
   */
  public void setSession(final Map inSession) {

    session = inSession;

  } // End setSession().


  /**
   * Mutator for createdDT.
   *
   * @param inCreatedDT New value for createdDT.
   */
  public void setCreatedDT(final long inCreatedDT) {

    createdDT = inCreatedDT;

  } // End setCreatedDT().


  /**
   * Accessor for createdDT.
   *
   * @return Value of createdDT.
   */
  public long getCreatedDT() {

    return createdDT;

  } // End getCreatedDT().


  /**
   * Accessor for note.
   *
   * @return Value of note.
   */
  public NoteObject getNote() {

    return note;

  } // End getNote().


  /**
   * Accessor for notes.
   *
   * @return Value of notes.
   */
  public List getNotes() {

    return notes;

  } // End getNotes().


  /**
   * Mutator for subject.
   *
   * @param inSubject New value for subject.
   */
  public void setSubject(final String inSubject) {

    subject = inSubject;

  } // End setSubject().


  /**
   * Accessor for subject.
   *
   * @return Value of subject.
   */
  public String getSubject() {

    return subject;

  } // End getSubject().


  /**
   * Mutator for text.
   *
   * @param inText New value for text.
   */
  public void setText(final String inText) {

    text = inText;

  } // End setText().


  /**
   * Accessor for text.
   *
   * @return Value of text.
   */
  public String getText() {

    return text;

  } // End getText().


  /**
   * execute() (to fulfill interface contract).
   *
   * @return null.
   */
  public String execute() {

    return null;

  } // End execute().


  /**
   * Create new note.
   *
   * @return result.
   */
  public String create() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("NoteAction.create()...");

    // Display incoming request parameters.
    log.info("NoteAction : " + this.toString());

    // Call on the NoteDAO to save the NoteObject instance we are about to
    // create and populate.
    NoteObject nte = getNoteObject();
    NoteDAO    dao = new NoteDAO();
    // Need to override the createdDT that was populated by getNoteObject().
    nte.setCreatedDT(new Date().getTime());
    dao.noteCreate(nte);

    log.debug("NoteAction.create() Done");

    return Action.SUCCESS;

  } // End create().


  /**
   * Retrieve note for editing.
   *
   * @return result.
   */
  public String retrieve() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("NoteAction.retrieve()...");

    // Display incoming request parameters.
    log.info("NoteAction : " + this.toString());

    // Retrieve the note for the specified user created on the specified date
    // at the specified time.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    NoteDAO       dao      = new NoteDAO();
    note = dao.noteRetrieve(username, createdDT);
    log.debug("NoteAction : " + this.toString());

    log.debug("NoteAction.retrieve() Done");

    return Action.SUCCESS;

  } // End retrieve().


  /**
   * Update existing note.
   *
   * @return result.
   */
  public String update() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("NoteAction.update()...");

    // Display incoming request parameters.
    log.info("NoteAction : " + this.toString());

    // Call on the NoteDAO to save the NoteObject instance we are about to
    // create and populate.
    NoteObject nte = getNoteObject();
    NoteDAO    dao  = new NoteDAO();
    dao.noteUpdate(nte);

    log.debug("NoteAction.update() Done");

    return Action.SUCCESS;

  } // End update().


  /**
   * Delete existing note.
   *
   * @return result.
   */
  public String delete() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("NoteAction.delete()...");

    // Display incoming request parameters.
    log.info("NoteAction : " + this.toString());

    // Call on the NoteDAO to delete the NoteObject instance we are about to
    // create and populate.
    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    NoteDAO       dao      = new NoteDAO();
    NoteObject    nte      = new NoteObject();
    nte.setCreatedDT(createdDT);
    nte.setUsername(username);
    dao.noteDelete(nte);

    log.debug("NoteAction.delete() Done");

    return Action.SUCCESS;

  } // End delete().


  /**
   * List notes.
   *
   * @return result.
   */
  public String list() {

    log.info("\n\n----------------------------------------------------------");

    log.debug("NoteAction.list()...");

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    NoteDAO       dao      = new NoteDAO();
    notes = dao.noteList(username);
    log.debug("NoteAction : " + this.toString());

    log.debug("NoteAction.list() Done");

    return Action.SUCCESS;

  } // End list().


  /**
   * This method is called form both save() and update() to get a populated
   * NoteObject instance.  This saves a lot of duplicate code in both
   * methods.
   *
   * @return The fully-populated NoteObject.
   */
  private NoteObject getNoteObject() {

    AccountObject account  = (AccountObject)session.get("account");
    String        username = account.getUsername();
    NoteObject    nte      = new NoteObject();
    nte.setCreatedDT(createdDT);
    nte.setUsername(username);
    nte.setSubject(subject);
    nte.setText(text);
    return nte;

  } // End getNoteObject();


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
