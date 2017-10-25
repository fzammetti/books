package com.apress.ajaxprojects.rssreader.dtos;


import java.lang.reflect.Field;


/**
 * This is a bean that represents a feed.
 */
public class FeedDescriptor {


  /**
   *
   */
  private String feedTitle;


  /**
   *
   */
  private String feedURL;


  /**
   * feedTitle mutator.
   *
   * @param inFeedTitle New feedTitle value.
   */
  public void setFeedTitle(String inFeedTitle) {

    feedTitle = inFeedTitle;

  } // End setFeedTitle().


  /**
   * feedTitle accessor.
   *
   * @return feedTitle current value.
   */
  public String getFeedTitle() {

    return feedTitle;

  } // End getFeedTitle().


  /**
   * feedURL mutator.
   *
   * @param inFeedURL New feedURL value.
   */
  public void setFeedURL(String inFeedURL) {

    feedURL = inFeedURL;

  } // End setFeedURL().


  /**
   * feedURL accessor.
   *
   * @return feedURL current value.
   */
  public String getFeedURL() {

    return feedURL;

  } // End getFeedURL().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]=\n{{{{");
    try {
      Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        sb.append("\n" + fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("\n}}}}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
