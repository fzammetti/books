/*
    Time Tracker - From the book "Practical webOS Projects With the Palm Pre"
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


function TimeTracker() {


  /**
   * The currently logged in user.  This is actually a Resource object.
   */
  this.user = null;
  
  
  /**
   * Current list of projects retrieved from server.
   */
  this.projects = [ ];
  
  
  /**
   * Current list of resources retrieved from server.
   */
  this.resources = [ ];


  /**
   * Current list of tasks retrieved from server.
   */
  this.tasks = [ ];


  /** 
   * The base URL for the remote API.
   */
  this.apiURL = "http://wostimetracker.appspot.com/wostimetracker/";


  /**
   * The interval for synchronizing local changes with the remote service.
   */
  this.retryInterval = null;
  

  /**
   * A utility method for formatting a Date object as a string in the form
   * mm/dd/yyyy.  Unfortunately, the Mojo.Format.formatDate() method doesn't
   * seem to be capable of outputting a full four-digit year, as the service
   * API required, so we have to provide this capability ourselves.
   *
   * @param  inDate The Date object to format.
   * @return        A string representation of inDate in the form mm/dd/yyyy.
   */
  this.formatDate = function(inDate) {

    var month = "" + (inDate.getMonth() + 1);
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = "" + inDate.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    var year = "" + inDate.getFullYear();
    return (month + "/" + day + "/" + year);

  }; // End formatDate().


  /**
   * The function called to synchronize local changes with the remote service.
   */
  this.synchronize = function() {

    timeTracker.syncOp("project");
    timeTracker.syncOp("task");
    timeTracker.syncOp("resource");  
    
  }; // End synchronize().
 
 
  /**
   * Called for each project, task and resource in the local database from
   * synchronize() to re-send them to the remote service.
   
   * @param inType   The entity type ("project", "task", "resource").
   */
  this.syncOp = function(inType) {

    // Retrieve all entities of the given type from the local DB.
    dao.db.transaction((function (inTransaction) {
      inTransaction.executeSql(dao["sqlRetrieve_" + inType + "s"], [ ],
        function(inTransaction, inResultSet) {
          if (inResultSet && inResultSet.rows && inResultSet.rows.length > 0) {
            for (var i = 0; i < inResultSet.rows.length; i++) {
              var entity = inResultSet.rows.item(i);
              Mojo.Log.error("### synchronize->syncOp: Sending " + inType + 
                " " + entity.name);
              // Do remote op.
              new Ajax.Request(
                timeTracker.apiURL + inType + "/", {
                method : "post", evalJSON : "force",
                parameters : entity,
                onSuccess : function() {
                  // Success, delete record from local DB.
                  dao.db.transaction((function (inTransaction) {
                    inTransaction.executeSql(dao["sqlDelete_" + inType], 
                      [ entity.name ],
                      function() {
                        Mojo.Log.error("### synchronize->syncOp: Successful " + 
                         inType + " resend, name=" + entity.name);
                      }, 
                      function() { }
                    ); 
                  }));       
                },
                onFailure : function(inTransport) {
                  Mojo.Log.error("### synchronize->syncOp: " + 
                    inTransport.status + " - " + 
                    inTransport.request.url + " - ");
                },
                onException : function(inone, inException) {
                  Mojo.Log.error("### synchronize->syncOp: EXCEPTION: " + 
                    inException);
                }                
              });            
            }
          } else {
            Mojo.Log.error("### synchronize->syncOp: No " + inType + "s");
          }      
        }, 
        function() { }
      ); 
    })); 

  }; // End syncOp().

}; // End class.


// One instance to rule them all.
var timeTracker = new TimeTracker();
