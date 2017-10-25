package com.apress.ajaxprojects.theorganizer.daos;


import com.apress.ajaxprojects.theorganizer.Globals;
import com.apress.ajaxprojects.theorganizer.objects.NoteObject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;


/**
 * Data Access Object (DAO) for working with Notes.
 */
public class NoteDAO {


  /**
   * Log instance.
   */
  private static Log log = LogFactory.getLog("com.apress.ajaxprojects");


  /**
   * The DriverManagerDataSource this instance of the DAO will use.
   */
  private DriverManagerDataSource dataSource;


  /**
   * Constructor.
   */
  public NoteDAO() {

    dataSource = new DriverManagerDataSource();
    dataSource.setDriverClassName(Globals.dbDriver);
    dataSource.setUrl(Globals.dbURL);
    dataSource.setUsername(Globals.dbUsername);
    dataSource.setPassword(Globals.dbPassword);

  } // End constructor.


  /**
   * Method to create a new note.
   *
   * @param inNote The NoteObject instance to create.
   */
  public void noteCreate(final NoteObject inNote) {

    log.debug("NoteDAO.noteCreate()...");

    log.info("NoteObject to create : " + inNote);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "INSERT INTO notes (" +
      "createddt, username, subject, text" +
      ") VALUES (" +
      "'" + inNote.getCreatedDT() + "', " +
      "'" + inNote.getUsername()  + "', " +
      "'" + inNote.getSubject()   + "', " +
      "'" + inNote.getText()      + "'" +
      ")");

    log.debug("NoteDAO.noteCreate() Done");

  } // End noteCreate().


  /**
   * Method to Retrieve a note created on a specified day at a specified time
   * for a specified user.
   *
   * @param  inUsername  The username to retrieve note for.
   * @param  inCreatedDT The date and time, expressed as a long (millis) of
   *                     the note to retrieve.
   * @return             The applicable NoteObject instances.
   */
  public NoteObject noteRetrieve(final String inUsername,
    final long inCreatedDT) {

    log.debug("NoteDAT.noteRetrieve()...");

    // Retrieve the note for the specified user.
    log.debug("username/createdDT to retrieve note for : " + inUsername +
      "/" + inCreatedDT);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    Map m = jt.queryForMap(
      "SELECT subject, text FROM notes WHERE username='" + inUsername +
      "' AND createddt='" + inCreatedDT + "'"
    );
    log.info("Map Retrieved  : " + m);
    // Now build a NoteObjects from it to return.
    NoteObject note = new NoteObject();
    note.setCreatedDT(inCreatedDT);
    note.setUsername(inUsername);
    note.setSubject((String)m.get("SUBJECT"));
    note.setText((String)m.get("TEXT"));
    log.info("note : " + note);

    log.debug("NoteDAO.noteRetrieve() Done");
    return note;

  } // End noteRetrieve().


  /**
   * Method to update an existing note.
   *
   * @param inNote The NoteObject instance to update.
   */
  public void noteUpdate(final NoteObject inNote) {

    log.debug("NoteDAO.noteUpdate()...");

    log.info("NoteObject to update : " + inNote);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "UPDATE notes SET " +
      "subject='"         + inNote.getSubject()   + "', "    +
      "text='"            + inNote.getText()      + "' "     +
      "WHERE username='"  + inNote.getUsername()  + "' AND " +
      "createddt='"       + inNote.getCreatedDT() + "'"
    );
    log.debug("NoteDAO.noteUpdate() Done");

  } // End noteUpdate().


  /**
   * Method to delete a note.
   *
   * @param inNote The NoteObject instance to delete.
   */
  public void noteDelete(final NoteObject inNote) {

    log.debug("NoteDAO.noteDelete()...");

    log.info("NoteObject to delete : " + inNote);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    jt.execute(
      "DELETE FROM notes " +
      "WHERE username='" + inNote.getUsername()  + "' AND " +
      "createddt='"      + inNote.getCreatedDT() + "'"
    );
    log.debug("NoteDAO.noteDelete() Done");

  } // End noteDelete().


  /**
   * Method to retrieve a List of notes for the specified user.
   *
   * @param  inUsername The username to retrieve notes for.
   * @return            A list of NoteObject instances.
   */
  public List noteList(final String inUsername) {

    log.debug("NoteDAO.noteList()...");

    // Retrieve the list of notes for the specified user.
    log.debug("username to retrieve notes for : " + inUsername);
    JdbcTemplate jt = new JdbcTemplate(dataSource);
    List notes = jt.queryForList(
      "SELECT createddt, subject FROM notes WHERE username='" + inUsername + "'"
    );
    log.info("Retrieved List : " + notes);
    // Now build a List of NoteObjects from it to return.
    List notesOut = new ArrayList();
    for (Iterator it = notes.iterator(); it.hasNext();) {
      Map m = (Map)it.next();
      NoteObject note = new NoteObject();
      note.setUsername(inUsername);
      note.setCreatedDT(((Long)m.get("CREATEDDT")).longValue());
      note.setSubject((String)m.get("SUBJECT"));
      notesOut.add(note);
    }
    log.info("noteOut List : " + notesOut);

    log.debug("NoteDAO.noteList() Done");
    return notesOut;

  } // End noteList().


} // End class.
