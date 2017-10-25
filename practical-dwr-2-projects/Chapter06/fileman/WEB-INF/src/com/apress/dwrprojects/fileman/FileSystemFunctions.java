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


import java.io.File;
import java.io.FileInputStream;
import java.io.FilenameFilter;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import org.apache.commons.io.DirectoryWalker;
import org.apache.commons.io.FileUtils;


/**
 * Class that provides functions for performing various file system operations.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class FileSystemFunctions extends DirectoryWalker {


  /**
   * The directory that was requested.
   */
  private String directory;


  /**
   * Callback method called for each directory encountered.
   *
   * @param  inDirectory The next directory encountered.
   * @param  inDepth     The depth the directory is under the starting
   *                     directory.
   * @return             True if the directory is handed, false if not.
   */
  @SuppressWarnings("unchecked") // Avoids warning on inResults.add(dv)
  protected boolean handleDirectory(final File inDirectory, final int inDepth,
    final Collection inResults) {

    // Only process directories that are direct children of inDirectory.
    if (inDepth <= 1) {
      // Don't process root file system directories.
      if (inDirectory.getParent() != null) {
        // Don't process the directory if it's the requested directory
        if (!directory.equals(inDirectory.getPath())) {
          // Construct DirectoryVO object.
          DirectoryVO dv = new DirectoryVO();
          dv.setName(inDirectory.getName());
          dv.setPath(inDirectory.getPath());
          // See if the directory has child directories or not.  Anonymous inner
          // class used to determine whether the directory has children or not.
          String[] childDirectories = inDirectory.list(
            new FilenameFilter() {
              public boolean accept(final File inDir, final String inName) {
                if (inName != inDirectory.getName()) {
                  File f = new File(inDir.getPath() + File.separator + inName);
                  if (f.isDirectory()) {
                    return true;
                  } else {
                    return false;
                  }
                } else {
                  return false;
                }
              }
            }
          );
          if (childDirectories != null && childDirectories.length > 0) {
            dv.setHasChildren(true);
          }
          inResults.add(dv);
        }
      }
      return true;
    } else {
      return false;
    }

  } // End handleDirectory().


  /**
   * This method is called to list all the files in a given directory.  Also
   * lists directories, contrary to its name!
   *
   * @param  inDirectory The directory path to list files for.
   * @return             A List of FileVO objects, one for each file in
   *                     inDirectory.
   * @throws Exception   If anything goes wrong.
   */
  public List listFiles(final String inDirectory) throws Exception {

    try {
      File[] files = new File(inDirectory).listFiles();
      List<FileVO> results = new ArrayList<FileVO>();
      if (files != null) {
        for (File f : files) {
          // Construct a FileVO for each file (or directory).
          FileVO fv = new FileVO();
          fv.setName(f.getName());
          fv.setSize(f.length());
          if (f.isDirectory()) {
            fv.setType("Directory");
          } else {
            fv.setType(null);
          }
          fv.setModified(new Date(f.lastModified()));
          results.add(fv);
        }
      }
      return results;
    } catch (Exception e) {
      throw new Exception("Exception occurred: " + e);
    }

  } // End listFiles().


  /**
   * This method is called to list all the directories which are immediate
   * children of a given directory.  It DOES NOT drill down any deeper than
   * the first level children.
   *
   * @param  inStartDirectory The directory path to list child directories for.
   * @return                  A List of DirectoryVO objects, one for each child
   *                          directory of inDirectory.
   * @throws Exception        If anything goes wrong.
   */
  public List listDirectories(final String inStartDirectory) throws Exception {

    directory = inStartDirectory;
    List<DirectoryVO> results = new ArrayList<DirectoryVO>();
    try {
      // Walk the directory tree, starting at inStartDirectory.  The results
      // list will be populated as the walking is done.
      walk(new File(inStartDirectory), results);
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    return results;

  } // End listDirectories().


  /**
   * This method is called to list all the file system roots on the system.
   *
   * @return           A List of DirectoryVO objects, one for each file system
   *                   root on the system.
   * @throws Exception If anything goes wrong.
   */
  public List listRoots() throws Exception {

    try {
      File[] roots = File.listRoots();
      List<DirectoryVO> results = new ArrayList<DirectoryVO>();
      for (final File f : roots) {
        DirectoryVO dv = new DirectoryVO();
        dv.setName(f.getPath());
        dv.setPath(f.getPath());
        // See if the directory has child directories or not.  Anonymous inner
        // class used to determine whether the directory has children or not.
        String[] childDirectories = f.list(
          new FilenameFilter() {
            public boolean accept(final File inDir, final String inName) {
              if (inName != f.getName()) {
                File f = new File(inDir.getPath() + File.separator + inName);
                if (f.isDirectory()) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }
          }
        );
        // Setting whether the directory has children or not is used by the UI
        // code to set up the grid properly in terms of nodes being expandable
        // or not.
        if (childDirectories != null && childDirectories.length > 0) {
          dv.setHasChildren(true);
        }
        results.add(dv);
      }
      return results;
    } catch (Exception e) {
      throw new Exception("Exception occurred: " + e);
    }

  } // End listRoots().


  /**
   * This method is called to create a new directory.
   *
   * @param  inPath    The path to the directory to create the directory in.
   * @throws Exception If anything goes wrong.
   */
  public void createDirectory(final String inPath) throws Exception {

    boolean outcome = false;
    try {
      outcome =
        new File(inPath + File.separator + "new_directory").mkdir();
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    if (!outcome) {
      throw new Exception("Directory could not be created\n\n" +
        "(Does a directory with the name 'new_directory' already exist?");
    }

  } // End createDirectory().


  /**
   * This method is called to delete a file (or directory).
   *
   * @param  inFullPath The fully-qualified filename, including path, to delete.
   * @return            True if the file was deleted, false if not.
   * @throws Exception  If anything goes wrong.
   */
  public void deleteFile(final String inFullPath) throws Exception {

    boolean outcome = false;
    try {
      outcome = new File(inFullPath).delete();
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    if (!outcome) {
      throw new Exception("File/directory could not be deleted\n\n" +
        "Possible permission issue?\n\n" +
        "(If it's a directory, it must be empty to be deleted)");
    }

  } // End deleteFile().


  /**
   * This method is called to rename a file (or directory).
   *
   * @param  inOldFullPath The fully-qualified old filename, including path, to
   *                       rename.
   * @param  inNewFullPath The fully-qualified new filename, including path, to
   *                       rename.
   * @throws Exception     If anything goes wrong.
   */
  public void renameFile(final String inOldFullPath,
    final String inNewFullPath) throws Exception {

    boolean outcome = false;
    try {
      outcome = new File(inOldFullPath).renameTo(new File(inNewFullPath));
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    if (!outcome) {
      throw new Exception("File/directory could not be renamed\n\n" +
        "(Does a file/directory with the new name already exist?");
    }

  } // End renameFile().


  /**
   * This method is called to create a new file.
   *
   * @param  inPath    The path to the directory to create the file in.
   * @throws Exception If anything goes wrong.
   */
  public void createFile(final String inPath) throws Exception {

    try {
      File f = new File(inPath + File.separator + "new_file.txt");
      if (!f.createNewFile()) {
        throw new Exception("File already exists");
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }

  } // End createFile().


  /**
   * This method is called to copy or move a file.
   *
   * @param  inSourcePath      The path to the file/directory to copy/move.
   * @param  inSourceName      The name of the file/directory to copy/move.
   * @param  inDestinationPath The path of the destination for the
   *                           file/directory.
   * @param  inOperation       Whether to do a "copy" or a "move".
   * @param  inType            Whether the object being moved is a "file" or
   *                           "directory".
   * @throws Exception         If anything goes wrong.
   */
  public void copyMoveFile(final String inSourcePath,
    final String inSourceName, final String inDestinationPath,
    final String inOperation, final String inType) throws Exception {

    boolean outcome = true;
    try {
      File src = new File(inSourcePath + File.separator + inSourceName);
      File dest = new File(inDestinationPath + File.separator +
        (inOperation.equals("copy")?"copy_of_":"") + inSourceName);
      // Different copy method based on whether copying file or directory.
      if (inType.equals("file")) {
        FileUtils.copyFile(src, dest);
      } else {
        FileUtils.copyDirectory(src, dest);
      }
      // Delete the original file if doing a cut.
      if (inOperation.equals("cut")) {
        deleteFile(inSourcePath + File.separator + inSourceName);
      }
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    if (!outcome) {
      throw new Exception("File/directory could not be copied/moved\n\n" +
        "(Does the file/directory already exist in the destination?)");
    }

  } // End copyMoveFile().


  /**
   * This method is called to edit a file.
   *
   * @param  inPath    The full path to the file to edit.
   * @return           The text of the file to edit.
   * @throws Exception If anything goes wrong.
   */
  public String editFile(final String inPath) throws Exception {

    String fileContents = null;
    try {
      fileContents = FileUtils.readFileToString(new File(inPath));
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }
    return fileContents;

  } // End editFile().


  /**
   * This method is called to save a file  being edited.
   *
   * @param  inPath    The full path to the file to save.
   * @param  inText    The text of the file to save.
   * @throws Exception If anything goes wrong.
   */
  public void saveFile(final String inPath, final String inText)
    throws Exception {

    try {
      File f = new File(inPath);
      FileUtils.writeStringToFile(f, inText);
    } catch (Exception e) {
      e.printStackTrace();
      throw new Exception("Exception occurred: " + e);
    }

  } // End saveFile().


} // End class.
