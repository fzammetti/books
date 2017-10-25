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
function SnippetDetailsAssistant() { };


/**
 * The models for the Drawers, and the components contained within them.
 */
SnippetDetailsAssistant.prototype.drawerModels = { 
  /* Model for the Info Drawer. */
  info : { open : true, 
    fields : {
      /* Model for the Name field. */
      txtName : { value : "" },
      /* Model for the Description field. */
      txtDescription : { value : "" },
      /* Model for the author field. */
      txtAuthor : { value : "" },
      /* Model for the eMail field. */
      txtEMail : { value : "" },
      /* Model for the WebLink field. */
      txtWebLink : { value : "" }
    } 
  },
  /* Model for the Code Drawer. */
  code : { open : false, fields : {
    /* Model for the Code field. */
    rteCode : { value : "" }
  } },
  /* Model for the Notes Drawer. */
  notes : { open : false, fields : {
    /* Model for the Notes field. */
    rteNotes : { value : "" } 
  } },
  /* Model for the Keywords Drawer. */
  keywords : { open : false, 
    fields : {
      /* Model for the Keyword1 field. */
      txtKeyword1 : { value : "" },
      /* Model for the Keyword2 field. */
      txtKeyword2 : { value : "" },
      /* Model for the Keyword3 field. */
      txtKeyword3 : { value : "" },
      /* Model for the Keyword4 field. */
      txtKeyword4 : { value : "" },
      /* Model for the Keyword5 field. */
      txtKeyword5 : { value : "" }
    } 
  }
};


/**
 * The model for the Delete button.  Needed so we can enable/disable the button
 * as appropriate.
 */
SnippetDetailsAssistant.prototype.btnDeleteModel = {
  label : "Delete", buttonClass : "negative buttonfloat",
  disabled : true
}; 


/**
 * The model for the Send button.  Needed so we can enable/disable the button
 * as appropriate.
 */
SnippetDetailsAssistant.prototype.btnSendModel = {
  label : "Send", buttonClass : "buttonfloat", disabled : true
};


/**
 * Set up the scene.
 */
SnippetDetailsAssistant.prototype.setup = function() {

  // Set up application menu.
  this.controller.setupWidget(Mojo.Menu.appMenu, codeCabinet.appMenuAttributes, 
    codeCabinet.appMenuModel); 

  // Set up the Drawers themselves, making sure all but Info are collapsed.
  this.controller.setupWidget("snippetDetails_drwInfo", { }, 
    this.drawerModels.info);
  Mojo.Event.listen(this.controller.get("snippetDetails_btnInfoDrawer"), 
    Mojo.Event.tap, 
    function() {
      this.drawerModels.info.open = !this.drawerModels.info.open;
      this.controller.modelChanged(this.drawerModels.info, this);
    }.bind(this)          
  ); 
  this.controller.setupWidget("snippetDetails_drwCode", { }, 
    this.drawerModels.code);
  Mojo.Event.listen(this.controller.get("snippetDetails_btnCodeDrawer"), 
    Mojo.Event.tap, 
    function() {
      this.drawerModels.code.open = !this.drawerModels.code.open;
      this.controller.modelChanged(this.drawerModels.code, this);
    }.bind(this)          
  ); 
  this.controller.setupWidget("snippetDetails_drwNotes", { }, 
    this.drawerModels.notes);
  Mojo.Event.listen(this.controller.get("snippetDetails_btnNotesDrawer"), 
    Mojo.Event.tap, 
    function() {
      this.drawerModels.notes.open = !this.drawerModels.notes.open;
      this.controller.modelChanged(this.drawerModels.notes, this);
    }.bind(this)          
  );
  this.controller.setupWidget("snippetDetails_drwKeywords", { }, 
    this.drawerModels.keywords);
  Mojo.Event.listen(this.controller.get("snippetDetails_btnKeywordsDrawer"), 
    Mojo.Event.tap, 
    function() {
      this.drawerModels.keywords.open = !this.drawerModels.keywords.open;
      this.controller.modelChanged(this.drawerModels.keywords, this);
    }.bind(this)          
  ); 

  // Set up fields in the Info Drawer.
  this.controller.setupWidget("snippetDetails_txtName", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30 },
    this.drawerModels.info.fields.txtName
  );
  this.controller.setupWidget("snippetDetails_txtDescription", 
    { focusMode : Mojo.Widget.focusSelectMode, multiline : true },
    this.drawerModels.info.fields.txtDescription
  );
  this.controller.setupWidget("snippetDetails_txtAuthor", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 30 },
    this.drawerModels.info.fields.txtAuthor
  );
  this.controller.setupWidget("snippetDetails_txtEMail", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 40 },
    this.drawerModels.info.fields.txtEMail
  );  
  this.controller.setupWidget("snippetDetails_txtWebLink", 
    { focusMode : Mojo.Widget.focusSelectMode, maxLength : 50 },
    this.drawerModels.info.fields.txtWebLink
  );  

  // Set up fields in the Code Drawer.
  this.controller.setupWidget("snippetDetails_rteCode", {  },
    this.drawerModels.code.fields.rteCode
  );

  // Set up fields in the Notes Drawer.
  this.controller.setupWidget("snippetDetails_rteNotes", {  },
    this.drawerModels.notes.fields.rteNotes
  );

  // Set up fields in the Keywords Drawer.  Loop it to save some typing.
  for (var i = 1; i < 6; i++) {
    this.controller.setupWidget("snippetDetails_txtKeyword" + i, 
      { focusMode : Mojo.Widget.focusSelectMode, maxLength : 15 },
      this.drawerModels.keywords.fields["txtKeyword" + i]
    );
  }

  // Setup up model for and hook up event handler to the Save Button.
  this.controller.setupWidget("snippetDetails_btnSave", { },
    { label : "Save", buttonClass : "affirmative buttonfloat" }
  ); 
  Mojo.Event.listen(this.controller.get("snippetDetails_btnSave"), 
    Mojo.Event.tap, this.saveSnippet.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Send Button.
  this.controller.setupWidget("snippetDetails_btnSend", { },
    SnippetDetailsAssistant.prototype.btnSendModel
  ); 
  Mojo.Event.listen(this.controller.get("snippetDetails_btnSend"), 
    Mojo.Event.tap, this.send.bind(this)
  ); 

  // Setup up model for and hook up event handler to the Delete Button.
  this.controller.setupWidget("snippetDetails_btnDelete", { },
    SnippetDetailsAssistant.prototype.btnDeleteModel
  ); 
  Mojo.Event.listen(this.controller.get("snippetDetails_btnDelete"), 
    Mojo.Event.tap, this.deleteSnippet.bind(this)
  ); 

}; // End SnippetDetailsAssistant.prototype.setup().


/**
 * Called when the scene is activated.
 */
SnippetDetailsAssistant.prototype.activate = function() {

  // If there's a currentSnippet on codeCabinet, copy its data into the
  // field models.
  if (codeCabinet.currentSnippet) {

    // Iterate over models for the drawers.
    for (var dm in this.drawerModels) {
      // Iterate over the fields in each drawer.
      for (var f in this.drawerModels[dm].fields) {
        if (f == "rteCode") {
          // Next field is the code field, so set innerHTML of the element
          // (note that there is no model for these fields).
          this.controller.get("snippetDetails_rteCode").innerHTML = 
            codeCabinet.currentSnippet.code;
        } else if (f == "rteNotes") {
          // Next field is the notes field, so set innerHTML of the element
          // (note that there is no model for these fields).
          this.controller.get("snippetDetails_rteNotes").innerHTML = 
            codeCabinet.currentSnippet.notes;
        } else {
          // It's one of the other fields, so set the model's value to the
          // value of the field and inform the controller of the model change.
          // Note that the field of the currentSnippet object that the
          // value comes from is determined by taking the name of the field
          // we're populating, minus the 3-character type identifier appended
          // to the beginning of it in the model.  Also note that the field
          // names in currentSnippet are all lower-case, so we address that
          // too here.
          this.drawerModels[dm].fields[f].value = 
            codeCabinet.currentSnippet[f.toLowerCase().substr(3)];
          this.controller.modelChanged(this.drawerModels[dm].fields[f]);
        }
      }
    }
    
    // Enable the Delete and Send buttons, since there's something to delete
    // or send now.
    SnippetDetailsAssistant.prototype.btnDeleteModel.disabled = false;
    this.controller.modelChanged(
      SnippetDetailsAssistant.prototype.btnDeleteModel);
    SnippetDetailsAssistant.prototype.btnSendModel.disabled = false;
    this.controller.modelChanged(
      SnippetDetailsAssistant.prototype.btnSendModel);
      
  } else {    
      
    // No snippet, so clear out all the data fields in the model, as well as the 
    // code and notes fields (remember, no model for them).  See comments in the 
    // if branch for details on how this works because it's the same, minus
    // reading values from currentSnippet, since that's null at this point.
    for (var dm in this.drawerModels) {
      for (var f in this.drawerModels[dm].fields) {
        if (f == "rteCode") {
          this.controller.get("snippetDetails_rteCode").innerHTML = "";
        } else if (f == "rteNotes") {
          this.controller.get("snippetDetails_rteNotes").innerHTML = ""; 
        } else {
          this.drawerModels[dm].fields[f].value = null;
          this.controller.modelChanged(this.drawerModels[dm].fields[f]);
        }
      }
    }      
      
    // Disable the Delete and Send buttons, since there's nothing to delete
    // or send now.
    SnippetDetailsAssistant.prototype.btnDeleteModel.disabled = true;
    this.controller.modelChanged(
      SnippetDetailsAssistant.prototype.btnDeleteModel);
    SnippetDetailsAssistant.prototype.btnSendModel.disabled = true;
    this.controller.modelChanged(
      SnippetDetailsAssistant.prototype.btnSendModel);      
      
  }
  
  // Initially open the Info Drawer and close all others.
  this.drawerModels.info.open = true;  
  this.drawerModels.code.open = false;  
  this.drawerModels.notes.open = false;   
  this.drawerModels.keywords.open = false;  
  this.controller.modelChanged(this.drawerModels.info, this);
  this.controller.modelChanged(this.drawerModels.code, this);
  this.controller.modelChanged(this.drawerModels.notes, this);
  this.controller.modelChanged(this.drawerModels.keywords, this);
  
}; // End SnippetDetailsAssistant.prototype.activate().


/**
 * Handle the Save button's tap event.
 */
SnippetDetailsAssistant.prototype.saveSnippet = function() {

  // Validation: name must be entered.
  if (!this.drawerModels.info.fields.txtName.value ||
    this.drawerModels.info.fields.txtName.value.strip() == "" ||
    !this.controller.get("snippetDetails_rteCode").innerHTML ||
    this.controller.get("snippetDetails_rteCode").innerHTML.strip() == ""
    ) {
    Mojo.Controller.errorDialog(
      "I'm sorry but you must enter at least a name and code for this snippet."
    );
    return;
  }  

  // Create a snippet descriptor object from the entered data.
  var snippetDescriptor = {
    id : new Date().getTime(), categoryname : codeCabinet.currentCategory.name,
    name : this.drawerModels.info.fields.txtName.value, 
    description : this.drawerModels.info.fields.txtDescription.value,
    author : this.drawerModels.info.fields.txtAuthor.value, 
    email : this.drawerModels.info.fields.txtEMail.value, 
    weblink : this.drawerModels.info.fields.txtWebLink.value,
    code : this.controller.get("snippetDetails_rteCode").innerHTML, 
    notes : this.controller.get("snippetDetails_rteNotes").innerHTML, 
    keyword1 : this.drawerModels.keywords.fields.txtKeyword1.value,
    keyword2 : this.drawerModels.keywords.fields.txtKeyword2.value, 
    keyword3 : this.drawerModels.keywords.fields.txtKeyword3.value,
    keyword4 : this.drawerModels.keywords.fields.txtKeyword4.value, 
    keyword5 : this.drawerModels.keywords.fields.txtKeyword5.value  
  };
  
  // Call the appropriate method of the DAO to do the work depending on if this
  // is a new snippet or not.
  if (codeCabinet.currentSnippet) {
    snippetDescriptor.id = codeCabinet.currentSnippet.id;    
    dao.updateSnippet(snippetDescriptor);
    // Display confirmation banner.
    Mojo.Controller.getAppController().showBanner({
      messageText : "Snippet update successful", soundClass : "alerts" }, 
      {}, "");
  } else {
    dao.createSnippet(snippetDescriptor);
    Mojo.Controller.stageController.popScene();
  }
  
}; // End SnippetDetailsAssistant.prototype.saveSnippet(). 


/**
 * Handle the Send button's tap event.
 */
SnippetDetailsAssistant.prototype.send = function() {

  // Snippet fields may be empty, so make sure "null" isn't sent in
  // their place in that case.
  var description = codeCabinet.currentSnippet.description
  if (!description) { description = "N/A"; }
  var author = codeCabinet.currentSnippet.author
  if (!author) { author = "N/A"; }
  var email = codeCabinet.currentSnippet.email
  if (!email) { email = "N/A"; }
  var weblink = codeCabinet.currentSnippet.weblink
  if (!weblink) { weblink = "N/A"; }
  var keyword1 = codeCabinet.currentSnippet.keyword1
  if (!keyword1) { keyword1 = "N/A"; }
  var keyword2 = codeCabinet.currentSnippet.keyword2
  if (!keyword2) { keyword2 = "N/A"; }
  var keyword3 = codeCabinet.currentSnippet.keyword3
  if (!keyword3) { keyword3 = "N/A"; }
  var keyword4 = codeCabinet.currentSnippet.keyword4
  if (!keyword4) { keyword4 = "N/A"; }
  var keyword5 = codeCabinet.currentSnippet.keyword5
  if (!keyword5) { keyword5 = "N/A"; }
  var notes = codeCabinet.currentSnippet.notes
  if (!notes) { notes = "N/A"; }

  // Open the eMail app to send the snippet.
  this.controller.serviceRequest("palm://com.palm.applicationManager", {
    method  : "launch",
    parameters : { id : "com.palm.app.email", params: {
      summary : "Your code snippet has arrived",
      text : 
        "Hello from Code Cabinet!<br><br>" +
        "The following snippet was sent on " + new Date() + ":<br><br>" +
        "Category: " + codeCabinet.currentCategory.name + "<br>" +
        "Name: " + codeCabinet.currentSnippet.name + "<br>" +
        "Description: " + description + "<br>" +
        "Author: " + author + "<br>" + "eMail: " + email + "<br>" +
        "Web Link: " + weblink + "<br>" +
        "Keywords: " + keyword1 + "," + keyword2 + "," + keyword3 + "," +
          keyword4 + "," + keyword5 + "<br><br>" +
        "Notes:<br>" + notes + "<br><br>" +
        "Code:<br>" + codeCabinet.currentSnippet.code + "<br><br>" +
        "Have a great day!"
    } }
  });
  
}; // End SnippetDetailsAssistant.prototype.send(). 


/**
 * Handle the Delete button's tap event.
 */
SnippetDetailsAssistant.prototype.deleteSnippet = function() {

  this.controller.showAlertDialog({
    onChoose : function(inValue) {
      if (inValue == "yes") {
        dao.deleteSnippet(codeCabinet.currentSnippet.id);
        Mojo.Controller.stageController.popScene();
      } 
    },
    title : "Confirm Delete",
    message : "Are you sure you want to delete this snippet?",
    choices : [
      { label : "Yes", value : "yes", type : "affirmative"},  
      { label : "No", value : "no", type : "negative"}    
    ]
  });
  
}; // End SnippetDetailsAssistant.prototype.deleteSnippet(). 
