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
function PreferencesAssistant() { };


/**
 * Model for the category list.
 */
PreferencesAssistant.prototype.snippetsSortOrderModel = { value : null };


/**
 * Set up the scene.
 */
PreferencesAssistant.prototype.setup = function() {
  
  // Read in current sort order from cookie and set value in model.
  var storedSortOrder = codeCabinet.sortOrderCookie.get();
  this.snippetsSortOrderModel.value = storedSortOrder;

  // Setup ListSelector for snippet list sort order and hook up event handler 
  // to it to catch when the value changes.
  this.controller.setupWidget("preferences_snippetsSortOrder",
    { label: "Snippet Sorting",
      choices: [
        { label : "By Name ASC", value : "name_asc"},
        { label : "By Name DESC", value : "name_desc"},
        { label : "By Author ASC", value : "author_asc"},
        { label : "By Author DESC", value : "author_desc"},
        { label : "Newest First", value : "newest"},
        { label : "Oldest First", value : "oldest"}
      ]
    }, this.snippetsSortOrderModel
  );
  Mojo.Event.listen(this.controller.get("preferences_snippetsSortOrder"), 
    Mojo.Event.propertyChange, this.orderChanged.bind(this)
  );  
  
}; // End PreferencesAssistant.prototype.setup().


/**
 * Handle changing the snippet sort order.
 */
PreferencesAssistant.prototype.orderChanged = function() {

  // Save value to cookie.
  codeCabinet.sortOrderCookie.put(this.snippetsSortOrderModel.value);
  
}; // End PreferencesAssistant.prototype.orderChanged().
