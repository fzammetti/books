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
 * JSON (config object) that describes the details Accordion.
 */
LocalBusinessSearch.UIObjects.DetailsPanel = function() { return ({
  layout : "accordion", layoutConfig : { animate : true }, id : "Details",
  defaults: { bodyStyle : "overflow:auto;padding:10px;" }, items : [
    { title : "Details", id : "DetailsPane", collapsed : true, html :
      "<table width=\"100%\">" +
      "  <tr>" +
      "    <td width=\"20%\" class=\"cssDetailLabel\">Title:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_title\"></td>" +
      "  </tr>" +
      "  <tr class=\"cssAltRow\">" +
      "    <td class=\"cssDetailLabel\">Longitude:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_longitude\"></td>" +
      "  </tr>" +
      "  <tr>" +
      "    <td class=\"cssDetailLabel\">Latitude:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_latitude\"></td>" +
      "  </tr>" +
      "  <tr class=\"cssAltRow\">" +
      "    <td  class=\"cssDetailLabel\">Distance:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_distance\"></td>" +
      "  </tr>" +
      "  <tr>" +
      "    <td class=\"cssDetailLabel\">Phone:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_phone\"></td>" +
      "  </tr>" +
      "  <tr class=\"cssAltRow\">" +
      "    <td class=\"cssDetailLabel\">Rating:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_rating\"></td>" +
      "  </tr>" +
      "  <tr>" +
      "    <td class=\"cssDetailLabel\">Address:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_address\"></td>" +
      "  </tr>" +
      "  <tr class=\"cssAltRow\">" +
      "    <td class=\"cssDetailLabel\">City:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_city\"></td>" +
      "  </tr>" +
      "  <tr>" +
      "    <td class=\"cssDetailLabel\">State:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_state\"></td>" +
      "  </tr>" +
      "  <tr class=\"cssAltRow\">" +
      "    <td class=\"cssDetailLabel\">Business Web Site:&nbsp;</td>" +
      "    <td class=\"cssDetailData\" id=\"details_businessurl\"></td>" +
      "  </tr>" +
      "</table>"
    },
    { forceLayout : true, title : "Map", id : "MapPane", collapsed : true,
      items : [
        { xtype : "panel", layout : "table", border : false,
          layoutConfig : { columns : 12 }, items : [
            { id : "btnZoom1", xtype : "button", text : "Street",
              handler : function() { LocalBusinessSearch.getMap(1); }
            },
            { id : "btnZoom2", xtype : "button", text : "2",
              handler : function() { LocalBusinessSearch.getMap(2); }
            },
            { id : "btnZoom3", xtype : "button", text : "3",
              handler : function() { LocalBusinessSearch.getMap(3); }
            },
            { id : "btnZoom4", xtype : "button", text : "4",
              handler : function() { LocalBusinessSearch.getMap(4); }
            },
            { id : "btnZoom5", xtype : "button", text : "5",
              handler : function() { LocalBusinessSearch.getMap(5); }
            },
            { id : "btnZoom6", xtype : "button", text : "6",
              handler : function() { LocalBusinessSearch.getMap(6); }
            },
            { id : "btnZoom7", xtype : "button", text : "7",
              handler : function() { LocalBusinessSearch.getMap(7); }
            },
            { id : "btnZoom8", xtype : "button", text : "8",
              handler : function() { LocalBusinessSearch.getMap(8); }
            },
            { id : "btnZoom9", xtype : "button", text : "9",
              handler : function() { LocalBusinessSearch.getMap(9); }
            },
            { id : "btnZoom10", xtype : "button", text : "10",
              handler : function() { LocalBusinessSearch.getMap(10); }
            },
            { id : "btnZoom11", xtype : "button", text : "11",
              handler : function() { LocalBusinessSearch.getMap(11); }
            },
            { id : "btnZoom12", xtype : "button", text : "Country",
              handler : function() { LocalBusinessSearch.getMap(12); }
            }
          ]
        },
        { border : false, bodyStyle : "text-align:center", html :
          "<img id=\"imgMap\" vspace=\"6\" " +
          "style=\"border:1px solid #000000;display:none;\">"
        }
      ]
    }
  ]
}); };


/**
 * Called to populate the details for the currently selected business.
 */
LocalBusinessSearch.populateDetails = function() {

  // Get the currently selected BusinessRecord, or create an empty one to use
  // to account for the case where this method is called and there is no
  // currently selected business, like after a favorite is deleted.
  var record = LocalBusinessSearch.currentBusiness ||
    new LocalBusinessSearch.Data.BusinessRecord({});

  // Populate the detail fields and show detail pane on Accordion.
  Ext.getDom("details_title").innerHTML =
    Ext.util.Format.defaultValue(record.get("title"), "");
  Ext.getDom("details_distance").innerHTML =
    Ext.util.Format.defaultValue(record.get("distance"), "");
  Ext.getDom("details_phone").innerHTML =
    Ext.util.Format.defaultValue(record.get("phone"), "");
  Ext.getDom("details_rating").innerHTML =
    Ext.util.Format.defaultValue(record.get("rating"), "");
  Ext.getDom("details_address").innerHTML =
    Ext.util.Format.defaultValue(record.get("address"), "");
  Ext.getDom("details_city").innerHTML =
    Ext.util.Format.defaultValue(record.get("city"), "");
  Ext.getDom("details_state").innerHTML =
    Ext.util.Format.defaultValue(record.get("state"), "");
  Ext.getDom("details_latitude").innerHTML =
    Ext.util.Format.defaultValue(record.get("latitude"), "");
  Ext.getDom("details_longitude").innerHTML =
    Ext.util.Format.defaultValue(record.get("longitude"), "");
  Ext.getDom("details_businessurl").innerHTML =
    Ext.util.Format.defaultValue(record.get("businessurl"), "");

}; // End LocalBusinessSearch.populateDetails().


/**
 * Called to get the map for the currently selected business.
 */
LocalBusinessSearch.getMap = function(inZoomLevel) {

  // This method is called in some situations, like after deleting a favorite,
  // where there is no currently selected business, so account for that first.
  if (!LocalBusinessSearch.currentBusiness) {
    var mapTag = Ext.getDom("imgMap");
    mapTag.style.display = "none";
    return;
  }

  // Set new zoom level, or default if not specified by caller.
  if (inZoomLevel) {
    LocalBusinessSearch.zoomLevel = inZoomLevel;
  } else {
    LocalBusinessSearch.zoomLevel = 6;
  }

  // Disable the button for the current zoom level, enabling all others.
  for (var i = 1; i < 13; i++) {
    var b = Ext.getCmp("btnZoom" + i);
    if (i == LocalBusinessSearch.zoomLevel) {
      b.disable();
    } else {
      b.enable();
    }
  }

  // Get the map and display it using a "naked" ScriptTagProxy.
  new Ext.data.ScriptTagProxy(
    { url : LocalBusinessSearch.mapWebServiceURL }
  ).doRequest("read", null,
    {
      // Add parameters needed for map retrieval.
      appid : LocalBusinessSearch.appID, output : "json",
      "longitude" : LocalBusinessSearch.currentBusiness.get("longitude"),
      "latitude" : LocalBusinessSearch.currentBusiness.get("latitude"),
      image_width : 480, image_height : 460,
      zoom : LocalBusinessSearch.zoomLevel
    },
    new (Ext.extend(new Function(), Ext.data.DataReader, {
      readRecords : function(inObject) {
        // Don't convert to Records here, just return the JSON response.
        return inObject;
      }
    }))(),
    function(inObject) {
      // Show the map and point it to the appropriate URL.
      var mapTag = Ext.getDom("imgMap");
      mapTag.style.display = "";
      mapTag.src = inObject.ResultSet.Result;
    }
  );

}; // End LocalBusinessSearch.getMap().
