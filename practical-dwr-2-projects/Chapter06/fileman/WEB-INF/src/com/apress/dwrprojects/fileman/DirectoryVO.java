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


/**
 * Generic class representing a directory.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class DirectoryVO {


  /**
   * The name of the directory.
   */
  private String name;


  /**
   * The path of the directory.
   */
  private String path;


  /**
   * Flag: Does this directory have child directories?
   */
  private boolean hasChildren;


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
   * Mutator for path.
   *
   * @param inPath New value for path.
   */
  public void setPath(final String inPath) {

    path = inPath;

  } // End setPath().


  /**
   * Accessor for path.
   *
   * @return Value of path.
   */
  public String getPath() {

    return path;

  } // End getPath().


  /**
   * Mutator for hasChildren.
   *
   * @param inHasChildren New value for hasChildren.
   */
  public void setHasChildren(final boolean inHasChildren) {

    hasChildren = inHasChildren;

  } // End setHasChildren().


  /**
   * Accessor for hasChildren.
   *
   * @return Value of hasChildren.
   */
  public boolean getHasChildren() {

    return hasChildren;

  } // End getHasChildren().


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
