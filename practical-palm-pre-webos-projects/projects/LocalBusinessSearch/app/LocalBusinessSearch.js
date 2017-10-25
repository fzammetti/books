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


function LocalBusinessSearch() { 


  /**
   * AppID to use for Yahoo! Web Services.
   */
  this.appID = "hNGwI8XV34FmZYlnbFS3Ga2jw3w8RGscRq2ETnrRtO3QlHcRMy86NqYb._TIgvZ5";
  
  
  /** 
   * The URL of the Yahoo! web service.
   */
  this.searchWebServiceURL = 
    "http://local.yahooapis.com/LocalSearchService/V3/localSearch";
  
  
  /**
   * The URL of the Yahoo! map retrieval web service.
   */ 
  this.mapWebServiceURL = "http://local.yahooapis.com/MapsService/V1/mapImage";
  
  
  /**
   *  Reference to the currently selected business.
   */
  this.currentBusiness = null;
  
  /**
   * Current map zoom level.
   */
  this.zoomLevel = null;
  
  
  /**
   * Field where the current search criteria are stored (needed for paging).
   */
  this.searchParams = null;


  /**
   * Flag set to true when a search is being performed.
   */
  this.searchInProgress = false;
  
  
  /**
   * Collection of favorites stored.
   */
  this.favorites = null;


  /**
   * Object containing stored preferences.
   */
  this.preferences = { background : "background19" };
  

  /**
   * The last recorded orientation of the device.
   */
  this.lastOrientation = null;


  /**
   * Attributes and model for the application menu, shared by all scenes.
   */
  this.appMenuAttributes = { richTextEditMenu  : true }; 
  this.appMenuModel = {
    items : [
      { label : "About...", command : "about-TAP" }
    ]
  };

  /**
    * Open Depot for storing favorites.
   */
  this.depot = new Mojo.Depot(
    { name : "LocalBusinessSearch", version : 1, replace : false }, 
    function() {  
      // Load favorites, if depot is available.
      localBusinessSearch.depot.simpleGet("favorites", 
        function(inObject) {
          if (inObject) {
            // Favorites were retrieved, but the object might not have any
            // attributes if the user has deleted all their favorites.  So,
            // we need to see if the object has any attributes.
            if (localBusinessSearch.doesObjectHaveAttributes(inObject)) {
              localBusinessSearch.favorites = inObject;
            }
          } 
        },
        function(inTransaction, inResult) {
          Mojo.Controller.errorDialog("Failure reading favorites: " +
            inResult);      
        } 
      );
      // Read in object from depot for preferences.  If none is found, the
      // default will be used.
      localBusinessSearch.depot.simpleGet("preferences", 
        function(inObject) {
          if (inObject) {
            localBusinessSearch.preferences = inObject;
          }
          // Change the background of the main document with the selection.         
          document.body.style.background = 
            "url(images/" + localBusinessSearch.preferences.background + 
            ".gif) center center";           
        }
      );      
    },
    function(inTransaction, inResult) {
      Mojo.Controller.errorDialog("Error opening favorites depot: " + inResult);
      localBusinessSearch.depot = null;
    }
  );   
  
  
  /**
   * Utility method to tell if a given object has any attributes.
   *
   * @param  inObject The object to check.
   * @return          True if inObject has at least one attribute, false if not.
   */
  this.doesObjectHaveAttributes = function(inObject) {

    var hasAttributes = false;
    for (var a in inObject) {
      hasAttributes = true;
      break;
    }
    if (hasAttributes) {
      return true;
    } else {
      return false;
    }
    
  }; // End doesObjectHaveAttributes().
  
  
  /**
   * Checks for Internet connectivity and calls the appropriate callback.
   *
   * @param inAssistant       The scene assistant from which this is called.
   * @param inSuccessCallback Function to call if connectivity is available.
   * @param inFailureCallback Function to call if connectivity is NOT available.
   */
  this.checkConnectivity = function(inAssistant, inSuccessCallback, 
    inFailureCallback) {  
    
    inAssistant.controller.serviceRequest("palm://com.palm.connectionmanager", {
      method : "getstatus",
      parameters : { subscribe : false },
      onSuccess : function(inResponse) {
        // Note: isInternetConnectionAvailable seems to always return true
        // in the emulator... even pulling the network cable out didn't help,
        // nor did turning on airplane mode.  It may be possible to configure
        // VirtualBox's proxy settings, but I didn't try that (disabling the
        // network adapter in VirtualBox didn't work either!)
        if (inResponse.isInternetConnectionAvailable) {
          inSuccessCallback();
        } else {
          // Note that the failure callback is called AFTER the dialog is
          // dismissed.  Also note that Mojo.Dialog.errorDialog doesn't work
          // here either, although I'm not sure why.  Ditto for the
          // onFailure handler below.
          inAssistant.controller.showAlertDialog({
            onChoose : function() { inFailureCallback() },
            title : "Error",
            message : "Internet connection not avalailable",
            choices : [ { label : "Ok", value : "ok" } ]
          });
        }
      },
      onFailure : function() {
        // Service call failed.
        inAssistant.controller.showAlertDialog({
          onChoose : function() { inFailureCallback() },
          title : "Error",
          message : "Internet connection not avalailable",
          choices : [ { label : "Ok", value : "ok" } ]
        });
      }
    });
    
  }; // End checkConnectivity().
  
  
} // End LocalBusinessSearch class.


// One instance to rule them all.
var localBusinessSearch = new LocalBusinessSearch();
