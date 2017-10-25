/*
    Local Business Search - From the book "Practical Ext JS Projects With Gears"
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
 * JSON (config object) that describes the search TabPanel.
 */
LocalBusinessSearch.UIObjects.SearchTabPanel = function() { return ({
  id : "SearchTabs", activeTab : 0, height : 300, items : [
    /* Search form. */
    { title : "Search", id : "tabSearch",
      bodyStyle : "padding:4px", items : [
        { xtype : "form", id : "SearchForm", labelWidth : 100,
          border : false, monitorValid : true, items : [
            /* Keyword. */
            { xtype : "textfield", fieldLabel : "Keyword",
              name : "query", width : 250, allowBlank : false },
            /* Sort By. */
            { xtype : "combo", fieldLabel : "Sort By", width : 90,
              name : "sort", editable : false, triggerAction : "all",
              mode : "local", valueField : "optVal", displayField : "optVal",
              store : LocalBusinessSearch.Data.searchSortStore },
            /* Minimum Rating. */
            { xtype : "combo", fieldLabel : "Minimum Rating", width : 40,
              name : "minimum_rating", editable : false, triggerAction : "all",
              mode : "local", valueField : "optVal", displayField : "optVal",
              store : LocalBusinessSearch.Data.searchMinimumRatingStore },
            /* Street. */
            { xtype : "textfield", fieldLabel : "Street",
              name : "street", id : "searchStreet", width : 200 },
            /* City. */
            { xtype : "textfield", fieldLabel : "City",
              name : "city", id : "searchCity", width : 175 },
            /* State. */
            { xtype : "combo", fieldLabel : "State", width : 125,
              name : "state", editable : false, triggerAction : "all",
              mode : "local", valueField : "optVal", displayField : "optVal",
              store : LocalBusinessSearch.Data.searchStateStore,
              id : "searchState" },
            /* Zip Code. */
            { xtype : "textfield", fieldLabel : "Zip Code", vtype : "zipcode",
              name : "zip", id : "searchZip", width : 50 },
            /* Radius. */
            { xtype : "numberfield", fieldLabel : "Radius", width : 175,
              name : "radius", minValue : 5, maxValue : 1000, width : 50 }
          ],
          /* Execute Search and Save Location As Default buttons. */
          buttons : [
            { text : "Execute Search", formBind : true,
              icon : "img/icon_search.gif",
              cls : "x-btn-text-icon", handler : function() {
                LocalBusinessSearch.UIEventHandlers.executeSearch();
              }
            },
            { text : "Save Location As Default",
              icon : "img/icon_save.gif", cls : "x-btn-text-icon",
              handler :
                LocalBusinessSearch.UIEventHandlers.saveLocationAsDefault
            }
          ]
        }
      ]
    },
    /* Search results tab. */
    { title : "Results", id : "tabResults", layout : "fit", disabled : true,
      xtype : "grid", autoExpandColumn : "colTitle", stripeRows : true,
      sm : new Ext.grid.RowSelectionModel( { singleSelect : true } ),
      listeners: {
        rowclick : {
          fn : function(inGrid, inRowIndex, inEventObject) {
            LocalBusinessSearch.currentBusiness =
              inGrid.getSelectionModel().getSelected();
            LocalBusinessSearch.currentIsFavorite = false;
            LocalBusinessSearch.populateDetails();
            Ext.getCmp("DetailsPane").expand();
            LocalBusinessSearch.getMap();
          }
        }
      },
      store : LocalBusinessSearch.Data.ResultsStore, columns : [
        { header : "Title", sortable : true,
          dataIndex : "title", id : "colTitle" },
        { header : "Distance", sortable : true, dataIndex : "distance" },
        { header : "Rating", sortable : true, dataIndex : "rating" }
      ],
      /* Paging toolbar. */
      bbar : new Ext.PagingToolbar({
        pageSize : 10, paramNames : { start : "start", limit : "results" },
        store : LocalBusinessSearch.Data.ResultsStore,
        displayInfo : true, id : "bbar",
        displayMsg : "Displaying results {0} - {1} of {2}",
        emptyMsg : "No data to display"
      })
    }
  ]
}); };


/**
 * Event handler called to execute a search.
 */
LocalBusinessSearch.UIEventHandlers.executeSearch = function() {

  // Get values from search form and store them on our main app object.
  LocalBusinessSearch.searchParams =
    Ext.getCmp("SearchForm").getForm().getValues();

  // Input validation: Location required.
  if (LocalBusinessSearch.searchParams.street == "" &&
    LocalBusinessSearch.searchParams.city == "" &&
    LocalBusinessSearch.searchParams.state == "" &&
    LocalBusinessSearch.searchParams.zip == "") {
    Ext.MessageBox.show({
      title : "Search Criteria Error", buttons : Ext.MessageBox.OK,
      msg : "You must enter a location to search around " +
      "(just zip code at a minimum)", animEl : "divSource"
    });
    return;
  }
  // Input validation: City and State required when Street entered.
  if (LocalBusinessSearch.searchParams.street != "" &&
    (LocalBusinessSearch.searchParams.city == "" ||
     LocalBusinessSearch.searchParams.state == "")) {
    Ext.MessageBox.show({
      title : "Search Criteria Error", buttons : Ext.MessageBox.OK,
      msg : "When street is entered you must also enter city and state",
      animEl : "divSource"
    });
    return;
  }

  // Show Please Wait and disable results tab.
  Ext.MessageBox.show({
    title : "Please Wait",
    msg : "<span class='cssPleaseWait'>... Searching ...</span>",
    buttons : false, closable : false
  });
  Ext.getCmp("tabResults").disable();

  // Set default for sort order if not entered.
  if (Ext.isEmpty(LocalBusinessSearch.searchParams.sort)) {
    LocalBusinessSearch.searchParams.sort = "distance";
  }
  // Set default for radius if not entered.
  if (Ext.isEmpty(LocalBusinessSearch.searchParams.radius)) {
    LocalBusinessSearch.searchParams.radius = 5;
  }
  // Set default for minimum rating if not entered.
  if (Ext.isEmpty(LocalBusinessSearch.searchParams.minimum_rating)) {
    LocalBusinessSearch.searchParams.minimum_rating = 0;
  }

  // Add attribute to searchParams so it contains all the parameters the
  // web service requires and normalize any values as necessary.
  LocalBusinessSearch.searchParams.appid = LocalBusinessSearch.appID;
  LocalBusinessSearch.searchParams.output = "json";
  LocalBusinessSearch.searchParams.sort =
    Ext.util.Format.lowercase(LocalBusinessSearch.searchParams.sort);

  // Tell ResultsStore to load the initial set of data.
  LocalBusinessSearch.Data.ResultsStore.load({
    params : { start : 0, results : 10 },
    callback : function(inRecords, inOptions, inSuccess) {
      // Pop message if no search results.
      if (inRecords.length == 0) {
        Ext.MessageBox.show({
          title : LocalBusinessSearch.resultsTitle, buttons : Ext.MessageBox.OK,
          msg : LocalBusinessSearch.resultsMessage, closable : true,
          animEl : "divSource"
        });
        return;
      }
      // All good, enable results tab and flip to it.
      Ext.getCmp("tabResults").enable();
      Ext.getCmp("SearchTabs").setActiveTab("tabResults");
      Ext.MessageBox.hide();
    }
  });

}; // End LocalBusinessSearch.UIEventHandlers.executeSearch().


/**
 * Event handler called to save a search result as a favorite.
 */
LocalBusinessSearch.UIEventHandlers.saveLocationAsDefault = function() {

  // Save location values for one year.
  var formVals = Ext.getCmp("SearchForm").getForm().getValues();
  LocalBusinessSearch.cookieProvider.set(
    "defaultLocation_street", formVals.street);
  LocalBusinessSearch.cookieProvider.set(
    "defaultLocation_city", formVals.city);
  LocalBusinessSearch.cookieProvider.set(
    "defaultLocation_state", formVals.state);
  LocalBusinessSearch.cookieProvider.set(
    "defaultLocation_zip", formVals.zip);

  // Tell the user we're done.
  Ext.MessageBox.show({
    title : "Default Location Saved", buttons : Ext.MessageBox.OK,
    msg : "This location has been saved and will be used automatically " +
    "next time you start the application", animEl : "divSource"
  });

}; // End LocalBusinessSearch.UIEventHandlers.saveLocationAsDefault().
