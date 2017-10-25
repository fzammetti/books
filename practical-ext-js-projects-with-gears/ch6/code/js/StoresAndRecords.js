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


//
// Record descriptors and data stores.
//


/**
 * Business record descriptor.
 */
LocalBusinessSearch.Data.BusinessRecord = Ext.data.Record.create([
  { name : "title", mapping : "title" },
  { name : "distance", mapping : "distance" },
  { name : "phone", mapping : "phone" },
  { name : "rating", mapping : "rating" },
  { name : "address", mapping : "address" },
  { name : "city", mapping : "city" },
  { name : "state", mapping : "state" },
  { name : "latitude", mapping : "latitude" },
  { name : "longitude", mapping : "longitude" },
  { name : "businessurl", mapping : "businessurl" }
]);


/**
 * This is a temporary Store used to show search results.
 */
LocalBusinessSearch.Data.ResultsStore = new Ext.data.Store({
  /* Define beforeload event listener to deal with parameter setting. */
  listeners : {
    beforeload : function(inStore, inOptions) {
      inStore.baseParams = LocalBusinessSearch.searchParams;
    }
  },
  /* Use ScriptTagProxy to call Yahoo! search service. */
  proxy : new Ext.data.ScriptTagProxy(
    { url : LocalBusinessSearch.searchWebServiceURL }
  ),
  /* A custom DataReader to use. */
  reader : new (Ext.extend(new Function(), Ext.data.DataReader, {
      readRecords : function(inObject) {
        // Handle error conditions returned by service.
        if (inObject.Error) {
          LocalBusinessSearch.resultsTitle = inObject.Error.title;
          LocalBusinessSearch.resultsMessage = inObject.Error.Message[0];
          return { success : true, records : new Array(), totalRecords : 0 };
        }
        // Get the total number of results available as a number.
        var totalResultsAvailable =
          parseInt(inObject.ResultSet.totalResultsAvailable);
        // If there are no results, we have to abort.
        if (totalResultsAvailable == 0) {
          LocalBusinessSearch.resultsTitle = "No results";
          LocalBusinessSearch.resultsMessage =
            "The search criteria you provided returned no matches.";
          return { success : true, records : new Array(), totalRecords : 0 };
        }
        // If there are more than 200 results, we have to abort.
        if (totalResultsAvailable > 200) {
          LocalBusinessSearch.resultsTitle = "Too many results";
          LocalBusinessSearch.resultsMessage =
            "The search criteria you provided returned more than 200 " +
            "matches.  Please narrow your search.";
          return { success : true, records : new Array(), totalRecords : 0 };
        }
        // All good, so parse returned JSON and create BusinessRecords from it.
        var recs = new Array();
        for (var i = 0; i < inObject.ResultSet.Result.length; i++) {
          // Have to handle AverageRating a little differently, so grab it now.
          var ratingVal = inObject.ResultSet.Result[i].Rating.AverageRating;
          // Create the BusinessRecord itself.
          recs.push(new LocalBusinessSearch.Data.BusinessRecord({
            title : inObject.ResultSet.Result[i].Title,
            distance : inObject.ResultSet.Result[i].Distance,
            phone : inObject.ResultSet.Result[i].Phone,
            rating : (isNaN(ratingVal) ? 0 : ratingVal),
            address : inObject.ResultSet.Result[i].Address,
            city : inObject.ResultSet.Result[i].City,
            state : inObject.ResultSet.Result[i].State,
            latitude : inObject.ResultSet.Result[i].Latitude,
            longitude : inObject.ResultSet.Result[i].Longitude,
            businessurl : inObject.ResultSet.Result[i].BusinessUrl
          }, inObject.ResultSet.Result[i].id));
        }
        // Return our final object as expected.
        return {
          success : true, records : recs, totalRecords : totalResultsAvailable
        };
      }
  }))
});


/**
 * This is a simple store for populating the Sort By search ComboBox.
 */
LocalBusinessSearch.Data.searchSortStore = new Ext.data.Store({});
var sortByVals = [ "Distance", "Relevance", "Title", "Rating" ];
for (var i = 0; i < sortByVals.length; i++ ) {
  LocalBusinessSearch.Data.searchSortStore.add
    (new Ext.data.Record( { optVal : sortByVals[i] } )
  );
}


/**
 * This is a simple store for populating the Minimum Rating search ComboBox.
 */
LocalBusinessSearch.Data.searchMinimumRatingStore = new Ext.data.Store({});
var minimumRatingVals = [ "0", "1", "2", "3", "4", "5" ];
for (var i = 0; i < minimumRatingVals.length; i++ ) {
  LocalBusinessSearch.Data.searchMinimumRatingStore.add
    (new Ext.data.Record( { optVal : minimumRatingVals[i] } )
  );
}


/**
 * This is a simple store for populating the State search ComboBox.
 */
LocalBusinessSearch.Data.searchStateStore = new Ext.data.Store({});
var stateVals = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];
for (var i = 0; i < stateVals.length; i++ ) {
  LocalBusinessSearch.Data.searchStateStore.add
    (new Ext.data.Record( { optVal : stateVals[i] } )
  );
}


/**
 * This is the Store where are favorites will be... err... STORED!
 */
LocalBusinessSearch.Data.FavoritesStore = new Ext.data.Store({
  listeners : {
    "add" : {
      fn : function(inStore, inRecords, inIndex) {
        if (LocalBusinessSearch.skipFavoritesStoreEvents) { return; }
        LocalBusinessSearch.Data.DAO.createFavorite(inRecords[0]);
      }
    },
    "remove" : {
      fn : function(inStore, inRecord, inIndex) {
        LocalBusinessSearch.Data.DAO.deleteFavorite(inRecord.id);
      }
    },
    "clear" : {
      fn : function(inStore, inRecord, inIndex) {
        LocalBusinessSearch.Data.DAO.deleteFavorite();
      }
    }
  }
});
