/*
    Local Business Search - From the book 
    "Practical webOS Projects With the Palm Pre"
    Copyright (C) 2009 Frank W. Zammetti
    fzammetti@etherient.com

    Licensed under the terms of the MIT license as follows:

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to 
    deal in the Software without restriction, including without limitation the 
    rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
    sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
    FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
    IN THE SOFTWARE.
*/


/**
 * The scene's assistant class.
 */
function DetailsAssistant() { };


/**
 * Reference to the method bound to this assistant for orientation change
 * event handling.
 */
DetailsAssistant.prototype.orientationBind = null; 
  

/**
 * The model for the command menu.
 */
DetailsAssistant.prototype.commandMenuModel = { 
  processEvents : true,
  items : [
    { toggleCmd : null, 
      items : [
        { label : "Details", command : "details" },
        { label : "Map", command : "map" }
       ]
    },
    { icon : "new", submenu : "functions" },
    { icon : "search", submenu : "zoom", disabled : null }
  ]
};


/**
 * The model for the Functions submenu.
 */
DetailsAssistant.prototype.functionsSubMenuModel = {
  items : [
	{ label : "Add To Favorites", command : "addToFavorites", 
      /* Disable item if depot wasn't opened successfully at startup. */
	  disabled : function() {
		if (localBusinessSearch.depot) {
		  return false;
		} else {
		  return true;
		}
	  }()
	}, 
	{ label : "Open In Google Maps", command : "openInGoogleMaps" }
  ]
};


/**
 * The model for the Zoom submenu.
 */
DetailsAssistant.prototype.zoomSubMenuModel = {
  items : [
	{ label : "Street", command : "zoom1" }, { label : "2", command : "zoom2" },
	{ label : "3", command : "zoom3" }, { label : "4", command : "zoom4" },
	{ label : "5", command : "zoom5" }, { label : "6", command : "zoom6" },
	{ label : "7", command : "zoom7" }, { label : "8", command : "zoom8" },
	{ label : "9", command : "zoom9" }, { label : "10", command : "zoom10" },
	{ label : "11", command : "zoom11" }, 
  { label : "Country", command : "zoom12" }
  ]
};


/**
 * Set up the scene.
 */
DetailsAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel); 

  // Set up command menu at the bottom.
  this.controller.setupWidget(Mojo.Menu.commandMenu, null, 
    this.commandMenuModel);
  
  // Set up the submenu for the Functions menu option.
  this.controller.setupWidget("functions", null, 
    this.functionsSubMenuModel);  

  // Set up the submenu for the zoom menu option.
  this.controller.setupWidget("zoom", null, this.zoomSubMenuModel); 
  
}; // End DetailsAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
DetailsAssistant.prototype.activate = function() {

  // Listen for orientation changes.
  this.orientationBind = this.handleOrientation.bind(this); 
  Mojo.Event.listen(document, "orientationchange",
    this.orientationBind
  );

  // Set initial value for Details/Map command menu group and zoom button.
  this.commandMenuModel.items[0].toggleCmd = "details";
  this.controller.modelChanged(this.commandMenuModel, this);
  this.commandMenuModel.items[2].disabled = true;
  this.controller.modelChanged(this.commandMenuModel, this);

  // Set default zoom level.
  localBusinessSearch.zoomLevel = 6;

  // Get the initial map at the default zoom level for the business.
  this.getMap();

  // Display the details for the business.
  $("details_Title").innerHTML = localBusinessSearch.currentBusiness.Title;
  $("details_Longitude").innerHTML = 
    localBusinessSearch.currentBusiness.Longitude;
  $("details_Latitude").innerHTML = 
    localBusinessSearch.currentBusiness.Latitude;
  $("details_Distance").innerHTML = 
    localBusinessSearch.currentBusiness.Distance;
  $("details_Phone").innerHTML = localBusinessSearch.currentBusiness.Phone;
  var ratingVal = localBusinessSearch.currentBusiness.Rating.AverageRating;
  $("details_Rating").innerHTML = (isNaN(ratingVal) ? 0 : ratingVal);
  $("details_Address").innerHTML = localBusinessSearch.currentBusiness.Address;
  $("details_City").innerHTML = localBusinessSearch.currentBusiness.City;
  $("details_State").innerHTML = localBusinessSearch.currentBusiness.State;
  var BusinessUrl = localBusinessSearch.currentBusiness.BusinessUrl;
  if (BusinessUrl) {
    BusinessUrl = "<a href=\"" + BusinessUrl + "\">" + BusinessUrl + "</a>";
  } else {
    BusinessUrl = "";
  }
  $("details_BusinessUrl").innerHTML = BusinessUrl;  
  
}; // End DetailsAssistant.prototype.activate().


/**
 * Called when the scene is deactivated.
 */
DetailsAssistant.prototype.deactivate = function() {

  // Stop listening for orientation changes.
  Mojo.Event.stopListening(document, "orientationchange",
    this.orientationBind
  );

}; // End DetailsAssistant.prototype.deactivate().


/**
 * Handle command on the command menu.
 *
 * @param inEvent Incoming event object.
 */
DetailsAssistant.prototype.handleCommand = function(inEvent) {

  if (this.commandMenuModel.processEvents && 
    inEvent.type == Mojo.Event.command) {
    switch (inEvent.command) {
      // Switch to details view.
      case "details":
        $("details_tblDetails").show();
        $("details_map").hide();
        this.commandMenuModel.items[2].disabled = true;
        this.controller.modelChanged(this.commandMenuModel, this);
      break;
      // Switch to map view.
      case "map":
        $("details_tblDetails").hide();
        $("details_map").show();
        $("details_map").style.top = "-58px";
        this.commandMenuModel.items[2].disabled = false;
        this.controller.modelChanged(this.commandMenuModel, this);        
      break;
      // Add business to favorites.
      case "addToFavorites":
        // If this is the first favorite, create the favorites object.   
        if (!localBusinessSearch.favorites) {
          localBusinessSearch.favorites = { };
        }         
        // Add the favorite as an attribute of the favorites object.
        localBusinessSearch.favorites[
          "f_" + localBusinessSearch.currentBusiness.id] =
          localBusinessSearch.currentBusiness;
        // Store it in the Depot.
        localBusinessSearch.depot.simpleAdd("favorites", 
          localBusinessSearch.favorites, function() { 
            // Display confirmation banner.
            Mojo.Controller.getAppController().showBanner({
              messageText : "Favorite saved", soundClass : "alerts" 
            }, { }, "");            
          }, 
          function(inTransaction, inResult) {
            Mojo.Controller.errorDialog("Failure saving favorites: " +
              inResult);
          }
        );
      break;
      // Open business in Google Maps.
      case "openInGoogleMaps":
        this.controller.serviceRequest("palm://com.palm.applicationManager", {
          method : "open",
          parameters : {
            id : "com.palm.app.maps",
            params : { query : 
              localBusinessSearch.currentBusiness.Title + "," +
              localBusinessSearch.currentBusiness.City + "," +
              localBusinessSearch.currentBusiness.State
            }
          }
        });
      break;
      // Zoom the map to the selected level.
      case "zoom1": case "zoom2": case "zoom3": case "zoom4": case "zoom5": 
      case "zoom6": case "zoom7": case "zoom8": case "zoom9": case "zoom10":
      case "zoom11": case "zoom12":
        localBusinessSearch.zoomLevel = inEvent.command.substr(4);
        this.getMap();
      break;
    }
  }

  // Reset flag.
  this.commandMenuModel.processEvents = true;
  
}; // End DetailsAssistant.prototype.handleCommand().


/**
 * Called to get the map for the currently selected business.  Note that the
 * dimensions of the map is 320x452 in portrait mode and 480x292 in landscape
 * mode, which account for the status bar, so the image is just the size of
 * the card itself.
 */
DetailsAssistant.prototype.getMap = function() {

  // Determine dimensions based on orientation.
  var imgWidth = 320;
  var imgHeight = 452;
  if (localBusinessSearch.lastOrientation >= 4) {
    imgWidth = 480;
    imgHeight = 292;
  }

  // Make sure Internet connectivity is available first.
  localBusinessSearch.checkConnectivity(this,
    function() {        
      // Make AJAX request to get data.     
      new Ajax.Request(
        localBusinessSearch.mapWebServiceURL, {
          method : "get", evalJSON : "force",
          parameters : {
            appid : localBusinessSearch.appID, output : "json",
            longitude : localBusinessSearch.currentBusiness.Longitude,
            latitude : localBusinessSearch.currentBusiness.Latitude,
            image_width : imgWidth, image_height : imgHeight, 
            zoom : localBusinessSearch.zoomLevel
          },
          onSuccess : function(inTransport) {
            $("details_map").src = inTransport.responseJSON.ResultSet.Result;
          },
          onFailure : function(inTransport) {
            Mojo.Controller.errorDialog("FAILURE: " + inTransport.status +
              " - " + inTransport.responseText);
          },
          onException : function(inTransport) {
            Mojo.Controller.errorDialog("EXCEPTION");
          }
        }
      ); 
    }.bind(this),
    function() {
      // Switch back to details view, also reset the toggle state of the
      // command menu button group.
      $("details_tblDetails").show();
      $("details_map").hide();
      this.commandMenuModel.processEvents = false;
      this.commandMenuModel.items[0].toggleCmd = "details";
      this.controller.modelChanged(this.commandMenuModel, this);
    }.bind(this)
  );

}; // End DetailsAssistant.prototype.getMap().


/**
 * Handle the orientation change event.
 *
 * @param inEvent Event object with details about the event.
 */
DetailsAssistant.prototype.handleOrientation = function(inEvent) {

  if (inEvent.position > 1 &&
    inEvent.position != localBusinessSearch.lastOrientation) {
    localBusinessSearch.lastOrientation = inEvent.position;
    // Get a new map image if the new orientation value is greater than 2.
    // Note: 2&3=portrait, 4&5=landscape.
    if (inEvent.position > 2) {
      this.getMap();
    }
  }

}; // End DetailsAssistant.prototype.handleOrientation().
