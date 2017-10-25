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
 * The shadboard's assistant class.
 */
function MainAssistant() { }


/**
 * A log of statuses that were flagged.  Used so the user can cycle through
 * them with a tap on the dashboard.
 */
MainAssistant.prototype.statuses = [ ];


/**
 * Pointer to the element in the statuses array currently displayed.
 */
MainAssistant.prototype.statusesIndex = -1;


/**
 * Set up the scene.
 */
MainAssistant.prototype.setup = function() {

  // Handle tap event on status area.
  Mojo.Event.listen($("tdStatus"), Mojo.Event.tap,
    function() {
      // Only react if there are statuses to display.
      if (this.statusesIndex > -1) {
        // Bump up to the next status.  If there are no more, cycle back
        // to the first one.
        this.statusesIndex = this.statusesIndex + 1;
        if (this.statusesIndex >= this.statuses.length) {
          this.statusesIndex = 0;
        }
        // Now display the status.
        $("tdStatus").innerHTML = "<b>" +
          this.statuses[this.statusesIndex].screen_name + " (" +
          this.statuses[this.statusesIndex].created_at + "): </b>" + 
          this.statuses[this.statusesIndex].text;        
      }
    }.bind(this)
  ); 

  // Handle tap event on command button.
  Mojo.Event.listen($("btnMenu"), Mojo.Event.tap,
    function() {
      // Avoid trying to create stage twice.
      if (Mojo.Controller.getAppController().getStageController(
        "settingsStage")) {
        return;
      }
      Mojo.Controller.getAppController().createStageWithCallback(
        { name : "settingsStage" }, 
        function(inStageController) {
          inStageController.pushScene(
            { name : "settings", sceneTemplate : "settings/settings-scene" },
            { }
          );
        }, "card"
      );
    }
  ); 

}; // End MainAssistant.prototype.setup().


/**
 * Activate the scene.
 */
MainAssistant.prototype.activate = function() {

  // Start up the interval to monitor feeds every five minutes.  Note that this 
  // has to be done here, as opposed to the app assistant where it might make 
  // more sense, because there's no window object to call setInterval() on 
  // there.
  setInterval(this.checkFeeds.bind(this), (1000 * 60 * 5));
  
  // Do a one-time feed check at startup.
  setTimeout(this.checkFeeds.bind(this), (1000 * 5));

}; // End MainAssistant.prototype.activate().


/**
 * Method executed at a set interval to monitor feeds.
 */
MainAssistant.prototype.checkFeeds = function() {

  // We'll need a reference to the app assistant throughout.
  var appAssistant = Mojo.Controller.getAppController().assistant;

  // Abort processing if flag set (means settings scene is up).
  if (appAssistant.pauseUpdates) {
    return;
  }
  
  // Check each friend to see which are being monitored.
  for (var f in appAssistant.friends) {

    // See if the friend is being monitored.
    if (appAssistant.friends[f].monitoring) {

      // This friend is being monitored, so go get their latest status.
      new Ajax.Request("http://twitter.com/users/show.json", {
        method : "get", evalJSON : "force",
        parameters : { id : appAssistant.friends[f].id,
          f : appAssistant.friends[f], fAttr : f },
        
        onSuccess : function(inTransport) {
          var friend = inTransport.request.parameters.f;
          // Abort if the status ID returned is the same as the ID of the
          // last status looked at.
          if (inTransport.responseJSON.status.id == friend.lastStatusID) {
            return;
          }
          // Ok, it's a new status, so update the lastStatusID in the 
          // friends' object.
          friend.lastStatusID = inTransport.responseJSON.status.id;
          appAssistant.friends[inTransport.request.parameters.fAttr] = friend;
          // Next, scan for keywords.
          var keywords = friend.keywords;
          if (keywords) {
            keywords = keywords.split(",");
            for (var i = 0; i < keywords.length; i++) {
              var keyword = (keywords[i].strip()).toLowerCase();
              var status = inTransport.responseJSON.status.text.toLowerCase();
              if (status.indexOf(keyword) != -1) {
                // Keyword found.  Display alert.
                Mojo.Controller.getAppController().showBanner({
                  messageText : "Alert: Tweets Flagged", soundClass : "alerts" 
                }, { }, "");                     
                // Show it on the dashboard.            
                $("tdStatus").innerHTML = "<b>" +
                  inTransport.responseJSON.screen_name + " (" +
                  inTransport.responseJSON.status.created_at + "): </b>" + 
                  inTransport.responseJSON.status.text;
                // Add it to the statuses array.
                this.statuses.push({
                  screen_name : inTransport.responseJSON.screen_name,
                  created_at : inTransport.responseJSON.status.created_at, 
                  text : inTransport.responseJSON.status.text
                });
                // Bump up the index into statuses so user can cycle
                // through all flagged statuses.
                this.statusesIndex = this.statusesIndex + 1;
                // Break the loop so multiple keyword hits for this status
                // don't result in the status being displayed/stored
                // more than once.
                break;
              } // End keyword found.
            } // End iteration of keywords.
          } // End if(keywords).
        }.bind(this),
        
        onFailure : function() { /* Squelch failure. */ },
        
        onException : function() { /* Squelch exception. */ }
          
      }); // End AJAX request.        
      
    } // End if(friend.monitoring).
    
  } // End iteration of friends.

}; // End MainAssistant.prototype.checkFeeds().
