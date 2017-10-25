package com.apress.ajaxprojects.photoshare.dtos;


import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;


/**
 * This class represents a collection.
 */
public class CollectionDTO implements Comparable {


  /**
   * name.
   */
  private String name;


  /**
   * createdBy.
   */
  private String createdBy;


  /**
   * createdOn.
   */
  private Date createdOn;


  /**
   * photos.
   */
  private ArrayList photos = new ArrayList();


  /**
   * name mutator.
   *
   * @param inName name.
   */
  public void setName(String inName) {

    name = inName;

  } // End setName().


  /**
   * name accessor.
   *
   * @return name name.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * createdBy mutator.
   *
   * @param inCreatedBy createdBy.
   */
  public void setCreatedBy(String inCreatedBy) {

    createdBy = inCreatedBy;

  } // End setCreatedBy().


  /**
   * createdBy accessor.
   *
   * @return createdBy createdBy.
   */
  public String getCreatedBy() {

    return createdBy;

  } // End getCreatedBy().


  /**
   * createdOn mutator.
   *
   * @param inCreatedOn createdOn.
   */
  public void setCreatedOn(Date inCreatedOn) {

    createdOn = inCreatedOn;

  } // End setCreatedOn().


  /**
   * createdOn accessor.
   *
   * @return createdOn createdOn.
   */
  public Date getCreatedOn() {

    return createdOn;

  } // End getCreatedOn().


  /**
   * Used to sort the list of collections when a new collection is added or
   * an existing collection is removed.
   *
   * @param  o UserDTO object to compare to.
   * @return   Typical return val of compareTo() method of Comparable interface.
   */
  public int compareTo(Object o) {

    return this.name.compareTo(((CollectionDTO)o).getName());

  } // End compareTo().


  /**
   * This method is called to get a string of XML representing this DTO.
   *
   * @return A string of XML representing this DTO.
   */
  public String getAsXML() {

    StringBuffer sb = new StringBuffer(512);
    sb.append("<collection name=\"" + name + "\" ");
    sb.append("createdBy=\"" + createdBy + "\" ");
    sb.append("createdOn=\"" +
      new SimpleDateFormat("MM/dd/yyyy hh:mma").format(createdOn) +
      "\">\n");
    for (Iterator it = photos.iterator(); it.hasNext();) {
      PhotoDTO dto = (PhotoDTO)it.next();
      sb.append(dto.getAsXML());
    }
    sb.append("</collection>\n");
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


  /**
   * Method that adds a photo to this collection.
   *
   * @param inPhotoDTO The photo to add.
   */
  public void addPhoto(PhotoDTO inPhotoDTO) {

    // Set the collection property of the PhotoDTO.  This is so that the
    // property is set when reading in the collections file at startup.  Any
    // other time, like when a photo is uploaded, this will in effect overwrite
    // the existing value, which will be the same.
    inPhotoDTO.setCollection(name);
    photos.add(inPhotoDTO);

  } // End addPhoto().


  /**
   * Method to delete a photo from this collection.
   *
   * @param inFilename The filename of the photo to delete.
   */
  public void deletePhoto(String inFilename) {

    int i = -1;
    // Find it, then remove it, assuming it was found.
    for (Iterator it = photos.iterator(); it.hasNext();) {
      i++;
      PhotoDTO dto = (PhotoDTO)it.next();
      if (dto.getFilename().equals(inFilename)) {
        break;
      }
    }
    if (i != -1) {
      photos.remove(i);
    }

  } // End deletePhoto().


  /**
   * Returns the whole collection of photos in this collection.
   *
   * @return The collection of photos in this collection.
   */
  public ArrayList getPhotos() {

    return photos;

  } // End getPhotos().


} // End class.
