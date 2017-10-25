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
 * JSON (config object) that describes the details section.
 */
CodeCabinetExt.UIObjects.Details = function() { return ({
  buttons : [
    { xtype : "button", text : "Save",
      icon : "img/icon_save.gif", cls : "x-btn-text-icon",
      handler : CodeCabinetExt.UIEventHandlers.SaveClick
    }
  ],
  id : "Details", activeTab : 0, items : [
    { title : "Snippets", id : "tabSnippets", layout : "card",
      activeItem : 0, items : [
        { id : "SnippetsMessage", border : false,
          bodyStyle : "text-align:center;padding-top:75px;",
          html : "Select a category to view the snippets in it" },
        { id : "SnippetsGrid", xtype : "grid", border : false,
          autoExpandColumn : "colDescription", stripeRows : true,
          sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
          listeners: {
            rowclick : {
              fn : function(inGrid, inRowIndex, inEventObject) {
                CodeCabinetExt.UIEventHandlers.RowClick(
                  inGrid.getSelectionModel().getSelected()
                );
              }
            }
          },
          store : CodeCabinetExt.Data.SnippetsStore, columns : [
            { header : "Snippet Name", sortable : true,
              dataIndex : "name", width : 200 },
            { header : "Description", sortable : true,
              dataIndex : "description", id : "colDescription" }
          ]
        }
      ]
    },
    { disabled : true, title : "Info", layout : "fit", id : "tabInfo",
      bodyStyle : "padding:4px", items : [
        { xtype : "form", id : "InfoForm", labelWidth : 100,
          border : false, items : [
            { xtype : "textfield", fieldLabel : "Name",
              id : "info_name", name : "name", width : 200 },
            { xtype : "textfield", fieldLabel : "Description",
              id : "info_description", name : "description", width : 200 },
            { xtype : "textfield", fieldLabel : "Author",
              id : "info_author", name : "author", width : 200 },
            { xtype : "textfield", fieldLabel : "eMail",
              id : "info_email", name : "email", width : 200 },
            { xtype : "textfield", fieldLabel : "Web Link",
              id : "info_weblink", name : "weblink", width : 200 }
          ]
        }
      ]
    },
    { disabled : true, title : "Code", layout : "fit", id : "tabCode",
      bodyStyle : "padding:4px", items : [
        { xtype : "form", id : "CodeForm", layout : "fit",
          items : [
            { xtype : "htmleditor", name : "code", hideLabel : true,
              id : "code_code" }
          ]
        }
      ]
    },
    { disabled : true, title : "Notes", layout : "fit", id : "tabNotes",
      bodyStyle : "padding:4px", items : [
        { xtype : "form", id : "NotesForm", layout : "fit",
          items : [
            { xtype : "htmleditor", name : "notes", hideLabel : true,
              id : "notes_note" }
          ]
        }
      ]
    },
    { disabled : true, title : "Keywords", layout : "fit",
      id : "tabKeywords", items : [
        { xtype : "form", id : "KeywordsForm", labelWidth : 100,
          border : false, bodyStyle : "padding:4px", items : [
            { xtype : "textfield", name : "keyword1", id : "keywords_keyword1",
              fieldLabel : "Keyword 1", width : 200 },
            { xtype : "textfield", name : "keyword2", id : "keywords_keyword2",
              fieldLabel : "Keyword 2", width : 200 },
            { xtype : "textfield", name : "keyword3", id : "keywords_keyword3",
              fieldLabel : "Keyword 3", width : 200 },
            { xtype : "textfield", name : "keyword4", id : "keywords_keyword4",
              fieldLabel : "Keyword 4", width : 200 },
            { xtype : "textfield", name : "keyword5", id : "keywords_keyword5",
              fieldLabel : "Keyword 5", width : 200 }
          ]
        }
      ]
    }
  ]
}); };


/**
 * Event handler called when the Save button is clicked on any tab.
 */
CodeCabinetExt.UIEventHandlers.SaveClick = function() {

  // Set the values on the currentSnippet Record, triggering an update.
  CodeCabinetExt.currentSnippet.beginEdit();
  CodeCabinetExt.currentSnippet.set("name", Ext.getCmp("info_name").getValue());
  CodeCabinetExt.currentSnippet.set("description",
    Ext.getCmp("info_description").getValue());
  CodeCabinetExt.currentSnippet.set("author",
    Ext.getCmp("info_author").getValue());
  CodeCabinetExt.currentSnippet.set("email",
    Ext.getCmp("info_email").getValue());
  CodeCabinetExt.currentSnippet.set("weblink",
    Ext.getCmp("info_weblink").getValue());
  CodeCabinetExt.currentSnippet.set("code", Ext.getCmp("code_code").getValue());
  CodeCabinetExt.currentSnippet.set("notes",
    Ext.getCmp("notes_note").getValue());
  CodeCabinetExt.currentSnippet.set("keyword1",
    Ext.getCmp("keywords_keyword1").getValue());
  CodeCabinetExt.currentSnippet.set("keyword2",
    Ext.getCmp("keywords_keyword2").getValue());
  CodeCabinetExt.currentSnippet.set("keyword3",
    Ext.getCmp("keywords_keyword3").getValue());
  CodeCabinetExt.currentSnippet.set("keyword4",
    Ext.getCmp("keywords_keyword4").getValue());
  CodeCabinetExt.currentSnippet.set("keyword5",
    Ext.getCmp("keywords_keyword5").getValue());
  CodeCabinetExt.currentSnippet.endEdit();

}; // End CodeCabinetExt.UIEventHandlers.SaveClick().


/**
 * Event handler called when a row in the snippet Grid is clicked.  This is also
 * called when a row in the search results Grid is clicked.
 *
 * @param inRecord            The SnippetRecord represented by the clicked row.
 * @param inFromSearchResults This will be set to true when this function is
 *                            call from the search results Grid.
 */
CodeCabinetExt.UIEventHandlers.RowClick = function(inRecord,
  inFromSearchResults) {

  // If coming from search results, we need to select the category for the
  // snippet in the Tree and then get the snippet from the SnippetsStore.
  if (inFromSearchResults) {
    var tree = Ext.getCmp("Tree");
    var node = tree.getNodeById(inRecord.get("categoryname"));
    node.select();
    tree.fireEvent("click", node, null);
  }

  // Set inRecord it as current.
  CodeCabinetExt.currentSnippet = inRecord;

  // Enable the appropriate toolbar items.
  Ext.getCmp("DeleteSnippet").setDisabled(false);
  Ext.getCmp("tabInfo").setDisabled(false);
  Ext.getCmp("tabCode").setDisabled(false);
  Ext.getCmp("tabNotes").setDisabled(false);
  Ext.getCmp("tabKeywords").setDisabled(false);

  // Populate the entry fields on the Keywords tab.
  Ext.getCmp("keywords_keyword1").setValue(inRecord.get("keyword1"));
  Ext.getCmp("keywords_keyword2").setValue(inRecord.get("keyword2"));
  Ext.getCmp("keywords_keyword3").setValue(inRecord.get("keyword3"));
  Ext.getCmp("keywords_keyword4").setValue(inRecord.get("keyword4"));
  Ext.getCmp("keywords_keyword5").setValue(inRecord.get("keyword5"));

  // Populate the entry fields on the Notes tab.
  Ext.getCmp("notes_note").setValue(inRecord.get("notes"));

  // Populate the entry fields on the Code tab.
  Ext.getCmp("code_code").setValue(inRecord.get("code"));

  // Populate the entry fields on the Info tab.
  Ext.getCmp("info_name").setValue(inRecord.get("name"));
  Ext.getCmp("info_description").setValue(inRecord.get("description"));
  Ext.getCmp("info_author").setValue(inRecord.get("author"));
  Ext.getCmp("info_email").setValue(inRecord.get("email"));
  Ext.getCmp("info_weblink").setValue(inRecord.get("weblink"));

  // Flip to the Info tab.
  Ext.getCmp("Details").getLayout().setActiveItem(1);
  Ext.getCmp("tabInfo").show();

}; // End CodeCabinetExt.UIEventHandlers.RowClick().
