/*
    Code Cabinet Ext - From the book "Practical Ext JS Projects With Gears"
    Copyright (C) 2008 Frank W. Zammetti
    fzammetti@omnytex.com

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses.
*/


/**
 * JSON (config object) that describes the search form section.
 */
CodeCabinetExt.UIObjects.SearchForm = function () { return ({
  id : "SearchForm", labelWidth : 100, border : false,
  bodyStyle : "padding:4px", items : [
    { xtype : "textfield", fieldLabel : "Keywords",
      name : "keywords" },
    { xtype : "textfield", fieldLabel : "Code",
      name : "code" },
    { xtype : "textfield", fieldLabel : "Name",
      name : "name" },
    { xtype : "textfield", fieldLabel : "Description",
      name : "description" },
    { xtype : "textfield", fieldLabel : "Author",
      name : "author" },
    { xtype : "textfield", fieldLabel : "Notes",
      name : "notes" }
  ], buttons : [
    { xtype : "button", text : "Search",
      icon : "img/icon_save.gif", cls : "x-btn-text-icon",
      handler : CodeCabinetExt.UIEventHandlers.SearchClick },
    { xtype : "button", text : "Clear",
      icon : "img/icon_snippet_delete.gif", cls : "x-btn-text-icon",
      handler : CodeCabinetExt.UIEventHandlers.ClearClick }
  ]
}); };


/**
 * Event handler called when the Search button is clicked.
 */
CodeCabinetExt.UIEventHandlers.SearchClick = function() {

  // Get all search parameters.  Trim them and make them lower-case.
  var searchVals = Ext.getCmp("SearchForm").getForm().getValues();
  searchVals.keywords = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.keywords));
  searchVals.code = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.code));
  searchVals.name = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.name));
  searchVals.author = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.author));
  searchVals.description = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.description));
  searchVals.notes = Ext.util.Format.trim(
    Ext.util.Format.lowercase(searchVals.notes));

  // Ensure acceptable criteria are entered.
  if (searchVals.keywords == "" && searchVals.code == "" &&
    searchVals.name == "" && searchVals.author == "" &&
    searchVals.description == "" && searchVals.notes == "") {
      Ext.MessageBox.show({
        title : "Unable to perform search", buttons : Ext.MessageBox.OK,
        animEl : "divSource",
        msg : "I'm sorry but you must enter at least one search criterion " +
        "in order to perform a search."
      });
    return;
  }

  // "Clear" the searchStore.
  CodeCabinetExt.Data.SearchResultsStore.removeAll();

  // Retrieve all snippets in all categories.
  var snippets = CodeCabinetExt.Data.DAO.retrieveSnippets();

  // Cycle through them and find the matches.
  var matchesFound = false;
  for (var i = 0; i < snippets.length; i++) {

    // Get the data from the next snippet, trim it nice and make it
    // lower-case so searches are case-insensitive.
    var snippetKeyword1 = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("keyword1")));
    var snippetKeyword2 = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("keyword2")));
    var snippetKeyword3 = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("keyword3")));
    var snippetKeyword4 = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("keyword4")));
    var snippetKeyword5 = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("keyword5")));
    var snippetCode = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("code")));
    var snippetName = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("name")));
    var snippetAuthor = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("author")));
    var snippetDescription = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("description")));
    var snippetNotes = Ext.util.Format.trim(
      Ext.util.Format.lowercase(snippets[i].get("notes")));

    // This variable will have a T or F added to it for each search
    // criteria that was entered.  If we get to the end and there's any
    // F's in it, then this snippet didn't match one of the entered
    // criteria and is therefore not a match.
    var matched = "";

    // Search includes name.
    if (searchVals.name != "") {
      if (snippetName.indexOf(searchVals.name) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes code.
    if (searchVals.code != "") {
      if (snippetCode.indexOf(searchVals.code) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes author.
    if (searchVals.author != "") {
      if (snippetAuthor.indexOf(searchVals.author) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes description.
    if (searchVals.description != "") {
      if (snippetDescription.indexOf(searchVals.description) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes notes.
    if (searchVals.notes != "") {
      if (snippetNotes.indexOf(searchVals.notes) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes keyword(s).
    if (searchVals.keywords != "") {
      var a = searchVals.keywords.split(",");
      var foundAny = false;
      for (var j = 0; j < a.length; j++) {
        var nextKeyword = Ext.util.Format.trim(a[j]);
        if (nextKeyword != "") {
          if (snippetKeyword1 == nextKeyword ||
            snippetKeyword2 == nextKeyword || snippetKeyword3 == nextKeyword ||
            snippetKeyword4 == nextKeyword || snippetKeyword5 == nextKeyword) {
            foundAny = true;
          }
        }
      }
      if (foundAny) {
        matched += "T";
      } else {
        matched += "F";
      }
    }

    // If current snippet matches the search criteria, add it to the
    // SearchResultsStore.
    if (matched.indexOf("F") == -1) {
      matchesFound = true;
      CodeCabinetExt.Data.SearchResultsStore.add(snippets[i]);
    }

  } // End iteration over snippets.

  // If matches were found, show the results grid, otherwise show the
  // "no matches" message.
  if (matchesFound) {
    Ext.getCmp("SearchResults").getLayout().setActiveItem(2);
  } else {
    Ext.getCmp("SearchResults").getLayout().setActiveItem(1);
  }

}; // End CodeCabinetExt.UIEventHandlers.SearchClick().


/**
 * Event handler called when the Clear button is clicked.
 */
CodeCabinetExt.UIEventHandlers.ClearClick = function() {

  Ext.getCmp("SearchForm").getForm().reset();

}; // End CodeCabinetExt.UIEventHandlers.ClearClick().
