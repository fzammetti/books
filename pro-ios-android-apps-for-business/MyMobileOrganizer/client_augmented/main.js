/**
 * The prefix that is used to form the URL all AJAX requests go to.  When
 * developing on the desktop this should be http://127.0.0.1:80 or wherever
 * the server component is configured at.  Any other time, like when it's built
 * as a PhoneGap app, it should be a server address.  The logic in the
 * mobileinit handler determines this.
 *
 * Also, when developing on the desktop, you'll need to set your browser to
 * allow AJAX requests from a local file (or, alternatively, you'll need to put
 * the client app on a web server).  In Chrome, Opera and Safari that appears
 * to be allowed by default.  In IE I'm not sure how to do it.  In Firefox,
 * you need to open about:config and set security.fileuri.strict_origin_policy
 * to false.
 */
var ajaxURLPrefix = null;


/**
 * The ID of the item being updated, or null when doing an add.
 */
var updateID = null;


/**
 * Flag: is network connectivity available?
 */
var networkAvailable = true;


/**
 * Flags that tell us when each entity page has been visited.
 */
var pageVisited = {
  appointment : false,
  contact : false,
  note : false,
  task : false
};


// ----------------------------------------------------------------------------
// EVENT HANDLERS.
// ----------------------------------------------------------------------------


/**
 * Startup code #1.  Do any non-UI setup here.
 */
$(document).on("mobileinit", function() {

  // Set JQM defaults.
  $.mobile.defaultPageTransition  = "none";
  $.mobile.defaultDialogTransition  = "none";
  $.mobile.phonegapNavigationEnabled = true;
  $.mobile.loader.prototype.options.text = "...Please Wait...";
  $.mobile.loader.prototype.options.textVisible = true;

  // Determine AJAX URL prefix.
  if (document.location.protocol.toLowerCase().indexOf("file") != -1) {
    ajaxURLPrefix = "http://192.168.1.17:80";
  } else {
    ajaxURLPrefix = "http://127.0.0.1:80";
  }

});

/**
 * Startup code #2.  The call to get server data has to be done here rather
 * than in the mobileinit handler because the UI needs to be built or the
 * calls to show and hide the screen mask will break.  The ready event
 * is triggered after the UI is built, whereas mobileinit happens before,
 * so we have to do the call here.
 */
$(document).on("ready", function() {

  // If we're running inside PhoneGap then we can determine if we have
  // connectivity up-front without trying the fetches.
  if (navigator && navigator.connection &&
    navigator.connection.type == Connection.NONE
  ) {
    showConnectivityMsg();
  } else {
    downloadServerData();
  }

  // Hook up a click handler to the clear confirmation dialog's "yes" button.
  $("#confirmClearYes").on("click", function() {
    clearData();
  });

});

/**
 * Handle the onLoad event to add a shake handler.
 */
$(document).on("deviceready",
  function() {
    shake.startWatch(function() {
      $.mobile.changePage("#confirmClear");
    });
  }
);


// ----------------------------------------------------------------------------
// FUNCTIONS
// ----------------------------------------------------------------------------


/**
 * Show the dialog when network connectivity is unavailable.
 */
function showConnectivityMsg() {

  networkAvailable = false;
  $("#infoDialogHeader").html("No Network Connectivity");
  $("#infoDialogContent").html(
    "Network connectivity is currently unavailable. The ability to " +
    "create new items, update items and delete items has been " +
    "disabled.  You can still browse locally-cached data. Restart " +
    "the app when connectivity has been restored."
  );
  $.mobile.changePage($("#infoDialog"), { role : "dialog" });

} // End showConnectivityMsg().


/**
 * Downloads all data from the server for all entity types at app startup,
 * assuming a connection is available.  If connection is not available then
 * local data will be used and no updates will be allowed until the app is
 * restarted (and assuming a connection is available at that point).
 */
function downloadServerData() {

  $.mobile.loading("show");

  /**
   * Structure used during loading.
   */
  var fetching = {
    loaded_appointment : false, loaded_contact : false,
    loaded_note : false, loaded_task : false,
    data_appointment : null, data_contact : null,
    data_note : null, data_task : null
  };

  // Function executed when each of the four AJAX requests returns, regardless
  // of whether they succeeded or not.  Passed to this is the type of entity
  // completed and the response from the server, or null if the call failed.
  var completeLoad = function(inType, inResponse) {

    // Record that this entity type was loaded and the server's response.
    fetching["loaded_" + inType] = true;
    fetching["data_" + inType] = inResponse;

    // When all four have completed then it's time to get to work.
    if (fetching.loaded_appointment && fetching.loaded_contact &&
      fetching.loaded_note && fetching.loaded_task) {

      // If we got back data for all four entity types then we're good to go.
      if (fetching.data_appointment && fetching.data_contact &&
        fetching.data_note && fetching.data_task
      ) {

        // Clear localStorage and then populate it with the fresh data.
        window.localStorage.clear();
        var types = [ "appointment", "contact", "note", "task" ];
        for (var i = 0; i < types.length; i++) {
          var typ = types[i];
          var dat = fetching["data_" + typ];
          var len = dat.length;
          var lst = window.localStorage;
          for (var j = 0; j < len; j++) {
            var obj = dat[j];
            lst.setItem(typ + "_" + obj._id, JSON.stringify(obj));
          }
        }

      } else {

        // One or more entities were not fetched, which we take to mean there's
        // a connectivity problem, so let the user know what's up.  Whatever
        // data is in localStorage will be used for this run.
        showConnectivityMsg();

      }

      // To conserve memory, erase the temporary load structure.
      fetching = null;

      // Unmask screen and we're done here.
      $.mobile.loading("hide");

    }

  };

  // Get all appointments.
  $.ajax({ url : ajaxURLPrefix + "/appointment" })
  .done(function(inResponse) { completeLoad("appointment", inResponse); })
  .fail(function(inXHR, inStatus) { completeLoad("appointment", null); });

  // Get all contacts.
  $.ajax({ url : ajaxURLPrefix + "/contact" })
  .done(function(inResponse) { completeLoad("contact", inResponse); })
  .fail(function(inXHR, inStatus) { completeLoad("contact", null); });

  // Get all notes.
  $.ajax({ url : ajaxURLPrefix + "/note" })
  .done(function(inResponse) { completeLoad("note", inResponse); })
  .fail(function(inXHR, inStatus) { completeLoad("note", null); });

  // Get all tasks.
  $.ajax({ url : ajaxURLPrefix + "/task" })
  .done(function(inResponse) { completeLoad("task", inResponse); })
  .fail(function(inXHR, inStatus) { completeLoad("task", null); });

} // End downloadServerData();().


/**
 * Get all entities of a given type from localStorage and return them
 * as objects.
 *
 * @param inType The type of entity to get (appointment
 */
function getAllFromLocalStorage(inType) {

  var items = [ ];

  // First, get the data of the appropriate type from localStorage.
  var lst = window.localStorage;
  for (var itemKey in lst) {
    if (itemKey.indexOf(inType) == 0) {
      var sObj = lst.getItem(itemKey);
      items.push(JSON.parse(sObj));
    }
  }

  // Second, sort the resultant array, since the order we get it from
  // localStorage is indeterminate.
  items.sort(function(a, b) {
    switch (inType) {
      case "contact":
        return a.lastName > b.lastName;
      break;
      case "appointment": case "note": case "task":
        return a.title > b.title;
      break;
    }
  });

  return items;

} // End getAllFromLocalStorage().


/**
 * Show a list view.
 *
 * @param inType The type of list to show.
 */
function showListView(inType) {

  // Flip to list view and ensure menu is closed.
  $("#" + inType + "Entry").hide("fast");
  $("#" + inType + "List").show("fast");
  $("#" + inType + "Menu" ).popup("close");

  // Clear entry form and reset updateID (do this last so that the user doesn't
  // see the clear happen before the transition).  Also note: NOT using jQuery
  // because why incur the overhead for something like this?!
  updateID = null;
  document.getElementById(inType + "EntryForm").reset();

} // End showListView().


/**
 * Save an entity.  This is used for adding a new entity as well as updating an
 * existing entity.
 *
 * @param inType       The type of entity to save.
 * @param inGeoLatLong A string containing the latitude and longitude at the
 *                     time this note was saved.
 */
function doSave(inType, inGeoLatLong) {

  // First things first: validate the form and abort if something's not right.
  if (!validations["check_" + inType](inType)) {
    $("#infoDialogHeader").html("Error");
    $("#infoDialogContent").html(
      "Please provide values for all required fields"
    );
    $.mobile.changePage($("#infoDialog"), { role : "dialog" });
    return;
  }

  // Scrim screen for the duration of the call.
  $.mobile.loading("show");

  // Flip to list view and ensure menu is closed.
  $("#" + inType + "Entry").hide();
  $("#" + inType + "List").show();
  $("#" + inType + "Menu" ).popup("close");

  // Select appropriate HTTP method and ensure inUpdateID is a non-null value
  // no matter what.
  var httpMethod = "post";
  var uid = "";
  if (updateID) {
    httpMethod = "put";
    uid = "/" + updateID;
  }

  // Wrap the remainder of the code to execute in a function so we can use it
  // as a callback within the geolocation callbacks.
  var finalSave = function(inType) {

    // Get form data and then clear the form and reset updateID.
    var frmData = getFormAsJSON(inType);

    updateID = null;
    document.getElementById(inType + "EntryForm").reset();

    // Send to server.
    $.ajax({
      url : ajaxURLPrefix + "/" + inType + uid, type : httpMethod,
      contentType: "application/json", data : frmData
    })
    .done(function(inResponse) {
      // Add the item to localStorage.  Since we have the data in the form of a
      // string we just need to slice off the closing brace, then add the
      // two fields that MongoDB would add.
      frmData = frmData.slice(0, frmData.length - 1);
      frmData = frmData + ",\"__v\":\"0\",\"_id\":\"" + inResponse + "\"}";
      window.localStorage.setItem(inType + "_" + inResponse, frmData);
      // Now repopulate the listview from localStorage.  This is NOT the most
      // efficient way to go about doing this, but it's expedient in terms of
      // writing the code and for small data sets the performance will be fine.
      populateList(inType);
      // Now update the UI as appropriate and we're done.
      $.mobile.loading("hide");
      $("#infoDialogHeader").html("Success");
      $("#infoDialogContent").html("Save to server complete");
      $.mobile.changePage($("#infoDialog"), { role : "dialog" });
    })
    .fail(function(inXHR, inStatus) {
      $.mobile.loading("hide");
      $("#infoDialogHeader").html("Error");
      $("#infoDialogContent").html(inStatus);
      $.mobile.changePage($("#infoDialog"), { role : "dialog" });
    });

  };

  if (inType == "note") {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        $("#" + inType + "EntryForm [name=geoLatLong]").val(
          position.coords.latitude + "," + position.coords.longitude
        );
        finalSave("note");
      },
      function(error) {
        $("#" + inType + "EntryForm [name=geoLatLong]").val(
          "Not Available"
        );
        finalSave("note");
      }
    );
  } else {
    finalSave(inType);
  }

} // End doSave().


/**
 * Gets the data from a form as a string of JSON.
 *
 * @param  inType The type of entity to get form data for.
 * @return        The JSON string of that data.
 */
function getFormAsJSON(inType) {

  var frmData = $("#" + inType + "EntryForm").serializeArray();
  var frmObj = { };
  for (var i = 0; i < frmData.length; i++) {
    var fld = frmData[i];
    frmObj[fld.name] = fld.value;
  }
  return JSON.stringify(frmObj);

} // End getFormAsJSON();


/**
 * An object that contains functions for doing validations of the entry forms.
 * Each of them returns true if the form is valid, false if not.
 */
var validations = {

  /**
   * Validate appointment form.
   */
  check_appointment : function() {
    if (isBlank("appointmentTitle")) { return false; }
    if (isBlank("appointmentDate")) { return false; }
    return true;
  },

  /**
   * Validate contact form.
   */
  check_contact : function() {
    if (isBlank("contactFirstName")) { return false; }
    if (isBlank("contactLastName")) { return false; }
    return true;
  },

  /**
   * Validate note form.
   */
  check_note : function() {
    if (isBlank("noteTitle")) { return false; }
    if (isBlank("noteText")) { return false; }
    return true;
  },

  /**
   * Validate task form.
   */
  check_task : function() {
    if (isBlank("taskTitle")) { return false; }
    return true;
  }

};


/**
 * Delete an entity.
 *
 * @param inType The type of entity to delete.
 */
function doDelete(inType) {

  // Scrim screen for the duration of the call.
  $.mobile.loading("show");

  // Flip to list view and ensure menu is closed.
  $("#" + inType + "Entry").hide();
  $("#" + inType + "List").show();
  $("#" + inType + "Menu" ).popup("close");

  var uid = "/" + updateID;

  // Clear entry form and reset updateID.
  updateID = null;
  document.getElementById(inType + "EntryForm").reset();

  // Send to server.
  $.ajax({ url : ajaxURLPrefix + "/" + inType + uid, type : "delete" })
  .done(function(inResponse) {
    // Remove item from localStorage.
    window.localStorage.removeItem(inType + "_" + inResponse);
    // Now repopulate the listview from localStorage.  This is NOT the most
    // efficient way to go about doing this, but it's expedient in terms of
    // writing the code and for small data sets the performance will be fine.
    populateList(inType);
    // Now update the UI as appropriate and we're done.
    $.mobile.loading("hide");
    $("#infoDialogHeader").html("Success");
    $("#infoDialogContent").html("Delete from server complete");
    $.mobile.changePage($("#infoDialog"), { role : "dialog" });
  })
  .fail(function(inXHR, inStatus) {
    $.mobile.loading("hide");
    $("#infoDialogHeader").html("Error");
    $("#infoDialogContent").html(inStatus);
    $.mobile.changePage($("#infoDialog"), { role : "dialog" });
  });

} // End doDelete().


/**
 * Fired when an entity page is shown.
 *
 * @param inType The type of entity page being shown.
 */
function pageShowHandler(inType) {

  if (!pageVisited[inType]) {

    $.mobile.loading("show");

    // Populate the list.
    populateList(inType);

    // If network connectivity is found to be unavailable at any
    // point then disable new and save capabilities.  Note that this is
    // done here rather than the more reasonable downloadServerData() when
    // the message is shown because we can't guarantee this page has been
    // loaded at that point.
    if (!networkAvailable) {
      $("#" + inType + "NewLink").remove();
      $("#" + inType + "SaveButton").button("disable");
    }

    pageVisited[inType] = true;
    $.mobile.loading("hide");

  }

} // pageShowHandler().


/**
 * Populates the list view for an entity type and optionally filters the list.
 *
 * @param inType        The type of entity to populate.
 * @param inFilterField The field of the entity to filter by, or null if no
 *                      filtering should be applied (show all).
 * @param inFilterValue The value of the filter field to match, or null if no
 *                      filtering should be applied (show all).
 */
function populateList(inType, inFilterField, inFilterValue) {

  // Get reference to listview's UL element and remove existing children.
  var ul = $("#" + inType + "ListUL");
  ul.children().remove();

  // Get items of the appropriate type from localStorage.
  var items = getAllFromLocalStorage(inType);

  // Iterate over those items and create a LI for each and append to the UL,
  // applying filtering, if specified.
  var len = items.length;
  for (var i = 0; i < len; i++) {
    var item = items[i];
    // Apply filtering, if specified.
    if (inFilterField && inFilterValue &&
      item[inFilterField] != inFilterValue
    ) {
      continue;
    }
    // Item not filtered out, so create the LI now.
    var liText = "";
    if (inType == "contact") {
      liText = item.lastName + ", " + item.firstName;
    } else {
      liText = item.title;
    }
    ul.append(
      "<li onClick=\"viewEditItem('" + inType + "', '" + item._id + "');\"" +
      "id=\"" + item._id + "\">" + liText + "</li>"
    );
  }

  // Have to refresh the listview to tell JQM to do it's thing.
  ul.listview("refresh");

} // End populateList().


/**
 * Show an entry view for creating a new item.
 *
 * @param inType The type of entity to create.
 */
function newItem(inType) {

  // Clear entry form and reset updateID.
  updateID = null;
  document.getElementById(inType + "EntryForm").reset();

  // Flip to entry view and ensure menu is closed.
  $("#" + inType + "Entry").show("fast");
  $("#" + inType + "List").hide("fast");
  $("#" + inType + "Menu" ).popup("close");

  // Disable that delete button too!
  $("#" + inType + "DeleteButton").button("disable");

} // End newItem().


/**
 * Select an item for viewing/editing from a list.
 *
 * @param inType The type of entity selected.
 * @param inID   The ID of the entity.
 */
function viewEditItem(inType, inID) {

  // Record the item being viewed/edited.
  updateID = inID;

  // Populate data.
  var itemData = JSON.parse(window.localStorage.getItem(inType + "_" + inID));
  for (fld in itemData) {
    if (fld != "_id" && fld != "__v") {
      $("#" + inType + "EntryForm [name=" + fld + "]").val(itemData[fld]);
    }
  }

  // Flip to entry view and ensure menu is closed.
  $("#" + inType + "Entry").show();
  $("#" + inType + "List").hide();
  $("#" + inType + "Menu" ).popup("close");

  // Enable that delete button too!
  $("#" + inType + "DeleteButton").button("enable");

} // End viewEditItem().


/**
 * Clears ALL data on both the server AND in localStorage.
 */
function clearData() {

  $.mobile.loading("show");
  $.ajax({ url : ajaxURLPrefix + "/clear" })
  .done(function(inResponse) {
    // Now clear localStorage.
    window.localStorage.clear();
    $.mobile.loading("hide");
    $("#infoDialogHeader").html("Operation succeeded");
    $("#infoDialogContent").html("Data cleared");
    $.mobile.changePage($("#infoDialog"), { role : "dialog" });
  })
  .fail(function(inXHR, inStatus) {
    $.mobile.loading("hide");
    $("#infoDialogHeader").html("Operation failed");
    $("#infoDialogContent").html("Data not cleared");
    $.mobile.changePage($("#infoDialog"), { role : "dialog" });
  });

} // End clearData().


/**
 * Checks if a given form field is blank.
 *
 * @param  inID The ID of a form field to check.
 * @return      True if the object is blank, false if not.
 */
function isBlank(inID) {

  var fld = $("#" + inID).val();

  if (fld === null) {
    return true;
  } else if (fld === undefined) {
    return true;
  } else if (fld === "") {
    return true;
  }

  return false;

} // End isBlank().


/**
 * Called to take a picture with the camera for the contact being edited.
 */
function getContactPicture() {

  navigator.camera.getPicture(

    function(inImageData) {
      document.getElementById("contactPicture").src =
        "data:image/jpeg;base64," + inImageData;
    },

    function(inMessage) {
      alert(inMessage);
    },

    { quality : 20,
      destinationType : navigator.camera.DestinationType.DATA_URL }

  );

} // End getContactPicture().


var shake = (function () {
var shake = {},
watchId = null,
options = { frequency: 300 },
previousAcceleration = { x: null, y: null, z: null },
shakeCallBack = null;
// Start watching the accelerometer for a shake gesture
shake.startWatch = function (onShake) {
shakeCallBack = onShake;
watchId = navigator.accelerometer.watchAcceleration(getAccelerationSnapshot, handleError, options);
};
// Stop watching the accelerometer for a shake gesture
shake.stopWatch = function () {
if (watchId !== null) {
navigator.accelerometer.clearWatch(watchId);
watchId = null;
}
};
// Gets the current acceleration snapshot from the last accelerometer watch
function getAccelerationSnapshot() {
navigator.accelerometer.getCurrentAcceleration(assessCurrentAcceleration, handleError);
}
// Assess the current acceleration parameters to determine a shake
function assessCurrentAcceleration(acceleration) {
var accelerationChange = {};
if (previousAcceleration.x !== null) {
accelerationChange.x = Math.abs(previousAcceleration.x, acceleration.x);
accelerationChange.y = Math.abs(previousAcceleration.y, acceleration.y);
accelerationChange.z = Math.abs(previousAcceleration.z, acceleration.z);
}
if (accelerationChange.x + accelerationChange.y + accelerationChange.z > 30) {
// Shake detected
if (typeof (shakeCallBack) === "function") {
shakeCallBack();
}
shake.stopWatch();
setTimeout(shake.startWatch, 1000, shakeCallBack);
previousAcceleration = {
x: null,
y: null,
z: null
}
} else {
previousAcceleration = {
x: acceleration.x,
y: acceleration.y,
z: acceleration.z
}
}
}

// Handle errors here
function handleError() {
  navigator.notification.alert('error', function() { }, '-', "ok");
}
return shake;
})();
