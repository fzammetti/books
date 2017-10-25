package com.apress.ajaxprojects.photoshare.dtos;


import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Date;


/**
 * This class represents a photo and contains all the accompanying information
 * on it.
 */
public class PhotoDTO {


  /**
   * collection.
   */
  private String collection;


  /**
   * filename.
   */
  private String filename;


  /**
   * addedBy.
   */
  private String addedBy;


  /**
   * addedOn.
   */
  private Date addedOn;


  /**
   * type.
   */
  private String type;


  /**
   * fileSize.
   */
  private String fileSize;


  /**
   * dimensions.
   */
  private String dimensions;


  /**
   * dpi.
   */
  private String dpi;


  /**
   * colorDepth.
   */
  private String colorDepth;


  /**
   * description.
   */
  private String description;


  /**
   * collection mutator.
   *
   * @param inCollection collection.
   */
  public void setCollection(String inCollection) {

    collection = inCollection;

  } // End setCollection().


  /**
   * collection accessor.
   *
   * @return collection.
   */
  public String getCollection() {

    return collection;

  } // End getCollection().


  /**
   * filename mutator.
   *
   * @param inFilename filename.
   */
  public void setFilename(String inFilename) {

    filename = inFilename;

  } // End setFilename().


  /**
   * filename accessor.
   *
   * @return filename.
   */
  public String getFilename() {

    return filename;

  } // End getFilename().


  /**
   * addedBy mutator.
   *
   * @param inAddedBy addedBy.
   */
  public void setAddedBy(String inAddedBy) {

    addedBy = inAddedBy;

  } // End setAddedBy().


  /**
   * addedBy accessor.
   *
   * @return addedBy.
   */
  public String getAddedBy() {

    return addedBy;

  } // End getAddedBy().


  /**
   * addedOn mutator.
   *
   * @param inAddedOn addedOn.
   */
  public void setAddedOn(Date inAddedOn) {

    addedOn = inAddedOn;

  } // End setAddedOn().


  /**
   * addedOn accessor.
   *
   * @return addedOn.
   */
  public Date getAddedOn() {

    return addedOn;

  } // End getAddedOn().


  /**
   * type mutator.
   *
   * @param inType type.
   */
  public void setType(String inType) {

    type = inType;

  } // End setType().


  /**
   * type accessor.
   *
   * @return type.
   */
  public String getType() {

    return type;

  } // End getType().


  /**
   * fileSize mutator.
   *
   * @param inFileSize fileSize.
   */
  public void setFileSize(String inFileSize) {

    fileSize = inFileSize;

  } // End setFileSize().


  /**
   * fileSize accessor.
   *
   * @return fileSize.
   */
  public String getFileSize() {

    return fileSize;

  } // End getFileSize().


  /**
   * dimensions mutator.
   *
   * @param inDimensions dimensions.
   */
  public void setDimensions(String inDimensions) {

    dimensions = inDimensions;

  } // End setDimensions().


  /**
   * dimensions accessor.
   *
   * @return dimensions.
   */
  public String getDimensions() {

    return dimensions;

  } // End getDimensions().


  /**
   * dpi mutator.
   *
   * @param inDpi dpi.
   */
  public void setDpi(String inDpi) {

    dpi = inDpi;

  } // End setDpi().


  /**
   * dpi accessor.
   *
   * @return dpi.
   */
  public String getDpi() {

    return dpi;

  } // End getDpi().


  /**
   * colorDepth mutator.
   *
   * @param inColorDepth colorDepth.
   */
  public void setColorDepth(String inColorDepth) {

    colorDepth = inColorDepth;

  } // End setColorDepth().


  /**
   * colorDepth accessor.
   *
   * @return colorDepth.
   */
  public String getColorDepth() {

    return colorDepth;

  } // End getColorDepth().


  /**
   * description mutator.
   *
   * @param inDescription description.
   */
  public void setDescription(String inDescription) {

    description = inDescription;

  } // End setDescription().


  /**
   * description accessor.
   *
   * @return description.
   */
  public String getDescription() {

    return description;

  } // End getDescription().


  /**
   * This method is called to get a string of XML representing this DTO.
   *
   * @return A string of XML representing this DTO.
   */
  public String getAsXML() {

    StringBuffer sb = new StringBuffer(1024);
    sb.append("<photo addedBy=\"" + addedBy + "\" ");
    sb.append("addedOn=\"" +
      new SimpleDateFormat("MM/dd/yyyy hh:mma").format(addedOn) +
      "\" ");
    sb.append("type=\"" + type + "\" ");
    sb.append("fileSize=\"" + fileSize + "\" ");
    sb.append("dimensions=\"" + dimensions + "\" ");
    sb.append("dpi=\"" + dpi + "\" ");
    sb.append("filename=\"" + filename + "\" ");
    sb.append("colorDepth=\"" + colorDepth + "\">\n");
    sb.append(description + "\n");
    sb.append("</photo>\n");

    return sb.toString();

  } // End getAsXML().


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
      Field[] fields = this.getClass().getDeclaredFields();
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
