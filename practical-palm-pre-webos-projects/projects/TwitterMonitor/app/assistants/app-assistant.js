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
 * The application's assistant class.
 */
function AppAssistant() { }


/**
 * Flag set to true when status updating should be paused.  Gets set 
 * when settings scene is up for example.
 */
AppAssistant.prototype.pauseUpdates = false;


/**
 * Depot used for data storage.
 */
AppAssistant.prototype.depot = null;


/**
 * List of friends for Twitter account.
 */
AppAssistant.prototype.friends = null;


/**
 * Temporary friends list used by the settings scene.
 */
AppAssistant.prototype.tempFriends = null;


/**
 * A simple object containing information on the users' Twitter account.
 */
AppAssistant.prototype.accountInfo = null;


/**
 * Temporary friends list used by the settings scene.
 */
AppAssistant.prototype.tempAccountInfo = null;
  

/**
 * Launch the application.
 */
AppAssistant.prototype.handleLaunch = function() {

  // If we get here and there's already a stage created, that means the user
  // tapped a banner notification.  In that case we remove all banners and
  // activate the stage.
  var sa = this.controller.getStageController("dashboardStage");
  if (sa) {
    this.controller.removeAllBanners();
    sa.activate();
    return;
  }
  
  // Create main dashboard stage. 
  this.controller.createStageWithCallback(
    { name : "dashboardStage" }, 
    function(inStageController) {
      inStageController.pushScene(
        { name : "main", sceneTemplate : "main/main-scene" },
        { }
      );
    }, "dashboard"
  );

  // Load stored data, if any.
  this.depot = new Mojo.Depot(
    { name : "TwitterMonitor", version : 1, replace : false }, 
    function() {
      // Load accountInfo, if depot is available.
      this.depot.simpleGet("accountInfo", 
        function(inObject) {
          if (inObject) {
            this.accountInfo = inObject;
          } 
        }.bind(this),
        function(inTransaction, inResult) {
          Mojo.Controller.errorDialog(
            "Failure reading accountInfo from depot: " + inResult);      
        }.bind(this)
      );
      // Load favorites, if depot is available.
      this.depot.simpleGet("friends", 
        function(inObject) {
          if (inObject) {
            this.friends = inObject;
          } 
        }.bind(this),
        function(inTransaction, inResult) {
          Mojo.Controller.errorDialog("Failure reading friends from depot: " +
            inResult);      
        }.bind(this)
      );
    }.bind(this),
    function(inTransaction, inResult) {
      Mojo.Controller.errorDialog("Failure opening depot: " + inResult);
      this.depot = null;
    }.bind(this)
  ); 

}; // End AppAssistant.prototype.handleLaunch().


/**
 * Checks for Internet connectivity and calls the appropriate callback.
 *
 * @param inAssistant       The scene assistant from which this is called.
 * @param inSuccessCallback Function to call if connectivity is available.
 * @param inFailureCallback Function to call if connectivity is NOT available.
 */
AppAssistant.prototype.checkConnectivity = function(inAssistant, 
  inSuccessCallback, inFailureCallback) {  
  
  inAssistant.controller.serviceRequest("palm://com.palm.connectionmanager", {
    method : "getstatus",
    parameters : { subscribe : false },
    onSuccess : function(inResponse) {
      // Note: isInternetConnectionAvailable seems to always return true
      // in the emulator... even pulling the network cable out didn't help,
      // nor did turning on airplane mode.  It may be possible to configure
      // VirtualBox's proxy settings, but I didn't try that (disabling the
      // network adapter in VirtualBox didn't work either!)
      if (inResponse.isInternetConnectionAvailable) {
        inSuccessCallback();
      } else {
        // Note that the failure callback is called AFTER the dialog is
        // dismissed.  Also note that Mojo.Dialog.errorDialog doesn't work
        // here either, although I'm not sure why.  Ditto for the
        // onFailure handler below.
        inAssistant.controller.showAlertDialog({
          onChoose : function() { inFailureCallback() },
          title : "Error",
          message : "Internet connection not avalailable",
          choices : [ { label : "Ok", value : "ok" } ]
        });
      }
    },
    onFailure : function() {
      // Service call failed.
      inAssistant.controller.showAlertDialog({
        onChoose : function() { inFailureCallback() },
        title : "Error",
        message : "Internet connection not avalailable",
        choices : [ { label : "Ok", value : "ok" } ]
      });
    }
  });
  
}; // End checkConnectivity().
  