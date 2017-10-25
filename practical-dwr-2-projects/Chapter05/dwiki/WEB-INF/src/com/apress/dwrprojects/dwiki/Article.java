package com.apress.dwrprojects.dwiki;


import java.sql.Timestamp;


/**
 * A bean representing an Article.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class Article {


  /**
   * Flag indicating whether the article exists (true) or not (false).  This is
   * needed because when an article is clicked, but it hasn't yet been created,
   * an instance of this class is still returned to the UI, but it needs to
   * know that the article doesn't actually exist yet so that the Edit link
   * can be disabled.
   */
  private boolean articleExists = true;


  /**
   * The title of the article.  This is effectively the key of the Articles
   * database table.
   */
  private String title;


  /**
   * The date/time the article was originally created.
   */
  private Timestamp created;


  /**
   * The username of the user who initially created the article.
   */
  private String creator;


  /**
   * The text of the article.
   */
  private String text;


  /**
   * Date/time this article was last edited.
   */
  private Timestamp lastEdited;


  /**
   * The username of the user who last edited this article.
   */
  private String lastEditedBy;


  /**
   * The username of the user who has the article locked for editing.
   */
  private String lockedBy;


  /**
   * Date/time this article was locked for editing.
   */
  private Timestamp lockTime;


  /**
   * Mutator for articleExists.
   *
   * @param inArticleExists New value for articleExists.
   */
  public void setArticleExists(final boolean inArticleExists) {

    articleExists = inArticleExists;

  } // End setArticleExists().


  /**
   * Accessor for articleExists.
   *
   * @return Value of articleExists.
   */
  public boolean getArticleExists() {

    return articleExists;

  } // End getArticleExists().


  /**
   * Mutator for title.
   *
   * @param inTitle New value for title.
   */
  public void setTitle(final String inTitle) {

    title = inTitle;

  } // End setTitle().


  /**
   * Accessor for title.
   *
   * @return Value of title.
   */
  public String getTitle() {

    return title;

  } // End getTitle().


  /**
   * Mutator for created.
   *
   * @param inCreated New value for created.
   */
  public void setCreated(final Timestamp inCreated) {

    created = inCreated;

  } // End setCreated().


  /**
   * Accessor for created.
   *
   * @return Value of created.
   */
  public Timestamp getCreated() {

    return created;

  } // End getCreated().


  /**
   * Mutator for creator.
   *
   * @param inCreator New value for creator.
   */
  public void setCreator(final String inCreator) {

    creator = inCreator;

  } // End setCreator().


  /**
   * Accessor for creator.
   *
   * @return Value of creator.
   */
  public String getCreator() {

    return creator;

  } // End getCreator().


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
   * Mutator for lastEdited.
   *
   * @param inLastEdited New value for lastEdited.
   */
  public void setLastEdited(final Timestamp inLastEdited) {

    lastEdited = inLastEdited;

  } // End setLastEdited().


  /**
   * Accessor for lastEdited.
   *
   * @return Value of lastEdited.
   */
  public Timestamp getLastEdited() {

    return lastEdited;

  } // End getLastEdited().


  /**
   * Mutator for lastEditedBy.
   *
   * @param inLastEditedBy New value for lastEditedBy.
   */
  public void setLastEditedBy(final String inLastEditedBy) {

    lastEditedBy = inLastEditedBy;

  } // End setLastEditedBy().


  /**
   * Accessor for lastEditedBy.
   *
   * @return Value of lastEditedBy.
   */
  public String getLastEditedBy() {

    return lastEditedBy;

  } // End getLastEditedBy().


  /**
   * Mutator for lockedBy.
   *
   * @param inLockedBy New value for lockedBy.
   */
  public void setLockedBy(final String inLockedBy) {

    lockedBy = inLockedBy;

  } // End setLockedBy().


  /**
   * Accessor for lockedBy.
   *
   * @return Value of lockedBy.
   */
  public String getLockedBy() {

    return lockedBy;

  } // End getLockedBy().


  /**
   * Mutator for lockTime.
   *
   * @param inLockTime New value for lockTime.
   */
  public void setLockTime(final Timestamp inLockTime) {

    lockTime = inLockTime;

  } // End setLockTime().


  /**
   * Accessor for lockTime.
   *
   * @return Value of lockTime.
   */
  public Timestamp getLockTime() {

    return lockTime;

  } // End getLockTime().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[").append(super.toString()).append("]={");
    boolean firstPropertyDisplayed = false;
    try {
      java.lang.reflect.Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName()).append("=").append(fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
