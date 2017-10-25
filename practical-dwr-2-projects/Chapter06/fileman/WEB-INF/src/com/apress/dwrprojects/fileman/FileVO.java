/*
  Copyright (c) 2007 by Frank W. Zammetti.  This file is part of the DWR
  File Manager (Fileman) project from the book Practical DWR (Ajax) Web 2.0
  Projects by Frank W. Zammetti, published by Apress, Inc. in 2008.

  Fileman is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation; either version 2 of the License, or
  (at your option) any later version.

  Fileman is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see
  http://www.gnu.org/licenses/old-licenses/gpl-2.0.html.
*/


package com.apress.dwrprojects.fileman;


import java.util.Date;


/**
 * Generic class representing a file.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class FileVO {


  /**
   * The name of the file.
   */
  private String name;


  /**
   * The size of the file.
   */
  private long size;


  /**
   * The type of the file.
   */
  private String type;


  /**
   * The last modified date of the file.
   */
  private Date modified;


  /**
   * Mutator for name.
   *
   * @param inName New value for name.
   */
  public void setName(final String inName) {

    name = inName;

  } // End setName().


  /**
   * Accessor for name.
   *
   * @return Value of name.
   */
  public String getName() {

    return name;

  } // End getName().


  /**
   * Mutator for size.
   *
   * @param inSize New value for size.
   */
  public void setSize(final long inSize) {

    size = inSize;

  } // End setSize().


  /**
   * Accessor for size.
   *
   * @return Value of size.
   */
  public long getSize() {

    return size;

  } // End getSize().


  /**
   * Mutator for type.
   *
   * @param inType New value for type.  If this value is null, then the current
   *               value of the name field will be used to auto-detect the
   *               file type.
   */
  public void setType(final String inType) {

    // If inType is null, then we'll dynamically try and detect the file type.
    // Otherwise we'll just set the type to the value of inType.
    if (inType == null && name != null) {
      String fileExtension = "";
      int dotLocation = name.lastIndexOf(".");
      if (dotLocation != -1) {
        fileExtension = name.substring(dotLocation + 1);
      }
      type = "Unknown File";
      if (fileExtension.equalsIgnoreCase("txt")) {
        type = "Text Document";
      } else if (fileExtension.equalsIgnoreCase("zip")) {
        type = "Zip Archive";
      } else if (fileExtension.equalsIgnoreCase("pdf")) {
        type = "Adobe Acrobat Document";
      } else if (fileExtension.equalsIgnoreCase("doc")) {
        type = "Microsoft Word Document";
      } else if (fileExtension.equalsIgnoreCase("xls")) {
        type = "Microsoft Excel Spreadsheet";
      } else if (fileExtension.equalsIgnoreCase("ppt")) {
        type = "Microsoft PowerPoint Presentation";
      } else if (fileExtension.equalsIgnoreCase("avi")) {
        type = "Video Clip";
      } else if (fileExtension.equalsIgnoreCase("bmp")) {
        type = "Bitmap Image File";
      } else if (fileExtension.equalsIgnoreCase("gif")) {
        type = "GIF Image File";
      } else if (fileExtension.equalsIgnoreCase("jpg")) {
        type = "JPEG Image File";
      } else if (fileExtension.equalsIgnoreCase("wav")) {
        type = "WAV Audio File";
      } else if (fileExtension.equalsIgnoreCase("mp3")) {
        type = "MP3 Audio File";
      } else if (fileExtension.equalsIgnoreCase("wma")) {
        type = "Windows Media Audio File";
      } else if (fileExtension.equalsIgnoreCase("wmv")) {
        type = "Windows Media Video File";
      } else if (fileExtension.equalsIgnoreCase("exe")) {
        type = "Application";
      } else if (fileExtension.equalsIgnoreCase("com")) {
        type = "Application";
      } else if (fileExtension.equalsIgnoreCase("bat")) {
        type = "DOS Batch File";
      } else if (fileExtension.equalsIgnoreCase("java")) {
        type = "Java Source File";
      } else if (fileExtension.equalsIgnoreCase("class")) {
        type = "Java Class File";
      } else if (fileExtension.equalsIgnoreCase("rar")) {
        type = "RAR Archive";
      } else if (fileExtension.equalsIgnoreCase("arj")) {
        type = "ARJ Archive";
      } else if (fileExtension.equalsIgnoreCase("scr")) {
        type = "Windows Screensaver";
      } else if (fileExtension.equalsIgnoreCase("ini")) {
        type = "Configuration Settings";
      } else if (fileExtension.equalsIgnoreCase("dll")) {
        type = "Dynamic Link Library";
      } else if (fileExtension.equalsIgnoreCase("log")) {
        type = "Log File";
      } else if (fileExtension.equalsIgnoreCase("rtf")) {
        type = "Rich Text Format";
      } else if (fileExtension.equalsIgnoreCase("cpp")) {
        type = "C++ Source File";
      } else if (fileExtension.equalsIgnoreCase("h")) {
        type = "C Header File";
      } else if (fileExtension.equalsIgnoreCase("iso")) {
        type = "Disc Image";
      } else if (fileExtension.equalsIgnoreCase("htm")) {
        type = "HTML Document";
      } else if (fileExtension.equalsIgnoreCase("html")) {
        type = "HTML Document";
      } else if (fileExtension.equalsIgnoreCase("js")) {
        type = "Javascript Source File";
      } else if (fileExtension.equalsIgnoreCase("jsp")) {
        type = "JavaServer Page";
      } else if (fileExtension.equalsIgnoreCase("asp")) {
        type = "Active Server Page";
      } else if (fileExtension.equalsIgnoreCase("php")) {
        type = "PHP Page";
      } else if (fileExtension.equalsIgnoreCase("py")) {
        type = "Python Script";
      } else if (fileExtension.equalsIgnoreCase("vbs")) {
        type = "Visual Basic Script File";
      } else if (fileExtension.equalsIgnoreCase("ico")) {
        type = "Icon";
      } else if (fileExtension.equalsIgnoreCase("ogg")) {
        type = "Ogg Vorbis File";
      } else if (fileExtension.equalsIgnoreCase("tif")) {
        type = "TIFF Image File";
      } else if (fileExtension.equalsIgnoreCase("tiff")) {
        type = "TIFF Image File";
      } else if (fileExtension.equalsIgnoreCase("xml")) {
        type = "XML Document";
      } else if (fileExtension.equalsIgnoreCase("cfg")) {
        type = "Configuration File";
      } else if (fileExtension.equalsIgnoreCase("nfo")) {
        type = "MSInfo File";
      } else if (fileExtension.equalsIgnoreCase("jar")) {
        type = "Java Archive";
      } else if (fileExtension.equalsIgnoreCase("css")) {
        type = "Cascading Stylesheet";
      } else if (fileExtension.equalsIgnoreCase("sh")) {
        type = "Shell Script";
      } else if (fileExtension.equalsIgnoreCase("csv")) {
        type = "Comma-Separated Values File";
      }
    } else {
      type = inType;
    }

  } // End setType().


  /**
   * Accessor for type.
   *
   * @return Value of type.
   */
  public String getType() {

    return type;

  } // End getType().


  /**
   * Mutator for modified.
   *
   * @param inModified New value for modified.
   */
  public void setModified(final Date inModified) {

    modified = inModified;

  } // End setModified().


  /**
   * Accessor for modified.
   *
   * @return Value of modified.
   */
  public Date getModified() {

    return modified;

  } // End getModified().


  /**

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
