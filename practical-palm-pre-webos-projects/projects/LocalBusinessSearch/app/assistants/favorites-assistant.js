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
function FavoritesAssistant() { };


/**
 * Model for the favorites List.
 */
FavoritesAssistant.prototype.lstFavoritesModel = { items : [ ] };


/**
 * Set up the scene.
 */
FavoritesAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel); 

  // Set up List.
  this.controller.setupWidget("favorites_lstFavorites", {
    swipeToDelete : true, itemTemplate : "favorites/list-item"
  }, this.lstFavoritesModel);
  this.controller.listen("favorites_lstFavorites", 
    Mojo.Event.listTap, this.selectFavorite.bind(this));
  this.controller.listen("favorites_lstFavorites", Mojo.Event.listDelete, 
    this.deleteFavorite.bind(this));  
  
}; // End FavoritesAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
FavoritesAssistant.prototype.activate = function() {

  // Clear the model for the List.
  this.lstFavoritesModel.items = [ ];
  this.controller.modelChanged(this.lstFavoritesModel, this);

  if (localBusinessSearch.favorites) {
	  // Populate the List.
	  for (var f in localBusinessSearch.favorites) {
	    this.lstFavoritesModel.items.push(localBusinessSearch.favorites[f]);
	  }
	  this.controller.modelChanged(this.lstFavoritesModel, this);
  } else {
	  // User has no saved favorites, get outta here!
    this.controller.showAlertDialog({
      onChoose : function(inValue) {
        this.controller.stageController.popScene(); 
      },
      title : "Nothing Found",
      message : "You have no saved favorites",
      choices : [
        { label : "Ok", type : "affirmative"}    
      ]
    });
    return; 	  
  }
	
}; // End FavoritesAssistant.prototype.activate().


/**
 * Called when a favorite is tapped.
 *
 * @param inEvent Incoming event object.
 */
FavoritesAssistant.prototype.selectFavorite = function(inEvent) {

  // Set the selected business.
  localBusinessSearch.currentBusiness = inEvent.item;
  
  // Push the details scene, which triggers the image retrieval.
  Mojo.Controller.stageController.pushScene({
    name : "details", transition : Mojo.Transition.crossFade
  });   

}; // End FavoritesAssistant.prototype.selectFavorite().


/**
 * Called when an item is swiped to delete it.
 *
 * @param inEvent Incoming event object.
 */
FavoritesAssistant.prototype.deleteFavorite = function(inEvent) {

  // Remove the attribute from the favorites object for this favorite and
  // write out the favorites to the Depot.
  delete localBusinessSearch.favorites["f_" + inEvent.item.id];
  localBusinessSearch.depot.simpleAdd("favorites", 
    localBusinessSearch.favorites, function() { }, 
    function(inTransaction, inResult) {
      Mojo.Controller.errorDialog("Failure saving favorites: " + inResult);
    }
  );  
  
  // If there are no longer attributes on the favorites object, then there are
  // no longer favorites and this scene needs to be popped.  In addition,
  // localBusinessSearch.favorites is set to null so that the user gets the
  // friendly "no favorites" message when they go to the favorites scene.
  if (!localBusinessSearch.doesObjectHaveAttributes(
    localBusinessSearch.favorites)) {
    localBusinessSearch.favorites = null;
    this.controller.stageController.popScene();
  }
   
}; // End FavoritesAssistant.prototype.deleteFavorite().
