/*
    Twitter Monitor - From the book "Practical webOS Projects With the Palm Pre"
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
 * A reference to the app assistant.  Makes for less typing later!  Note that
 * it's global to this scene so that it can be used while constructing the
 * assistant(i.e., in the models definition).
 */
var appAssistant = Mojo.Controller.getAppController().assistant;


/**
 * The scene's assistant class.
 */
function SettingsAssistant() { }


/**
 * Models for widgets in this scene.
 */
SettingsAssistant.prototype.models = {
  txtUsername : { value : null },
  txtPassword : { value : null },
  btnGetFriends : { label : null, disabled : null },
  lstFriends : { items : null }
};


/**
 * Set up the scene.
 */
SettingsAssistant.prototype.setup = function() {

  // Make sure we don't try to contact Twitter until this scene is done.
  appAssistant.pauseUpdates = true;

  // Set up application menu so we have the About option available.
  this.controller.setupWidget(Mojo.Menu.appMenu, { }, 
    { items : [
      { label : "About...", command : "about-TAP" }
    ] }
  ); 

  // Set values for the Get Friends Button.
  this.models.btnGetFriends.label = "Get Friends";
  this.models.btnGetFriends.disabled = false;

  // Updates values in models based on existing values for username and
  // password, if any.
  if (appAssistant.tempAccountInfo) {
    this.models.txtUsername.value = appAssistant.tempAccountInfo.username;
    this.models.txtPassword.value = appAssistant.tempAccountInfo.password;
  } else {
    if (appAssistant.accountInfo) {
      this.models.txtUsername.value = appAssistant.accountInfo.username;
      this.models.txtPassword.value = appAssistant.accountInfo.password;
    }
  }
  appAssistant.tempAccountInfo = null;
  
  // Now do the same for the friends list.
  this.models.lstFriends.items = [ ];
  if (appAssistant.tempFriends) {
    // This will execute right after friends have been retrieved.
    for (var i = 0; i < appAssistant.tempFriends.length; i++) {
      this.models.lstFriends.items.push(appAssistant.tempFriends[i]);
    }
  } else {
    // This will happen when the settings scene is first shown.
    if (appAssistant.friends) {
      if (Object.isArray(appAssistant.friends)) {
        for (var i = 0; i < appAssistant.friends.length; i++) {
          this.models.lstFriends.items.push(appAssistant.friends[i]);
        }
      } else {
        for (var f in appAssistant.friends) {
          this.models.lstFriends.items.push(appAssistant.friends[f]);
        }
      }
    }
  }
  appAssistant.tempFriends = null;

  // Set up username TextField.
  this.controller.setupWidget("settings_txtUsername", 
    { focusMode : Mojo.Widget.focusSelectMode, 
      textCase : Mojo.Widget.steModeLowerCase }, this.models.txtUsername
  );

  // Set up password PasswordField.
  this.controller.setupWidget("settings_txtPassword", 
    { focusMode : Mojo.Widget.focusSelectMode,
      textCase : Mojo.Widget.steModeLowerCase }, this.models.txtPassword
  );
  
  // Set up get friends Button.  
  this.controller.setupWidget("settings_btnGetFriends", 
    { type : Mojo.Widget.activityButton }, this.models.btnGetFriends
  ); 
  Mojo.Event.listen(this.controller.get("settings_btnGetFriends"), 
    Mojo.Event.tap, this.getFriendsTap.bind(this)
  );   

  // Set up done Button.
  this.controller.setupWidget("settings_btnDone", 
    { }, { label : "Done" }
  ); 
  Mojo.Event.listen(this.controller.get("settings_btnDone"), Mojo.Event.tap, 
    this.doneTap.bind(this)
  ); 
  
  // Set up List for friends.
  this.controller.setupWidget("settings_lstFriends", {
    itemTemplate : "settings/list-item" }, this.models.lstFriends);
    
  // Set up the widgets in friends list.
  for (var i = 0; i < this.models.lstFriends.items.length; i++) {
    // ToggleButtons.
    this.controller.setupWidget(
      "tglFriends_" + this.models.lstFriends.items[i].username, 
      { modelProperty : "monitoring" }, this.models.lstFriends.items[i]
    ); 
    // Keywords TextField.
    this.controller.setupWidget(
      "txtKeywords_" + this.models.lstFriends.items[i].username, 
      { focusMode : Mojo.Widget.focusSelectMode, modelProperty : "keywords",
        textCase : Mojo.Widget.steModeLowerCase },
      this.models.lstFriends.items[i]
    );
  }
  
}; // End SettingsAssistant.prototype.setup().


/**
 * Clean up when the scene goes away.
 */
SettingsAssistant.prototype.cleanup = function() {

  appAssistant.pauseUpdates = false;

}; // End SettingsAssistant.prototype.cleanup().


/**
 * Handles tap event on the Get Friends Button.
 */
SettingsAssistant.prototype.getFriendsTap = function() {

  // Change Button text, disable and show spinner.
  this.models.btnGetFriends.label = "Working, Please Wait...";
  this.models.btnGetFriends.disabled = true;
  this.controller.modelChanged(this.models.btnGetFriends);
  this.controller.get("settings_btnGetFriends").mojo.activate();

  // Verify the account, which also will retrieve the friends list if the
  // credentials prove to be valid.
  appAssistant.checkConnectivity(this,
    this.verifyAccount.bind(this),
    function() {
      // Connectivity not available.
      this.resetButton();
      Mojo.Controller.errorDialog("Internet connectivity not available");
    }.bind(this)
  );   
  

}; // End SettingsAssistant.prototype.getFriendsTap().


/**
 * Handles tap event on the Done Button.
 *
 * @param inReshow When true, this scene will be swapped for itself.  This is
 *                 needed when the Get Friends processing completes and this
 *                 method is called to save everything.
 */
SettingsAssistant.prototype.doneTap = function(inReshow) {

  // Save account info.
  appAssistant.accountInfo = { 
    username : this.models.txtUsername.value,
    password : this.models.txtPassword.value
  };
  appAssistant.depot.simpleAdd("accountInfo", 
    appAssistant.accountInfo, function() { }, 
    function(inTransaction, inResult) { }
  ); 
  
  // Save friends.
  appAssistant.friends = [ ];
  for (var i = 0; i < this.models.lstFriends.items.length; i++) {
    appAssistant.friends.push(this.models.lstFriends.items[i]);
  }
  appAssistant.depot.simpleAdd("friends", 
    appAssistant.friends, function() {
      // Close this stage, we're done.
      Mojo.Controller.getAppController().closeStage("settingsStage");
    }, 
    function(inTransaction, inResult) { }
  );

}; // End SettingsAssistant.prototype.doneTap().


/**
 * Resets the Get Friends Button to its default, enabled state.
 */
SettingsAssistant.prototype.resetButton = function() {

  this.models.btnGetFriends.label = "Get Friends";
  this.models.btnGetFriends.disabled = false;
  this.controller.modelChanged(this.models.btnGetFriends);
  this.controller.get("settings_btnGetFriends").mojo.deactivate();

}; // End SettingsAssistant.prototype.resetButton().


/**
 * Verifies the entered account credentials.
 */
SettingsAssistant.prototype.verifyAccount = function() {

  new Ajax.Request(
    "http://twitter.com/account/verify_credentials.json", 
    {
      method : "get", evalJSON : "force",
      requestHeaders : {
        Authorization : "Basic " + Base64.encode(
          this.models.txtUsername.value + ':' + this.models.txtPassword.value
        )       
      }, 
      
      onSuccess : function(inTransport) {
        // Account verified, so start retrieving friends.
        appAssistant.tempAccountInfo = {
          username : this.models.txtUsername.value,
          password : this.models.txtPassword.value
        };
        appAssistant.tempFriends = [ ];
        this.getFriends(-1);
      }.bind(this),
      
      onFailure : function(inTransport) {
        // Failure while verifying account.
        this.resetButton();
        Mojo.Controller.errorDialog("Unable to verify account.  " +
          "Please check entered credentials and try again."
        );
      }.bind(this),
      
      onException : function(inTransport, inException) {
        // Exception while verifying account.
        Mojo.Controller.errorDialog("EXCEPTION: " + inException);
      }.bind(this)
      
    }
  );

}; // End SettingsAssistant.prototype.verifyAccount();


/**
 * Get a list of friends for a given user.  This can be called recursively to
 * page through a large number of results.
 *
 * @param inCursor The identifier for the next page of friends to get.  Twitter
 *                 sends 100 friends at a time, but you can page through a
 *                 larger number of friends by sending the cursor parameter,
 *                 take from the value of the next_cursor element of the
 *                 responses (-1 passed in initially to get the first page).
 */
SettingsAssistant.prototype.getFriends = function(inCursor) {

  new Ajax.Request(
    "http://twitter.com/statuses/friends.json", 
    {
      method : "get", evalJSON : "force",
      parameters : { id : this.models.txtUsername.value, cursor : inCursor },
      
      onSuccess : function(inTransport) {
        // Save the retrieved friends to the temporary array.
        for (var i = 0; i < inTransport.responseJSON.users.length; i++) {
          appAssistant.tempFriends.push({
            id : inTransport.responseJSON.users[i].id,
            username : inTransport.responseJSON.users[i].screen_name, 
            keywords : "", lastStatusID : null, monitoring : false
          });
        }
        if (inTransport.responseJSON.next_cursor != 0) {
          // There's more friends to be retrieved, so go get'em!
          this.getFriends(inTransport.responseJSON.next_cursor);
        } else {
          // We've got all the friends, so swap out this scene so the
          // widgets in the List can be set up properly.
          Mojo.Controller.stageController.swapScene("settings");              
        }
      }.bind(this),
      
      onFailure : function(inTransport) {
        // Failure while getting friends list.
        this.resetButton();
        Mojo.Controller.errorDialog("Unable to get friends list: " +
          inTranspot.responseText);
      }.bind(this),
      
      onException : function(inTransport, inException) {
        // Exception while getting friends list.
        Mojo.Controller.errorDialog("EXCEPTION: " + inException);
      }.bind(this)
      
    }
  );

}; // End SettingsAssistant.prototype.getFriends();


/**
 * Handle application menu commands.
 *
 * @param inEvent Incoming event object.
 */ 
SettingsAssistant.prototype.handleCommand = function(inEvent) {

  switch (inEvent.type) {
    case Mojo.Event.command:
      switch (inEvent.command) {
        case "about-TAP":
          this.controller.showAlertDialog({
            onChoose : function(inValue) {},
            title : "Twitter Monitor v1.0",
            message : "From the book " +
              "'Practical webOS Projects With the Palm Pre' " +
              "(Apress, 2009, ISBN-13: 978-1-4302-2674-1). " +
              "Copyright 2009 Frank W. Zammetti. All rights reserved. " +
              "A product of Etherient: http://www.etherient.com",
            choices : [
              { label : "Ok", value : "" }
            ]
          });      
        break;
      }
    break;
  }
  
}; // SettingsAssistant.prototype.handleCommand().
