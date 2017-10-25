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
function WelcomeAssistant() { };


/**
 * Set up the scene.
 */
WelcomeAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Setup up model for and hook up event handler to the Category List Button.
  this.controller.setupWidget("welcome_btnCategoryList", { },
    { label : "Category List" }
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnCategoryList"), 
    Mojo.Event.tap, this.categoryList.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Search Snippets Button.
  this.controller.setupWidget("welcome_btnSearch", { },
    { label : "Search Snippets" }
  );  
  Mojo.Event.listen(this.controller.get("welcome_btnSearch"), Mojo.Event.tap, 
    this.search.bind(this)
  ); 

}; // End WelcomeAssistant.prototype.setup().


/**
 * Handle the Category List button's tap event.
 */
WelcomeAssistant.prototype.categoryList = function() {

  Mojo.Controller.stageController.pushScene("categoryList"); 
  
}; // End WelcomeAssistant.prototype.categoryList(). 


/**
 * Handle the Search For Snippets button's tap event.
 */
WelcomeAssistant.prototype.search = function() {

  Mojo.Controller.stageController.pushScene("search");  
  
}; // End WelcomeAssistant.prototype.search().
