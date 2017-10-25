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


//
// Record descriptors and data stores.
//


/**
 * Category record descriptor.
 */
CodeCabinetExt.Data.CategoryRecord = Ext.data.Record.create([
  { name : "name", mapping : "name" }
]);


/**
 * Snippet record descriptor.
 */
CodeCabinetExt.Data.SnippetRecord = Ext.data.Record.create([
  { name : "categoryname", mapping : "categoryname" },
  { name : "name", mapping : "name" },
  { name : "description", mapping : "description" },
  { name : "author", mapping : "author" },
  { name : "email", mapping : "email" },
  { name : "weblink", mapping : "weblink" },
  { name : "code", mapping : "code" },
  { name : "notes", mapping : "notes" },
  { name : "keyword1", mapping : "keyword1" },
  { name : "keyword2", mapping : "keyword2" },
  { name : "keyword3", mapping : "keyword3" },
  { name : "keyword4", mapping : "keyword4" },
  { name : "keyword5", mapping : "keyword5" }
]);


/**
 * This is a store containing a CategoryRecord for each category.
 */
CodeCabinetExt.Data.CategoriesStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (Ext.MessageBox.isVisible()) { return; }
        CodeCabinetExt.Data.DAO.createCategory(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        CodeCabinetExt.Data.DAO.deleteCategory(inRecord.get("name"));
      }
    }
  }
});


/**
 * This is a temporary store used to show snippets in the current category.
 */
CodeCabinetExt.Data.SnippetsStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (CodeCabinetExt.populatingSnippetsStore) { return; }
        CodeCabinetExt.Data.DAO.createSnippet(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        if (CodeCabinetExt.populatingSnippetsStore) { return; }
        CodeCabinetExt.Data.DAO.deleteSnippet(inRecord.id);
      }
    },
    "update" : {
      fn : function(inStore, inRecord, inIndex) {
        CodeCabinetExt.Data.DAO.updateSnippet(inRecord);
      }
    }
  }
});


/**
 * This is a temporary store used to show search results.
 */
CodeCabinetExt.Data.SearchResultsStore = new Ext.data.Store({});
