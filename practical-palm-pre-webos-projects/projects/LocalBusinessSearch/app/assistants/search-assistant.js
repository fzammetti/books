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
function SearchAssistant() { };


/**
 * Models for the search criteria fields.
 */
SearchAssistant.prototype.searchModels = { 
  keyword : { value : null },
  sortBy : { value : null },
  minimumRating : { value : null },
  street : { value : null },
  city : { value : null },
  state : { value : null },
  zip : { value : null },
  radius : { value : null },
  longitude : { value : null },
  latitude : { value : null }
};


/**
 * The model for the command menu.
 */
SearchAssistant.prototype.commandMenuModel = { 
  items : [
    { label : "Perform Search", command : "search" },
    { label : "GPS", command : "gps" },
    { label : "Reset", command : "reset" }
  ]
};


/**
 * Set up the scene.
 */
SearchAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel); 

  // Set up Spinner for the scrim when getting a GPS fix.
  this.controller.setupWidget("search_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Keyword TextField.
  this.controller.setupWidget("search_txtKeyword", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30,
      textCase : Mojo.Widget.steModeLowerCase },
    this.searchModels.keyword
  );

  // Sort By RadioButton.
  this.controller.setupWidget("search_rbSortBy",
    { choices : [
      { label : "Distance", value : "distance" },
      { label : "Title", value : "title" },
      { label : "Rating", value : "rating" }
    ] }, 
    this.searchModels.sortBy 
  ); 

  // Minimum Rating IntegerPicker.
  this.controller.setupWidget("search_ipMinimumRating",
    { min : 0, max : 5, label : " " }, 
    this.searchModels.minimumRating
  ); 

  // Street TextField.
  this.controller.setupWidget("search_txtStreet", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30,
      textCase : Mojo.Widget.steModeLowerCase },
    this.searchModels.street
  );
  
  // City TextField.
  this.controller.setupWidget("search_txtCity", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30,
      textCase : Mojo.Widget.steModeLowerCase },
    this.searchModels.city
  );
    
  // State ListSelector.
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
  var stateChoices = [ ];
  for (var i = 0; i < stateVals.length; i++ ) {
    stateChoices.push({
      label : stateVals[i], value : stateVals[i]
    });
  }  
  this.controller.setupWidget("search_lsState",
    { choices : stateChoices, label : " " }, 
    this.searchModels.state 
  );     
    
  // Zip Code TextField.
  this.controller.setupWidget("search_txtZip", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 5,
      modifierState : Mojo.Widget.numLock },
    this.searchModels.zip
  );    
    
  // Radius Slider.
  this.controller.setupWidget("search_sldRadius",
    { minValue : 1, maxValue : 1000, round : true, modelProperty : "value" }, 
    this.searchModels.radius 
  ); 
  Mojo.Event.listen(this.controller.get("search_sldRadius"), 
    Mojo.Event.propertyChange, function() {
      $("search_radius").innerHTML = this.searchModels.radius.value;
    }.bind(this)
  );      

  // Longitude TextField.
  this.controller.setupWidget("search_txtLongitude", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30,
      modifierState : Mojo.Widget.numLock },
    this.searchModels.longitude
  );
  
  // Latitude TextField.
  this.controller.setupWidget("search_txtLatitude", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30,
      modifierState : Mojo.Widget.numLock },
    this.searchModels.latitude
  );  
    
  // Set up command menu at the bottom.
  this.controller.setupWidget(Mojo.Menu.commandMenu, null, 
    this.commandMenuModel);      
    
  // Clear fields and set default values.
  this.clear();
    
}; // End SearchAssistant.prototype.setup().


/**
 * Handle command on the command menu.
 *
 * @param inEvent Incoming event object.
 */
SearchAssistant.prototype.handleCommand = function(inEvent) {

  if (inEvent.type == Mojo.Event.command) {
    switch (inEvent.command) {

      case "search":
        // Perform search.
        this.search();
      break;
      
      case "reset":
        this.clear();
      break;
           
      case "gps":
      
        // Get a GPS fix at the current location.
        $("search_divScrim").show();
        this.controller.serviceRequest("palm://com.palm.location", {
          method : "getCurrentPosition",
          parameters : { maximumAge : 60 },
          onSuccess : function(inResponse) {
            $("search_divScrim").hide();
            switch (inResponse.errorCode) {
              case 0:
                // Note that if longitude and latitude are present in the
                // search criteria, then all other location-related search
                // fields are ignored, even if there is data in them.
                this.searchModels.longitude.value = inResponse.longitude;
                this.searchModels.latitude.value = inResponse.latitude;
                this.controller.modelChanged(this.searchModels.longitude, this);
                this.controller.modelChanged(this.searchModels.latitude, this);
              break;
              case 1: case 2: case 3: 
                Mojo.Controller.errorDialog(
                  "Timeout waiting for GPS fix.  Are you indoors, or is " +
                  "your view of the sky obstructed?"
                );
              break;
              case 5: case 6:
                Mojo.Controller.errorDialog(
                  "GPS fix cannot be retrieved because Location Service is " +
                  "off, or you have not accepted the terms of use."
                );
              break;
              case 7: case 8:
                Mojo.Controller.errorDialog(
                  "The application already has a pending request, or has " +
                  "been temporarily blacklisted."
                );
              break;
            }
          }.bind(this),
          onFailure : function(inResponse) {
            $("search_divScrim").hide();
            switch (inResponse.errorCode) {
              case 1: case 2: case 3: 
                Mojo.Controller.errorDialog(
                  "Timeout waiting for GPS fix.  Are you indoors, or is " +
                  "your view of the sky obstructed?"
                );
              break;
              case 5: case 6:
                Mojo.Controller.errorDialog(
                  "GPS fix cannot be retrieved because Location Service is " +
                  "off, or you have not accepted the terms of use."
                );
              break;
              case 7: case 8:
                Mojo.Controller.errorDialog(
                  "The application already has a pending request, or has " +
                  "been temporarily blacklisted."
                );
              break;
            }
          }
       });
      break;
          
    } // End switch.
  }
  
}; // End SearchAssistant.prototype.handleCommand().


/**
 * Called to clear the search criteria fields and set default values.
 */
SearchAssistant.prototype.clear = function() {

  // Set default values for search fields.
  this.searchModels.keyword.value = "";
  this.searchModels.sortBy.value = "distance";
  this.searchModels.minimumRating.value = 0;
  this.searchModels.street.value = "";
  this.searchModels.city.value = "";
  this.searchModels.state.value = "";
  this.searchModels.zip.value = "";
  this.searchModels.radius.value = 5;
  this.searchModels.longitude.value = "";
  this.searchModels.latitude.value = "";

  // Tell the controller the models changed.
  for (var f in this.searchModels) {
    this.controller.modelChanged(this.searchModels[f], this);
  }
  
}; // End SearchAssistant.prototype.clear().
 

/**
 * Called to perform a search.
 */
SearchAssistant.prototype.search = function() {

  // Input validation: Keyword required.
  if (this.searchModels.keyword.value == "") {
    Mojo.Controller.errorDialog("You must enter a keyword to search for.");
    return;
  }

  // Input validation: Location required.
  if (this.searchModels.street.value == "" &&
    this.searchModels.city.value == "" &&
    this.searchModels.state.value == "" &&
    this.searchModels.zip.value == "" &&
    this.searchModels.longitude.value == "" &&
    this.searchModels.latitude.value == "") {
    Mojo.Controller.errorDialog(
      "You must enter a location to search around " +
      "(just zip code at a minimum)."
    );
    return;
  }
  
  // Input validation: City and State required when Street entered.
  if (this.searchModels.street.value != "" &&
    (this.searchModels.city.value == "" ||
     this.searchModels.state.value == "")) {
    Mojo.Controller.errorDialog(
      "When street is entered you must also enter city and state."
    );
    return;
  }

  // Input validation: Longitude and latitude must be entered together.
  if ((this.searchModels.longitude.value != "" && 
    this.searchModels.latitude.value == "") ||
    (this.searchModels.longitude.value == "" && 
    this.searchModels.latitude.value != "")) {
    Mojo.Controller.errorDialog(
      "When either longitude or latitude is entered, they both must be entered."
    );
    return;
  }

  // Construct searchParams object.
  localBusinessSearch.searchParams = {
    appid : localBusinessSearch.appID, output : "json", results : 20,
    query : this.searchModels.keyword.value,
    sort : this.searchModels.sortBy.value,
    minimum_rating : this.searchModels.minimumRating.value,
    street : this.searchModels.street.value,
    city : this.searchModels.city.value,
    state : this.searchModels.state.value,
    zip : this.searchModels.zip.value,
    radius : this.searchModels.radius.value,
    longitude : this.searchModels.longitude.value,
    latitude : this.searchModels.latitude.value
  };

  // Push the searchResults scene, which triggers the search.
  localBusinessSearch.searchInProgress = true;
  Mojo.Controller.stageController.pushScene({
    name : "searchResults", transition : Mojo.Transition.crossFade
  });   

}; // End SearchAssistant.prototype.search(). 
