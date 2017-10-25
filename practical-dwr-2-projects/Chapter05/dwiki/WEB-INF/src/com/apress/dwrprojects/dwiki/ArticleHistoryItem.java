package com.apress.dwrprojects.dwiki;


import java.sql.Timestamp;


/**
 * A bean representing one article update/change history item.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ArticleHistoryItem {


  /**
   * The title of the article this history record applies to.
   */
  private String articleTitle;



  /**
   * The text of the article as it appeared before the update.
   */
  private String previousText;


  /**
   * The text of the article as it appeared after the update.
   */
  private String newText;


  /**
   * The date/time this update was made.
   */
  private Timestamp edited;


  /**
   * The username of the user who made this update.
   */
  private String editedBy;


  /**
   * Mutator for articleTitle.
   *
   * @param inArticleTitle New value for articleTitle.
   */
  public void setArticleTitle(final String inArticleTitle) {

    articleTitle = inArticleTitle;

  } // End setArticleTitle().


  /**
   * Accessor for articleTitle.
   *
   * @return Value of articleTitle.
   */
  public String getArticleTitle() {

    return articleTitle;

  } // End getArticleTitle().


  /**
   * Mutator for previousText.
   *
   * @param inPreviousText New value for previousText.
   */
  public void setPreviousText(final String inPreviousText) {

    previousText = inPreviousText;

  } // End setPreviousText().


  /**
   * Accessor for previousText.
   *
   * @return Value of previousText.
   */
  public String getPreviousText() {

    return previousText;

  } // End getPreviousText().


  /**
   * Mutator for newText.
   *
   * @param inNewText New value for newText.
   */
  public void setNewText(final String inNewText) {

    newText = inNewText;

  } // End setNewText().


  /**
   * Accessor for newText.
   *
   * @return Value of newText.
   */
  public String getNewText() {

    return newText;

  } // End getNewText().


  /**
   * Mutator for edited.
   *
   * @param inEdited New value for edited.
   */
  public void setEdited(final Timestamp inEdited) {

    edited = inEdited;

  } // End setEdited().


  /**
   * Accessor for edited.
   *
   * @return Value of edited.
   */
  public Timestamp getEdited() {

    return edited;

  } // End getEdited().


  /**
   * Mutator for editedBy.
   *
   * @param inEditedBy New value for editedBy.
   */
  public void setEditedBy(final String inEditedBy) {

    editedBy = inEditedBy;

  } // End setEditedBy().


  /**
   * Accessor for editedBy.
   *
   * @return Value of editedBy.
   */
  public String getEditedBy() {

    return editedBy;

  } // End getEditedBy().


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
