package com.apress.dwrprojects.dwiki;


import java.sql.Timestamp;


/**
 * A bean representing one article comment.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class ArticleComment {


  /**
   * The title of the article this comment record applies to.
   */
  private String articleTitle;


  /**
   * The text of the comment.
   */
  private String text;


  /**
   * The date/time this comment was made.
   */
  private Timestamp posted;


  /**
   * The username of the user who made this comment.
   */
  private String poster;


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
   * Mutator for posted.
   *
   * @param inPosted New value for posted.
   */
  public void setPosted(final Timestamp inPosted) {

    posted = inPosted;

  } // End setPosted().


  /**
   * Accessor for posted.
   *
   * @return Value of posted.
   */
  public Timestamp getPosted() {

    return posted;

  } // End getPosted().


  /**
   * Mutator for poster.
   *
   * @param inPoster New value for poster.
   */
  public void setPoster(final String inPoster) {

    poster = inPoster;

  } // End setPoster().


  /**
   * Accessor for poster.
   *
   * @return Value of poster.
   */
  public String getPoster() {

    return poster;

  } // End getPoster().


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
