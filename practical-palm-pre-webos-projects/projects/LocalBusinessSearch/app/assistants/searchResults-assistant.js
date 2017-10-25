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


function SearchResultsAssistant() { };


/**
 * Model for the search results List.
 */
SearchResultsAssistant.prototype.lstSearchResultsModel = { items : [ ] };


/**
 * Set up the scene.
 */
SearchResultsAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel); 

  // Set up Spinner.
  this.controller.setupWidget("searchResults_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Set up List.
  this.controller.setupWidget("searchResults_lstSearchResults", {
    itemTemplate : "searchResults/list-item"
  }, this.lstSearchResultsModel);
  this.controller.listen("searchResults_lstSearchResults", 
    Mojo.Event.listTap, this.selectBusiness);

}; // End SearchResultsAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
SearchResultsAssistant.prototype.activate = function() {

  // Don't do anything if no search is in progress (i.e., when user goes back
  // from the details scene).  The searchInProgress flag is set from the
  // search scene.
  if (!localBusinessSearch.searchInProgress) {
    return;
  }

  // Show Spinner.
  $("searchResults_divScrim").show();
  
  // Clear the model for the List.
  this.lstSearchResultsModel.items = [ ];
  this.controller.modelChanged(this.lstSearchResultsModel, this);

  // Make sure Internet connectivity is available first.
  localBusinessSearch.checkConnectivity(this,
    function() {  
      // Make AJAX request to get data.     
      new Ajax.Request(
        localBusinessSearch.searchWebServiceURL, {
          method : "get", evalJSON : "force",
          parameters : localBusinessSearch.searchParams, 
          onSuccess : this.processResults.bind(this),
          onFailure : function(inTransport) {
            $("searchResults_divScrim").hide();
            Mojo.Controller.errorDialog("FAILURE: " + inTransport.status +
              " - " + inTransport.responseText);
          },
          onException : function(inTransport, inException) {
            $("searchResults_divScrim").hide();
            Mojo.Controller.errorDialog("EXCEPTION: " + inException);
          }
        }
      );
    }.bind(this),
    function() {
      this.controller.stageController.popScene();
    }.bind(this)
  ); 
  
}; // End SearchResultsAssistant.prototype.activate().


/**
 * Callback executed when the search results come back from the database.
 *
 * @param inTransport AJAX transport object.
 */
SearchResultsAssistant.prototype.processResults = function(inTransport) {
 
  // Clear the flag so that when this scene is activated as a result of the
  // user swiping back from the details scene, the search won't be done
  // again.
  localBusinessSearch.searchInProgress = false;
 
  // Handle no matches found.
  if (inTransport.responseJSON.ResultSet.totalResultsAvailable == 0) {
    this.controller.showAlertDialog({
      onChoose : function(inValue) {
        this.controller.stageController.popScene(); 
      },
      title : "Nothing Found",
      message : "No businesses were found matching your search critera",
      choices : [
        { label : "Ok", type : "affirmative"}    
      ]
    });
    return;    
  }

  // Handle more than 20 matches.
  if (inTransport.responseJSON.ResultSet.totalResultsAvailable > 20) {
    this.controller.showAlertDialog({
      onChoose : function(inValue) {
        this.controller.stageController.popScene(); 
      },
      title : "Too Many Matches",
      message : "More than 20 matches were found.  Please try to narrow " +
        "the search (reducing the radius value is a good way).",
      choices : [
        { label : "Ok", type : "affirmative"}    
      ]
    });
    return;    
  }
  
  // Populate List.
  for (var i = 0; i < inTransport.responseJSON.ResultSet.Result.length; i++) {
    this.lstSearchResultsModel.items.push(
      inTransport.responseJSON.ResultSet.Result[i]
    );
  }
  this.controller.modelChanged(this.lstSearchResultsModel, this);

  // Hide Spinner.
  $("searchResults_divScrim").hide();

}; // End SearchResultsAssistant.prototype.processResults().


/**
 * Called when a business in the search results is tapped.
 *
 * @param inEvent Incoming event object.
 */
SearchResultsAssistant.prototype.selectBusiness = function(inEvent) {

  // Set the selected business.
  localBusinessSearch.currentBusiness = inEvent.item;
  
  // Push the details scene, which triggers the image retrieval.
  Mojo.Controller.stageController.pushScene({
    name : "details", transition : Mojo.Transition.crossFade
  });   

}; // End SearchResultsAssistant.prototype.selectBusiness().
