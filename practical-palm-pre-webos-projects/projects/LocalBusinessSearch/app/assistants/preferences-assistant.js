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
function PreferencesAssistant() { };


/**
 * Models for the Drawers.
 */
PreferencesAssistant.prototype.drwTiledModel = { open : false };
PreferencesAssistant.prototype.drwFullScreenModel = { open : false };
PreferencesAssistant.prototype.drwAnimatedModel = { open : false };


/**
 * Models for the Lists.
 */
PreferencesAssistant.prototype.lstTiledModel = { items : [
  { description : "Stars", filename : "background01" },
  { description : "Grey Fog", filename : "background02" },
  { description : "Splotchy", filename : "background03" },
  { description : "Bio Mesh", filename : "background04" },
  { description : "Dark Marble", filename : "background05" },
  { description : "Velvet", filename : "background06" },
  { description : "Twinklies", filename : "background07" },
  { description : "Armor", filename : "background08" }
] };
PreferencesAssistant.prototype.lstFullScreenModel = { items : [
  { description : "Colorful Lines", filename : "background09" },
  { description : "Data Wall", filename : "background10" },
  { description : "Sky Vs. Sky", filename : "background11" },
  { description : "Elegant", filename : "background12" },
  { description : "Gears", filename : "background13" },
  { description : "Fire", filename : "background14" },
  { description : "Perspective", filename : "background15" }
] };
PreferencesAssistant.prototype.lstAnimatedModel = { items : [
  { description : "Lightning", filename : "background16" },
  { description : "Love Is In The Air", filename : "background17" },
  { description : "Purple Stuff", filename : "background18" },
  { description : "The Matrix", filename : "background19" }
] };


/**
 * Set up the scene.
 */
PreferencesAssistant.prototype.setup = function() {
  
  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, 
    localBusinessSearch.appMenuAttributes, localBusinessSearch.appMenuModel);   
  
  // Set up the button, Drawer and List for tiled backgrounds.
  this.controller.setupWidget("preferences_drwTiled", { }, 
    this.drwTiledModel);
  Mojo.Event.listen(this.controller.get("preferences_btnTiled"), 
    Mojo.Event.tap, function() {
      this.drwTiledModel.open = !this.drwTiledModel.open;
      if (this.drwTiledModel.open) {
        $("preferences_btnTiled").className = 
          "palm-arrow-expanded arrow_button";
      } else {
        $("preferences_btnTiled").className = "palm-arrow-closed arrow_button";
      }    
      this.controller.modelChanged(this.drwTiledModel, this);
    }.bind(this)
  );   
  this.controller.setupWidget("preferences_lstTiled", {
    itemTemplate : "preferences/list-item"
  }, this.lstTiledModel);
  this.controller.listen("preferences_lstTiled", 
    Mojo.Event.listTap, this.selectBackground.bind(this));  

  // Set up the button, Drawer and List for full-screen backgrounds.
  this.controller.setupWidget("preferences_drwFullScreen", { }, 
    this.drwFullScreenModel);
  Mojo.Event.listen(this.controller.get("preferences_btnFullScreen"), 
    Mojo.Event.tap, function() {
      this.drwFullScreenModel.open = !this.drwFullScreenModel.open;
      if (this.drwFullScreenModel.open) {
        $("preferences_btnFullScreen").className = 
          "palm-arrow-expanded arrow_button";
      } else {
        $("preferences_btnFullScreen").className = 
          "palm-arrow-closed arrow_button";
      }    
      this.controller.modelChanged(this.drwFullScreenModel, this);
    }.bind(this)
  );   
  this.controller.setupWidget("preferences_lstFullScreen", {
    itemTemplate : "preferences/list-item"
  }, this.lstFullScreenModel);
  this.controller.listen("preferences_lstFullScreen", 
    Mojo.Event.listTap, this.selectBackground.bind(this));    
  
  // Set up the button, Drawer and List for animated backgrounds.
  this.controller.setupWidget("preferences_drwAnimated", { }, 
    this.drwAnimatedModel);
  Mojo.Event.listen(this.controller.get("preferences_btnAnimated"), 
    Mojo.Event.tap, function() {
      this.drwAnimatedModel.open = !this.drwAnimatedModel.open;
      if (this.drwAnimatedModel.open) {
        $("preferences_btnAnimated").className = 
          "palm-arrow-expanded arrow_button";
      } else {
        $("preferences_btnAnimated").className = 
          "palm-arrow-closed arrow_button";
      }    
      this.controller.modelChanged(this.drwAnimatedModel, this);
    }.bind(this)
  );     
  this.controller.setupWidget("preferences_lstAnimated", {
    itemTemplate : "preferences/list-item"
  }, this.lstAnimatedModel);
  this.controller.listen("preferences_lstAnimated", 
    Mojo.Event.listTap, this.selectBackground.bind(this));      
    
}; // End PreferencesAssistant.prototype.setup().


/**
 * Called when the user selects a new background.
 */
PreferencesAssistant.prototype.selectBackground = function(inEvent) {

  // Change the background of the main document with the selection.
  document.body.style.background = "url(images/" + inEvent.item.filename + 
    ".gif) center center";

  // Save selection to the preferences object and write to the Depot.
  localBusinessSearch.preferences.background = inEvent.item.filename;
  localBusinessSearch.depot.simpleAdd("preferences", 
    localBusinessSearch.preferences, function() { }, 
    function(inTransaction, inResult) {
      Mojo.Controller.errorDialog("Failure saving preferences: " + inResult);
    }
  );   

};
