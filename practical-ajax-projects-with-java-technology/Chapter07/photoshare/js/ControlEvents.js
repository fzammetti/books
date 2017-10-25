// This function is called when the Actual Size button is clicked.
function setActualSize() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Get the real width and height of the photo.
  var imgInfo = currentCollection.getPhoto(currentArrayIndex);
  var width = imgInfo.getWidth();
  var height = imgInfo.getHeight();
  // Set the photo's size accordingly.
  var o = document.getElementById("imgGrowing");
  o.width = width;
  o.height = height;
  // Also need to update the landing pad to match, and resize the shadows so
  // it is in the right spot.
  o = document.getElementById("landingPad")
  o.style.width = width + "px";
  o.style.height = height + "px";
  setShadowActualSize();
}

// This function is called when the Default Size button is clicked.
function setDefaultSize() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Set the size of the image, landing pad and shadow.
  var o = document.getElementById("imgGrowing");
  o.width = 640;
  o.height = 480;
  o = document.getElementById("landingPad")
  o.style.width = "640px";
  o.style.height = "480px";
  setShadowDefaultSize();
}

// This function is called when the Add Collection button is clicked.
function addCollection() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  window.open("showAddCollection.action", "", "width=340,height=240");
}

// This function is called when the Delete Collection button is clickde.
function deleteCollection() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentCollection == null) {
    alert("Please select a collection first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Get the selected collection and verify deletion.
  var collectionName = parent.fraControl.document.getElementById(
    "collectionsList").value;
  if (confirm("Are you sure you want to delete the collection '"
    + collectionName + "'?")) {
    // Show the please wait floatover.
    showPleaseWait();
    // Make AJAX call.
    dojo.io.bind({
      url: "deleteCollection.action",
      content: {name: collectionName},
      error: function(type, errObj) { alert("AJAX error!"); },
      load: function(type, data, evt) {
        setPicLocations();
        updatePics();
        resetLandingPad();
        setShadowDefaultSize();
        resetVars();
        alert(data);
        hidePleaseWait();
        updateCollectionsList();
      },
      mimetype: "text/plain",
      transport: "XMLHTTPTransport"
    });
  }
}

// This function is called when the Add Photo button is clicked.
function addPhoto() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentCollection == null) {
    alert("Please select a collection first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Open the dialog.
  window.open("showAddPhoto.action", "", "width=620,height=440");
}

// This function is called when the Delete Photo button is clicked.
function deletePhoto() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Get the name of the selected collection, the filename of the current
  // photo, and verify deletion.
  var collectionName = parent.fraControl.document.getElementById(
    "collectionsList").value;
  var photoFilename = currentPhoto.getFilename();
  if (confirm("Are you sure you want to delete the current photo?")) {
    // Show the please wait floatover.
    showPleaseWait();
    // Make AJAX call.
    dojo.io.bind({
      url: "deletePhoto.action",
      content: {collection: collectionName, filename: photoFilename},
      error: function(type, errObj) { alert("AJAX error!"); },
      load: function(type, data, evt) {
        alert(data);
        hidePleaseWait();
        loadCollection();
      },
      mimetype: "text/plain",
      transport: "XMLHTTPTransport"
    });
  }
}

// This function is called when the Collections dropdown selection changes.
function loadCollection() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  // Get name of selected collection.
  var collectionName = parent.fraControl.document.getElementById(
    "collectionsList").value;
  // Ignore the first item, our "dummy" collection.
  if (collectionName == "none") {
    return false;
  }
  // Get rid of the initial text on the landing pad.  We don't need it any more.
  document.getElementById("landingPadText").style.display = "none";
  // Reset everything to initial states, which effectively "closes"
  // the current collection, if any.
  resetVars();
  setPicLocations();
  // Show the please wait floatover.
  showPleaseWait();
  // Make AJAX call.
  dojo.io.bind({
    url: "loadCollection.action",
    content: {collection: collectionName},
    error: function(type, errObj) { alert("AJAX error!"); },
    load: function(type, data, evt) {
      // Now that we have received back the XML describing the collection,
      // we'll use JSDigester to parse it.
      var jsDigester = new JSDigester();
      jsDigester.addObjectCreate("collection", "Collection");
      jsDigester.addSetProperties("collection");
      jsDigester.addObjectCreate("collection/photo", "Photo");
      jsDigester.addSetProperties("collection/photo");
      jsDigester.addBeanPropertySetter("collection/photo",
        "setDescription");
      jsDigester.addSetNext("collection/photo", "addPhoto");
      currentCollection = jsDigester.parse(data);
      // Now the XML has been parsed and we have a populated Collection
      // object to play with.  Now, we'll tell the collection object
      // to go load all the photos.
      currentCollection.loadPhotoImages();
      // And now, update the filmstrip.
      updatePics();
      hidePleaseWait();
    },
    mimetype: "text/plain",
    transport: "XMLHTTPTransport"
  });
}

// This function is called when the Print Photo button is clicked.
function printPhoto() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Open a dialog that is just slightly bigger than the actual size of
  // the photo.
  window.open("printPhoto.action?filename=" + currentPhoto.getFilename(),
    "", "width=" + (20 + parseInt(currentPhoto.getWidth())) + ",height=" +
    (20 + parseInt(currentPhoto.getHeight())));
}

// This function is called with the Download photo button is clicked.
function downloadPhoto() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Call on server, which will result in a download prompt.
  window.location = "downloadPhoto.action?filename=" +
    currentPhoto.getFilename();
}

// This function is called when the Rotate Photo button is clicked.
function rotatePhoto() {
  // If an operation is in progress, usually involving the server, don't do it.
  if (processing) { return false; }
  if (currentPhoto == null) {
    alert("Please select a photo first.");
    return false;
  }
  // If photo happens to be growing, cut it short.
  snapImageToLandingPad();
  // Only allow updates in 90 degree increments clockwise.
  rotationAmount += 90;
  if (rotationAmount == 360) {
    rotationAmount = 0;
  }
  var photoFilename = currentPhoto.getFilename();
  // Show the please wait floatover.
  showPleaseWait();
  // Make AJAX call.
  dojo.io.bind({
    url: "rotatePhoto.action",
    content: {filename: photoFilename, degrees: rotationAmount},
    error: function(type, errObj) { alert("AJAX error!"); },
    load: function(type, data, evt) {
      document.getElementById("imgGrowing").src = null;
      document.getElementById("imgGrowing").src =
        "photos/" + data;
      hidePleaseWait();
    },
    mimetype: "text/plain",
    transport: "XMLHTTPTransport"
  });
}
