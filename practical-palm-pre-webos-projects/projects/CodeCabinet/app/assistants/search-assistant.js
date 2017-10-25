/*
    Code Cabinet - From the book "Practical webOS Projects With the Palm Pre"
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
 * Set up the scene.
 */
SearchAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up search fields.
  this.controller.setupWidget("search_txtName", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30 },
    codeCabinet.searchFieldModels.txtName
  );
  this.controller.setupWidget("search_txtDescription", 
    { focusMode : Mojo.Widget.focusSelectMode },
    codeCabinet.searchFieldModels.txtDescription
  );
  this.controller.setupWidget("search_txtAuthor", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30 },
    codeCabinet.searchFieldModels.txtAuthor
  );
  this.controller.setupWidget("search_txtCode", 
    { focusMode : Mojo.Widget.focusSelectMode },
    codeCabinet.searchFieldModels.txtCode
  );
  this.controller.setupWidget("search_txtNotes", 
    { focusMode : Mojo.Widget.focusSelectMode },
    codeCabinet.searchFieldModels.txtNotes
  );  
  this.controller.setupWidget("search_txtKeywords", 
    { focusMode : Mojo.Widget.focusSelectMode },
    codeCabinet.searchFieldModels.txtKeywords
  );  

  // Setup up model for and hook up event handler to the Search Button.
  this.controller.setupWidget("search_btnSearch", { },
    { label : "Search", buttonClass : "affirmative buttonfloat" }
  ); 
  Mojo.Event.listen(this.controller.get("search_btnSearch"), Mojo.Event.tap, 
    this.search.bind(this)
  ); 

}; // End SearchAssistant.prototype.setup().


/**
 * Handle the Search button's tap event.
 */
SearchAssistant.prototype.search = function() {

  // Ensure acceptable criteria are entered.
  if ((!codeCabinet.searchFieldModels.txtKeywords.value ||
    codeCabinet.searchFieldModels.txtKeywords.value == "") &&
    (!codeCabinet.searchFieldModels.txtCode.value ||
    codeCabinet.searchFieldModels.txtCode.value == "") &&
    (!codeCabinet.searchFieldModels.txtName.value ||
    codeCabinet.searchFieldModels.txtName.value == "") && 
    (!codeCabinet.searchFieldModels.txtAuthor.value ||
    codeCabinet.searchFieldModels.txtAuthor.value == "") &&
    (!codeCabinet.searchFieldModels.txtDescription.value ||
    codeCabinet.searchFieldModels.txtDescription.value == "") && 
    (!codeCabinet.searchFieldModels.txtNotes.value ||
    codeCabinet.searchFieldModels.txtNotes.value == "")) {
    Mojo.Controller.errorDialog(
      "I'm sorry but you must enter at least one search " +
        "criteria in order to perform a search."
    );
    return;
  }
   
  // Push the searchResults scene, which triggers the search.
  Mojo.Controller.stageController.pushScene("searchResults");
   
}; // End SearchAssistant.prototype.search(). 
