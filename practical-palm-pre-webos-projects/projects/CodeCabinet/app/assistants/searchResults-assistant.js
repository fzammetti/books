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


function SearchResultsAssistant() { };


/**
 * Model for the search results list.
 */
SearchResultsAssistant.prototype.lstSearchResultsModel = { items : [ ] };


/**
 * Set up the scene.
 */
SearchResultsAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up Spinner.
  this.controller.setupWidget("searchResults_divSpinner",
    { spinnerSize : "large" }, { spinning : true }
  );

  // Set up List.
  this.controller.setupWidget("searchResults_lstSearchResultsList", {
    itemTemplate : "searchResults/list-item"
  }, this.lstSearchResultsModel);
  this.controller.listen("searchResults_lstSearchResultsList", 
    Mojo.Event.listTap, this.selectSnippet);

}; // End SearchResultsAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
SearchResultsAssistant.prototype.activate = function() {

  // Retrieve all snippets in all categories, showing Spinner first.
  $("searchResults_divSpinner").show();
  $("searchResults_lstSearchResultsList").hide();
  this.lstSearchResultsModel.items = [ ];
  dao.retrieveSnippets(null, this.processResults.bind(this));
  
}; // End SearchResultsAssistant.prototype.activate().


/**
 * Callback executed when the search results come back from the database.
 *
 * @param inSnippets An array of objects representing snippets.
 */
SearchResultsAssistant.prototype.processResults = function(inSnippets) {

  // If no snippets were found, the user hasn't created any yet, so there's
  // no work to be done here.
  if (!inSnippets || !inSnippets.length) {
    this.controller.showAlertDialog({
      onChoose : function(inValue) {
        this.controller.stageController.popScene(); 
      },
      title : "Nothing To Do",
      message : "There are no snippets to search.  How about you go " +
        "create a few??",
      choices : [
        { label : "Ok", type : "affirmative"}    
      ]
    });
    return;
  }

  // Array of snippet descriptor objects matching the search criteria.
  var matches = [ ];

  // Get the search criteria, all trimmed and lower-cased nicely so that
  // matches will be found, since the results are similarly trimmed and
  // lower-cases.
  var snippetName = codeCabinet.searchFieldModels.txtName.value ?
    codeCabinet.searchFieldModels.txtName.value.strip().toLowerCase() : null;
  var snippetDescription = codeCabinet.searchFieldModels.txtDescription.value ?
    codeCabinet.searchFieldModels.txtDescription.value.strip().toLowerCase() : 
    null;    
  var snippetAuthor = codeCabinet.searchFieldModels.txtAuthor.value ?
    codeCabinet.searchFieldModels.txtAuthor.value.strip().toLowerCase() : null;
  var snippetCode = codeCabinet.searchFieldModels.txtCode.value ?
    codeCabinet.searchFieldModels.txtCode.value.strip().toLowerCase() : null;
  var snippetNotes = codeCabinet.searchFieldModels.txtNotes.value ?
    codeCabinet.searchFieldModels.txtNotes.value.strip().toLowerCase() : null;
  var snippetKeywords = codeCabinet.searchFieldModels.txtKeywords.value ?
    codeCabinet.searchFieldModels.txtKeywords.value.strip().toLowerCase() : 
    null;

  // Cycle through them and find the matches.
  for (var i = 0; i < inSnippets.length; i++) {

    // This variable will have a T or F added to it for each search
    // criteria that was entered.  If we get to the end and there's any
    // F's in it, then this snippet didn't match one of the entered
    // criteria and is therefore not a match.
    var matched = "";

    // Search includes name.
    if (snippetName) {
      if (inSnippets[i].name.toLowerCase().indexOf(snippetName) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes code.
    if (snippetCode) {
      if (inSnippets[i].code.toLowerCase().indexOf(snippetCode) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes author.
    if (snippetAuthor) {
      if (inSnippets[i].author.toLowerCase().indexOf(snippetAuthor) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes description.
    if (snippetDescription) {
      if (inSnippets[i].description.toLowerCase().indexOf(snippetDescription) 
        != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes notes.
    if (snippetNotes) {
      if (inSnippets[i].notes.toLowerCase().indexOf(snippetNotes) != -1) {
        matched += "T";
      } else {
        matched += "F";
      }
    }
    // Search includes keyword(s).
    if (snippetKeywords) {
      var a = snippetKeywords.split(",");
      var foundAny = false;
      for (var j = 0; j < a.length; j++) {
        var nextKeyword = a[j].strip().toLowerCase();
        if (nextKeyword != "") {
          if (inSnippets[i].keyword1.toLowerCase() == nextKeyword ||
            inSnippets[i].keyword2.toLowerCase() == nextKeyword || 
            inSnippets[i].keyword3.toLowerCase() == nextKeyword ||
            inSnippets[i].keyword4.toLowerCase() == nextKeyword || 
            inSnippets[i].keyword5.toLowerCase() == nextKeyword) {
            foundAny = true;
          }
        }
      }
      if (foundAny) {
        matched += "T";
      } else {
        matched += "F";
      }
    }

    // If current snippet matches the search criteria, add it to the
    // SearchResultsStore.
    if (matched.indexOf("F") == -1) {
      matches.push(inSnippets[i]);
    }

  } // End iteration over snippets.

  // If matches were found, show the results grid, otherwise show the
  // "no matches" message.
  if (matches.length > 0) {
    // Update the model.
    for (var i = 0; i < matches.length; i++) {
      this.lstSearchResultsModel.items.push(matches[i]);
    }
    // Inform the controller of the model change so the list is refreshed.
    this.controller.modelChanged(this.lstSearchResultsModel);    
    $("searchResults_divSpinner").hide();
    $("searchResults_lstSearchResultsList").show();
  } else {
    Mojo.Controller.getAppController().showBanner({
      messageText : "No snippets found matching criteria", 
      soundClass : "alerts" }, {}, ""
    );
    this.controller.stageController.popScene();
  }   

}; // End SearchResultsAssistant.prototype.processResults().


/**
 * Called when a snippet is tapped.
 *
 * @param inEvent Incoming event object.
 */
SearchResultsAssistant.prototype.selectSnippet = function(inEvent) {

  // Get the snippet descriptor.
  codeCabinet.currentSnippet = inEvent.item;
  
  // Push the scene.
  Mojo.Controller.stageController.pushScene("snippetDetails");
  
}; // End SearchResultsAssistant.prototype.selectCategory().
