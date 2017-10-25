// Collection object.
function Collection() {
  this.name = null;
  this.createdBy = null;
  this.createdOn = null;
  this.photos = new Array();
  this.currentArrayIndex = null;
}
Collection.prototype.setName = function(inName) {
  this.name = inName;
}
Collection.prototype.getName = function() {
  return this.name;
}
Collection.prototype.setCreatedBy = function(inCreatedBy) {
  this.createdBy = inCreatedBy;
}
Collection.prototype.getCreatedBy = function() {
  return this.createdBy;
}
Collection.prototype.setCreatedOn = function(inCreatedOn) {
  this.createdOn = inCreatedOn;
}
Collection.prototype.getCreatedOn = function() {
  return this.createdOn;
}
Collection.prototype.addPhoto = function(inPhoto) {
  this.photos.push(inPhoto);
}
Collection.prototype.getPhoto = function(inIndex) {
  return this.photos[inIndex];
}
// Function to load the images fom the server for each photo in the collection.
Collection.prototype.loadPhotoImages = function() {
  for (var i = 0; i < this.photos.length; i++) {
    this.photos[i].loadImage();
  }
}
// Method to rotate an array in the "down" direction on the filmstrip.
Collection.prototype.rotateArrayDown = function() {
  var l = this.photos.length - 1;
  var o1 = this.photos[0];
  for (var i = 0; i < l; i++) {
    this.photos[i] = this.photos[i + 1];
  }
  this.photos[l] = o1;
}
// Method to rotate an array in the "up" direction on the filmstrip.
Collection.prototype.rotateArrayUp = function() {
  var l = this.photos.length - 1;
  var o1 = this.photos[l];
  for (var i = l; i > 0; i--) {
    this.photos[i] = this.photos[i - 1];
  }
  this.photos[0] = o1;
}
Collection.prototype.toString = function() {
  return "Collection=[name=" + this.name +
    ",createdBy=" + this.createdBy +
    ",createdOn=" + this.createdOn + ",photos={" + this.photos + "}]";
}
