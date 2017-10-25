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


function CodeCabinet() { 

  // The cookie that stores the snippet list sort order value.
  this.sortOrderCookie = new Mojo.Model.Cookie("CodeCabinet_snippetSortOrder");

  // Set default sort order in cookie if no value set yet.
  var storedSortOrder = this.sortOrderCookie.get();
  if (!storedSortOrder) {
    this.sortOrderCookie.put("name_asc");
  }  

  // Attributes and model for the application menu, shared by all scenes.
  this.appMenuAttributes = { richTextEditMenu  : true }; 
  this.appMenuModel = {
    items : [
      { label : "About Code Cabinet...", command : "aboutCodeCabinet-TAP" }
    ]
  };

  // The current category descriptor object.
  this.currentCategory = null;

  // The current snippet descriptor object.  This will be null if adding a
  // new snippet (or if no snippet is selected obviously), otherwise it's the 
  // data for the snippet when one is selected.
  this.currentSnippet = null;

  // Model for the snippet list.  This is here because it needs to be updated
  // from the snippetDetails assistant, but getting a reference to the
  // snippetList assistant from the snippetDetails assistant didn't seem to be
  // working, so this works around that.  Ideally though, this would be a
  // member of the snippetList assistant instead.
  this.lstSnippetListModel = { items : [ ] };

  // The models for the search fields.  This is here because it's shared by
  // two scenes.
  this.searchFieldModels = { 
    txtName : { value : "" },
    txtDescription : { value : "" },
    txtAuthor : { value : "" },
    txtCode : { value : "" },
    txtNotes : { value : "" },
    txtKeywords : { value : "" } 
  };
 
} // End CodeCabinet class.


// One instance to rule them all.
var codeCabinet = new CodeCabinet();
