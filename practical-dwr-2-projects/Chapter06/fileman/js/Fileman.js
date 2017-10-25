/*
  Copyright (c) 2007 by Frank W. Zammetti.  This file is part of the DWR
  File Manager (Fileman) project from the book Practical DWR 2 Projects
  by Frank W. Zammetti, published by Apress, Inc. in 2008.

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

/**
 * The Fileman class is the main client-side class for the Fileman application.
 */
function Fileman() {


  /**
   * Reference to the directory tree component.
   */
  var directoryTree = null;


  /**
   * Reference to the file grid component.
   */
  var fileGrid = null;


  /**
   * Reference to the menubar component.
   */
  var menubar = null;


  /**
   * Reference to the toolbar component.
   */
  var toolbar = null;


  /**
   * The system-specific path separator character for the host system.
   */
  var pathSeparator = null;


  /**
   * This is the full path of the object (file or directory) on the clipboard.
   */
  var clipboardPath = null;


  /**
   * This is the name of the object (file or directory) on the clipboard.
   */
  var clipboardName = null;


  /**
   * This is the type of the object (file or directory) on the clipboard.
   * Value is either null if none, "file" or "directory".
   */
  var clipboardType = null;


  /**
   * This is the operation active for the item currently on the clipboard.
   * Value is either null if none, "copy" or "cut".
   */
  var clipboardOperation = null;


  /**
   * This is the full path to the file currently being edited, if any.
   */
  var fileBeingEdited = null;


  /**
   * This is called on startup to initialize things.
   *
   * @param inPathSeparator This is the system-specific path separator
   *                        character used to build up file paths.
   */
  this.init = function(inPathSeparator) {

    // Record the path separator for the host system for later.
    pathSeparator = inPathSeparator;

    // Create and configure the directory tree component.
    directoryTree = new dhtmlXTreeObject("divDirectories", "100%", "100%", 0);
    directoryTree.setImagePath("img/");
    directoryTree.attachEvent("onClick", fileman.directoryClicked);
    directoryTree.attachEvent("onDblClick", function() { } );
    directoryTree.attachEvent("onOpenStart", fileman.directoryExpanded);
    directoryTree.setStdImages("folderClosed.gif", "folderOpen.gif",
      "folderClosed.gif");
    directoryTree.insertNewChild(0, "0_dummy", "Loading...",
      0, "blank.gif", 0, 0, 0, 0);

    // Create and configure the file grid component.
    fileGrid = new dhtmlXGridObject();
    fileGrid.setImagePath("img/");
    fileGrid.setHeader("Name,Size,Type,Modified");
    fileGrid.setColAlign("left,right,left,right")
    fileGrid.setColTypes("ed,ro,ro,ro");
    fileGrid.setInitWidthsP("40,20,20,20");
    fileGrid.setColSorting("str,str,str,str");
    var gridHeight = getContentAreaHeight() - 70;
    fileGrid.enableAutoHeight(true, gridHeight, false);
    fileGrid.attachToObject(dwr.util.byId("divFiles"));
    fileGrid.setOnEditCellHandler(fileman.filenameChanged)
    fileGrid.init();

    // Create and configure toolbar.
    toolbar = new dhtmlXToolbarObject(
      dwr.util.byId("divToolbar"), "100%", "20px", "");
    toolbar.setOnClickHandler(fileman.toolbarButtonClick);
    var tbUpOneLevel = new dhtmlXImageButtonObject(
      "img/icoUpOneLevel.gif", "38px", "32px", null, "tbUpOneLevel",
      "Up one level (Go to parent directory)", null,
      disableImage="img/icoUpOneLevel.gif");
    var tbRefresh = new dhtmlXImageButtonObject(
      "img/icoRefresh.gif", "38px", "32px", null, "tbRefresh",
      "Refresh current directory", null, disableImage="img/icoRefresh.gif");
    var tbNewFile = new dhtmlXImageButtonObject(
      "img/icoNewFile.gif", "38px", "32px", null, "tbNewFile",
      "Create a new file", null, disableImage="img/icoNewFile.gif");
    var tbNewDirectory = new dhtmlXImageButtonObject(
      "img/icoNewDirectory.gif", "38px", "32px", null, "tbNewDirectory",
      "Create a new directory", null, disableImage="img/icoNewDirectory.gif");
    var tbEditFile = new dhtmlXImageButtonObject(
      "img/icoEditFile.gif", "38px", "32px", null, "tbEditFile",
      "Edit selected file", null, disableImage="img/icoEditFile.gif");
    var tbDelete = new dhtmlXImageButtonObject(
      "img/icoDelete.gif", "38px", "32px", null, "tbDelete",
      "Delete selected file/directory", null,
      disableImage="img/icoDelete.gif");
    var tbCopy = new dhtmlXImageButtonObject(
      "img/icoCopy.gif", "38px", "32px", null, "tbCopy",
      "Copy selected file/directory", null,
      disableImage="img/icoCopy.gif");
    var tbCut = new dhtmlXImageButtonObject(
      "img/icoCut.gif", "38px", "32px", null, "tbCut",
      "Cut selected file/directory", null,
      disableImage="img/icoCut.gif");
    var tbPaste = new dhtmlXImageButtonObject(
      "img/icoPaste.gif", "38px", "32px", null, "tbPaste",
      "Paste file/directory currently on clipboard", null,
      disableImage="img/icoPaste.gif");
    var tbUpload = new dhtmlXImageButtonObject(
      "img/icoUpload.gif", "38px", "32px", null, "tbUpload",
      "Upload file", null, disableImage="img/icoUpload.gif");
    var tbDownload = new dhtmlXImageButtonObject(
      "img/icoDownload.gif", "38px", "32px", null, "tbDownload",
      "Download file", null, disableImage="img/icoDownload.gif");
    toolbar.addItem(tbUpOneLevel);
    toolbar.addItem(tbRefresh);
    toolbar.addItem(new dhtmlXToolbarDividerXObject("divider1"));
    toolbar.addItem(tbNewFile);
    toolbar.addItem(tbNewDirectory);
    toolbar.addItem(new dhtmlXToolbarDividerXObject("divider2"));
    toolbar.addItem(tbEditFile);
    toolbar.addItem(new dhtmlXToolbarDividerXObject("divider3"));
    toolbar.addItem(tbDelete);
    toolbar.addItem(new dhtmlXToolbarDividerXObject("divider4"));
    toolbar.addItem(tbCopy);
    toolbar.addItem(tbCut);
    toolbar.addItem(tbPaste);
    toolbar.addItem(new dhtmlXToolbarDividerXObject("divider5"));
    toolbar.addItem(tbUpload);
    toolbar.addItem(tbDownload);
    toolbar.showBar();

    // Create and configure the menu.
		menubar =
		  new dhtmlXMenuBarObject("divMenu", "100%", 22, "DWR File Manager");
		menubar.setGfxPath("img/");
		menubar.setOnClickHandler(fileman.menubarButtonClick);
    var item = null;
    var subMenu = null;
    // File menu.
		item = new dhtmlXMenuItemObject("mnuFile", "File", "");
		menubar.addItem(menubar, item);
		subMenu = new dhtmlXMenuBarPanelObject(menubar, item, false, 120, true);
		item = new dhtmlXMenuItemObject("mnuDelete", "Delete", "");
    menubar.addItem(subMenu, item);
    item = new dhtmlXMenuDividerYObject("mnuFileDivider1");
    menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuNewFile", "New File", "");
		menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuNewDirectory", "New Directory", "");
		menubar.addItem(subMenu, item);
    item = new dhtmlXMenuDividerYObject("mnuFileDivider2");
    menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuUpload", "Upload", "");
		menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuDownload", "Download", "");
		menubar.addItem(subMenu, item);
    item = new dhtmlXMenuDividerYObject("mnuFileDivider3");
    menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuExit", "Exit", "");
		menubar.addItem(subMenu, item);
    // Edit menu.
		item = new dhtmlXMenuItemObject("mnuEdit", "Edit", "");
		menubar.addItem(menubar, item);
		subMenu = new dhtmlXMenuBarPanelObject(menubar, item, false, 120, true);
		item = new dhtmlXMenuItemObject("mnuEditFile", "Edit File", "");
		menubar.addItem(subMenu, item);
    item = new dhtmlXMenuDividerYObject("mnuEditDivider1");
    menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuCopy", "Copy", "");
		menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuCut", "Cut", "");
		menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuPaste", "Paste", "");
		menubar.addItem(subMenu, item);
    // Tools menu.
		item = new dhtmlXMenuItemObject("mnuTools", "Tools", "");
		menubar.addItem(menubar, item);
		subMenu = new dhtmlXMenuBarPanelObject(menubar, item, false, 120, true);
		item = new dhtmlXMenuItemObject("mnuPrintDirectoryContents",
		  "Print Directory Contents", "");
		menubar.addItem(subMenu, item);
    // Help menu.
		item = new dhtmlXMenuItemObject("mnuHelp", "Help", "");
		menubar.addItem(menubar, item);
		subMenu = new dhtmlXMenuBarPanelObject(menubar, item, false, 120, true);
		item = new dhtmlXMenuItemObject("mnuUsingFileman", "Using Fileman", "");
		menubar.addItem(subMenu, item);
    item = new dhtmlXMenuDividerYObject("mnuHelpDivider1");
    menubar.addItem(subMenu, item);
		item = new dhtmlXMenuItemObject("mnuAbout", "About...", "");
		menubar.addItem(subMenu, item);

    // Configure exception handler for DWR.
    dwr.engine.setErrorHandler(fileman.exceptionHandler);

    // List file system roots.
    FileSystemFunctions.listRoots(
      { callback : function(inResp) {
          directoryTree.deleteItem("0_dummy");
          // Iterate over the collection of DirectoryVO objects returned.
          for (var i = 0; i < inResp.length; i++) {
            var nodeID = i + inResp[i].name;
            // Add file system root to tree.
            directoryTree.insertNewChild(0, nodeID, inResp[i].name, 0,
              "folderClosed.gif", "folderOpen.gif", "folderClosed.gif", 0, 0);
            // Set path of root on node for later.
            directoryTree.setUserData(nodeID, "path", inResp[i].path);
            // If the root has subdirectories, add the "Loading" dummy node
            // so that when they expand the node they'll see this until the
            // contents load.
            if (inResp[i].hasChildren) {
              directoryTree.insertNewChild(nodeID, nodeID + "_dummy",
                "Loading...", 0, "blank.gif", 0, 0, 0, 0);
              directoryTree.closeItem(nodeID);
            }
          }
        }
      }
    );

  } // End init().


  /**
   * This is called to handle any exception thrown on the server-side.
   */
  this.exceptionHandler = function(inMessage) {

    alert(inMessage);

  } // End exceptionHandler().


  /**
   * This is called whenever the window is resized to resize the file grid
   * accordingly.
   */
  this.onResize = function() {

    var gridHeight = getContentAreaHeight() - 70;
    fileGrid.enableAutoHeight(true, gridHeight, false);

  } // End onResize().


  /**
   * Return the height of the content area of the browser window.
   */
  getContentAreaHeight = function() {

    var myHeight = 0;
    if (typeof(window.innerHeight) == "number") {
      // Non-IE
      myHeight = window.innerHeight;
    } else if (document.documentElement &&
      document.documentElement.clientHeight) {
      // IE 6+ in "standards compliant mode".
      myHeight = document.documentElement.clientHeight;
    } else if (document.body && document.body.clientHeight) {
      // IE 4 compatible.
      myHeight = document.body.clientHeight;
    }
    return myHeight;

  } // End getContentAreaHeight().


  /**
   * This is called when any menubar item is clicked.
   *
   * @param inItemID    The ID of the item that was clicked.
   * @param inItemValue The value of the clicked item, if any.
   */
  this.menubarButtonClick = function(inItemID, inItemValue) {

    // Get the ID of the selected directory and file, if any.
    var selectedDirectory = directoryTree.getSelectedItemId();
    var selectedItem = fileGrid.getSelectedId();

    // Branch based on button clicked.
    if (inItemID == "mnuDelete") {
      // Delete menu item clicked.
      fileman.doDelete(selectedDirectory, selectedItem);
    } else if (inItemID == "mnuNewFile") {
      // Create new file menu item clicked.
      fileman.doNewFile(selectedDirectory);
    } else if (inItemID == "mnuNewDirectory") {
      // Create new directory menu item clicked.
      fileman.doNewDirectory(selectedDirectory);
    } else if (inItemID == "mnuEditFile") {
      // Edit File menu item clicked.
      fileman.doEditFile(selectedDirectory, selectedItem);
    } else if (inItemID == "mnuCopy") {
      // Copy menu item clicked.
      fileman.doCopyCut(selectedDirectory, selectedItem, "copy");
    } else if (inItemID == "mnuCut") {
      // Cut menu item clicked.
      fileman.doCopyCut(selectedDirectory, selectedItem, "cut");
    } else if (inItemID == "mnuPaste") {
      // Paste menu item clicked.
      fileman.doPaste(selectedDirectory);
    } else if (inItemID == "mnuDownload") {
      // Download menu item clicked.
      fileman.doDownload(selectedDirectory, selectedItem);
    } else if (inItemID == "mnuUpload") {
      // Upload menu item clicked.
      fileman.doUpload(selectedDirectory);
    } else if (inItemID == "mnuPrintDirectoryContents") {
      // Print Directory Contents menu item clicked.
      fileman.doPrintDirectoryContents(selectedDirectory);
    } else if (inItemID == "mnuUsingFileman") {
      // Using Fileman menu item clicked.
      window.open("using.htm");
    } else if (inItemID == "mnuAbout") {
      // About menu item clicked.
      fileman.doAbout();
    }

  } // End menubarButtonClick().


  /**
   * This is called when any button on the toolbar is clicked.
   *
   * @param inItemID    The ID of the button that was clicked.
   * @param inItemValue The value of the clicked button, if any.
   */
  this.toolbarButtonClick = function(inItemID, inItemValue) {

    // Get the ID of the selected directory and file, if any.
    var selectedDirectory = directoryTree.getSelectedItemId();
    var selectedItem = fileGrid.getSelectedId();

    // Branch based on button clicked.
    if (inItemID == "tbDelete") {
      // Delete button clicked.
      fileman.doDelete(selectedDirectory, selectedItem);
    } else if (inItemID == "tbRefresh") {
      // Refresh button clicked.
      fileman.directoryClicked(selectedDirectory);
    } else if (inItemID == "tbUpOneLevel") {
      // Up one level button clicked.
      fileman.doUpOneLevel(selectedDirectory);
    } else if (inItemID == "tbNewFile") {
      // Create new file button clicked.
      fileman.doNewFile(selectedDirectory);
    } else if (inItemID == "tbNewDirectory") {
      // Create new directory button clicked.
      fileman.doNewDirectory(selectedDirectory);
    } else if (inItemID == "tbEditFile") {
      // Edit File button clicked.
      fileman.doEditFile(selectedDirectory, selectedItem);
    } else if (inItemID == "tbCopy") {
      // Copy button clicked.
      fileman.doCopyCut(selectedDirectory, selectedItem, "copy");
    } else if (inItemID == "tbCut") {
      // Cut button clicked.
      fileman.doCopyCut(selectedDirectory, selectedItem, "cut");
    } else if (inItemID == "tbPaste") {
      // Paste button clicked.
      fileman.doPaste(selectedDirectory);
    } else if (inItemID == "tbDownload") {
      // Download button clicked.
      fileman.doDownload(selectedDirectory, selectedItem);
    } else if (inItemID == "tbUpload") {
      // Upload button clicked.
      fileman.doUpload(selectedDirectory);
    }

  } // End toolbarButtonClick().


  /**
   * This is a utility function that, given the node ID of a selected directory
   * in the tree and the row ID of a selected item in the file grid, returns
   * the fully path to that file or directory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   * @param  inSelectedItem      The row ID in the file grid of the
   *                             selected item.
   * @return                     The full path to the selected file
   *                             or directory.
   */
  this.getFullPath = function(inSelectedDirectory, inSelectedItem) {

    var directoryPath = directoryTree.getUserData(inSelectedDirectory, "path");
    var fileName = fileGrid.getUserData(inSelectedItem, "name");
    return directoryPath + pathSeparator + fileName;

  } // End getFullPath().


  /**
   * Called when a directory is expanded or collapsed.
   *
   * @param  inNodeID       The ID of the node that is being expanded/collapsed.
   * @param  inCurrentstate The current state of the node.
   * @return                True to allow the expand/collapse to occur.
   */
  this.directoryExpanded = function(inNodeID, inCurrentState) {

    // If the first child is the "Loading" dummy node, then we need to load
    // the contents of subdirectories of the directory.
    var firstNode = directoryTree.getChildItemIdByIndex(inNodeID, 0);
    if (firstNode.indexOf("_dummy") != -1) {
      var path = directoryTree.getUserData(inNodeID, "path");
      FileSystemFunctions.listDirectories(path,
        { callback : function(inResp) {
            // Iterate over the collection of DirectoryVO objects returned.
            for (var i = 0; i < inResp.length; i++) {
              var nodeID = inNodeID + i + inResp[i].name;
              // Add the subdirectory to its parent.
              directoryTree.insertNewChild(inNodeID, nodeID,
                inResp[i].name, 0, "folderClosed.gif", "folderOpen.gif",
                "folderClosed.gif", 0, 0);
              // Set path of root on node for later.
              directoryTree.setUserData(nodeID, "path", inResp[i].path);
              // If the subdirectory itself has subdirectories, add the
              // "Loading" dummy node so that when they expand the node they'll
              // see this until the contents load.
              if (inResp[i].hasChildren) {
                directoryTree.insertNewChild(nodeID, nodeID + "_dummy",
                  "Loading...", 0, "blank.gif", 0, 0, 0, 0);
                directoryTree.closeItem(nodeID);
              }
            }
            // Delete the "Loading" node.
            directoryTree.deleteItem(inNodeID + "_dummy");
          }
        }
      );
    }
    return true;

  } // End directoryExpanded().


  /**
   * Retrieves a list of files for the directory that was clicked.
   *
   * @param inNodeID The ID of the node in the tree corresponding to the
   *                 clicked directory.
   */
  this.directoryClicked = function(inNodeID) {

    // Make sure a directory is selected.
    if (inNodeID == null || inNodeID == "") {
      return;
    }

    // Get path of clicked directory.
    var path = directoryTree.getUserData(inNodeID, "path");

    // Clear grid and put in loading message.
    fileGrid.clearAll();
    fileGrid.addRow("rowLoading", "Loading...,,,");
    FileSystemFunctions.listFiles(path,
      { callback : function(inResp) {
          fileGrid.deleteRow("rowLoading");
          // Iterate over the collection of FileVO objects returned.
          for (var i = 0; i < inResp.length; i++) {
            // For each, add a row to the grid.
            fileGrid.addRow(i + inResp[i].name, inResp[i].name + "," +
              inResp[i].size + "," + inResp[i].type + "," +
              inResp[i].modified);
            fileGrid.setUserData(i + inResp[i].name, "name", inResp[i].name);
          }
        }
      }
    );

  } // End directoryClicked().


  /**
   * This is called when the name column of the selected item in the grid
   * is changed.
   *
   * @param inStage     What stage the edit is in (we only care about stage 2,
   *                    which is after the edit completes).
   * @param inRowID     The ID of the row being edited.
   * @param inCellIndex The number of the column being edited.
   * @param inNewValue  The new value of the cell.
   * @param inOldValue  The old value of the cell.
   */
  this.filenameChanged = function(inStage, inRowID, inCellIndex, inNewValue,
    inOldValue){

    if (inStage == 2) {

      // Get the ID of the selected directory and file, if any.
      var selectedDirectory = directoryTree.getSelectedItemId();

      // Get fully qualified name of selected file.
      var directoryPath = directoryTree.getUserData(selectedDirectory, "path");
      var oldFullPath = directoryPath + pathSeparator + inOldValue;
      var newFullPath = directoryPath + pathSeparator + inNewValue;
      FileSystemFunctions.renameFile(oldFullPath, newFullPath,
        { callback : function(inResp) {
            // Refresh both the directory file list and the directory tree.
            fileman.directoryClicked(selectedDirectory);
            directoryTree.deleteChildItems(selectedDirectory);
            // Add the "Loading" node back in before refreshing tree.
            directoryTree.insertNewChild(selectedDirectory,
              selectedDirectory + "_dummy", "Loading...", 0, "blank.gif",
              0, 0, 0, 0);
            fileman.directoryExpanded(selectedDirectory);
          }
        }
      );
      return true;

    }

  } // End filenameChanged().


  /**
   * This is called to copy or cut a file/directory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   * @param  inSelectedItem      The row ID in the file grid of the
   *                             selected item.
   * @param  inOperation         Either "copy" or "cut", depending on which
   *                             is being done.
   */
  this.doCopyCut = function(inSelectedDirectory, inSelectedItem, inOperation) {

    // Only do something if both a directory and an item in the grid are
    // selected.
    if (inSelectedDirectory == null || inSelectedItem == null ||
      inSelectedDirectory == "" || inSelectedItem == "") {
      alert("Please select a file or directory to " + inOperation);
      return;
    }

    // Store the operation and full path to the item selected.
    this.clipboardOperation = inOperation;
    this.clipboardPath = directoryTree.getUserData(inSelectedDirectory, "path");
    this.clipboardName = fileGrid.getUserData(inSelectedItem, "name");
    var itemType = fileGrid.cells(inSelectedItem, 2).getValue();
    if (itemType == "Directory") {
      this.clipboardType = "directory";
    } else {
      this.clipboardType = "file";
    }

  } // End doCopyCut().


  /**
   * This is called to paste a previously copied or cut file/direcotory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doPaste = function(inSelectedDirectory) {

    // Only do something if both a directory is selected and there is an
    // object on the clipboard.
    if (inSelectedDirectory == null || this.clipboardPath == null ||
      this.clipboardName == null) {
      alert("Nothing to paste");
      return;
    }

    // Call the copy/move function.
    var destinationPath =
      directoryTree.getUserData(inSelectedDirectory, "path");
    FileSystemFunctions.copyMoveFile(this.clipboardPath, this.clipboardName,
      destinationPath, this.clipboardOperation, this.clipboardType,
      { callback : function(inResp) {
          // Clear all clipboard variables.
          fileman.clipboardPath = null;
          fileman.clipboardName = null;
          fileman.clipboardOperation = null;
          fileman.clipboardType = null;
          // Update the destination directory.
          fileman.directoryClicked(inSelectedDirectory);
        }
      }
    );

  } // End doPaste().


  /**
   * This is called to delete a file/directory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   * @param  inSelectedItem      The row ID in the file grid of the
   *                             selected item.
   */
  this.doDelete = function(inSelectedDirectory, inSelectedItem) {

    // Only do something if both a directory and an item in the grid are
    // selected.
    if (inSelectedDirectory == null || inSelectedItem == null ||
      inSelectedDirectory == "" || inSelectedItem == "") {
      alert("Please select a file or directory to delete");
      return;
    }

    // Get fully qualified name of selected item.
    var fullPath = fileman.getFullPath(inSelectedDirectory, inSelectedItem);

    // Confirm deletion, then make the call to do it if confirmed.
    if (confirm("Are you sure you want to delete the following " +
      "file/directory?\n\n" + fullPath)) {
      // OK, user confirmed deletion, kill the file!
      FileSystemFunctions.deleteFile(fullPath,
        { callback : function(inResp) {
            // Refresh both the directory file list and the directory tree.
            fileman.directoryClicked(inSelectedDirectory);
            directoryTree.deleteChildItems(inSelectedDirectory);
            // Add the "Loading" node back in before refreshing tree.
            directoryTree.insertNewChild(inSelectedDirectory,
              inSelectedDirectory + "_dummy", "Loading...", 0, "blank.gif",
              0, 0, 0, 0);
            fileman.directoryExpanded(inSelectedDirectory);
          }
        }
      );
    }

  } // End doDelete().


  /**
   * This is called to move up one level in the directory tree.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doUpOneLevel = function(inSelectedDirectory){

    // Only do something if a directory is selected.
    if (inSelectedDirectory == null || inSelectedDirectory == "") {
      return;
    }

    // Get the parent of the currently selected directory node and select
    // it and refresh the grid, if the directory has a parent (file system
    // roots wouldn't).
    var parentNodeID = directoryTree.getParentId(inSelectedDirectory);
    if (parentNodeID != 0) {
      directoryTree.selectItem(parentNodeID);
      this.directoryClicked(parentNodeID);
    }

  } // End doUpOneLevel().


  /**
   * This is called to create a new file.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doNewFile = function(inSelectedDirectory){

    // Only do something if a directory is selected.
    if (inSelectedDirectory == null || inSelectedDirectory == "") {
      alert("Please select a directory to create new file in");
      return;
    }

    // Get directory path where the new file will be created.
    var directoryPath = directoryTree.getUserData(inSelectedDirectory, "path");

    FileSystemFunctions.createFile(directoryPath,
      { callback : function(inResp) {
          fileman.directoryClicked(inSelectedDirectory);
        }
      }
    );

  } // End doNewFile().


  /**
   * This is called ot create a new directory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doNewDirectory = function(inSelectedDirectory){

    // Only do something if a directory is selected.
    if (inSelectedDirectory == null || inSelectedDirectory == "") {
      alert("Please select a directory to create new directory in");
      return;
    }

    // Get directory path where the new directory will be created.
    var directoryPath = directoryTree.getUserData(inSelectedDirectory, "path");

    FileSystemFunctions.createDirectory(directoryPath,
      { callback : function(inResp) {
          // Refresh both the directory file list and the directory tree.
          fileman.directoryClicked(inSelectedDirectory);
          directoryTree.deleteChildItems(inSelectedDirectory);
          directoryTree.insertNewChild(inSelectedDirectory,
            inSelectedDirectory + "_dummy", "Loading...", 0, "blank.gif",
            0, 0, 0, 0);
          fileman.directoryExpanded(inSelectedDirectory);
        }
      }
    );

  } // End doNewDirectory().


  /**
   * This is called to edit a file.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   * @param  inSelectedItem      The row ID in the file grid of the
   *                             selected item.
   */
  this.doEditFile = function(inSelectedDirectory, inSelectedItem) {

    // Only do something if both a directory and an item in the grid are
    // selected.
    if (inSelectedDirectory == null || inSelectedItem == null ||
      inSelectedDirectory == "" || inSelectedItem == "") {
      alert("Please select a file to edit");
      return;
    }

    // Stop editing of directories.
    var itemType = fileGrid.cells(inSelectedItem, 2);
    if (itemType.getValue() == "Directory") {
      alert("Sorry, but only files can be edited");
      return;
    }

    // Show the file editor display and set the textarea text to "Loading...".
    dwr.util.byId("divFileEditor").style.display = "block";
    dwr.util.setValue("taFileEditor", "Loading...");

    // Get fully qualified name of selected item.
    var fullPath = fileman.getFullPath(inSelectedDirectory, inSelectedItem);

    fileBeingEdited = fullPath;
    FileSystemFunctions.editFile(fullPath,
      { callback : function(inResp) {
          dwr.util.setValue("taFileEditor", inResp);
        }
      }
    );

  } // End doEdit().


  /**
   * This is called to save a file being edited.
   */
  this.saveFile = function() {

    FileSystemFunctions.saveFile(fileBeingEdited,
      dwr.util.getValue("taFileEditor"),
      { callback : function(inResp) {
          dwr.util.byId("divFileEditor").style.display = "none";
          alert("File has been saved");
        }
      }
    );

  } // End saveFile().


  /**
   * This is called to download the selected file.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   * @param  inSelectedItem      The row ID in the file grid of the
   *                             selected item.
   */
  this.doDownload = function(inSelectedDirectory, inSelectedItem) {

    // Only do something if both a directory and an item in the grid are
    // selected.
    if (inSelectedDirectory == null || inSelectedItem == null ||
      inSelectedDirectory == "" || inSelectedItem == "") {
      alert("Please select a file to download");
      return;
    }

    // Make sure the selected item is a file.
    var itemType = fileGrid.cells(inSelectedItem, 2).getValue();
    if (itemType == "Directory") {
      alert("Sorry, only files can be downloaded");
      return;
    }

    // Get the name and path of the selected file.
    var directoryPath = directoryTree.getUserData(inSelectedDirectory, "path");
    var fileName = fileGrid.getUserData(inSelectedItem, "name");

    // Redirect to the file.  This won't cause the current page to be lost,
    // because the content disposition set by the server is set to download.
    window.location = "downloadFile.jsp?" +
      "p=" + encodeURIComponent(directoryPath) +
      "&n=" + encodeURIComponent(fileName);

  } // End doDownload().


  /**
   * This is called to show the upload form.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doUpload = function(inSelectedDirectory) {

    // Only do something if a directory is selected.
    if (inSelectedDirectory == null || inSelectedDirectory == "") {
      alert("Please select a directory to upload to");
      return;
    }

    // Get the path of the directory and set it in the form.
    var directoryPath = directoryTree.getUserData(inSelectedDirectory, "path");
    dwr.util.setValue("uploadDirectory", directoryPath);

    // Open the file upload form.
    dwr.util.byId("divFileUpload").style.display = "block";

  } // End doUpload().


  /**
   * This is called to show the About dialog.
   */
  this.doAbout = function() {

    // Just a simple alert popup.
    alert("DWR File Manager v1.0\nAugust 11, 2007\n\nBy Frank W. Zammetti\n\n" +
      "As it appeared in the book " +
      "\"Practical DWR 2 Projects\"\n" +
      "Published by Apress, Inc. (ISBN 1-59059-941-1)");

  } // End doAbout().


  /**
   * This is called to allow the user to print the contents of the currently
   * selected directory.
   *
   * @param  inSelectedDirectory The node ID in the directory tree of the
   *                             selected directory.
   */
  this.doPrintDirectoryContents = function(inSelectedDirectory) {

    // Only do something if a directory is selected.
    if (inSelectedDirectory == null || inSelectedDirectory == "") {
      alert("Please select a directory to print the contents of");
      return;
    }

    // Get path of clicked directory.
    var path = directoryTree.getUserData(inSelectedDirectory, "path");

    // Clear grid and put in loading message.
    FileSystemFunctions.listFiles(path,
      { callback : function(inResp) {
          // Iterate over the collection of FileVO objects returned
          var htm = "<html><head><title></title></head>" +
            "<body><table border=\"0\" width=\"100%\" " +
            "style=\"font-size:8pt;font-weight:bold;\"><tr>";
          for (var i = 0; i < inResp.length; i++) {
            // For each, generate markup to display and then insert it.
            htm += "<tr valign=\"top\"><td>" + inResp[i].name + "</td><td>" +
              inResp[i].size + "</td><td>" + inResp[i].type + "</td><td>" +
              inResp[i].modified + "</td></tr>";
          }
          htm += "</table></body></html>";
          var printDialog = window.open("", "", "width=780,height=500");
          printDialog.document.open()
          printDialog.document.write(htm)
          printDialog.document.close()
          printDialog.print();
          printDialog.close();
        }
      }
    );

  } // End doPrintDirectoryContents().


} // End Fileman class.


// The one and only instance of Fileman.
var fileman = new Fileman();
