// Photo object.
function Photo() {
  this.type = null;
  this.addedBy = null;
  this.addedOn = null;
  this.fileSize = null;
  this.dimensions = null;
  this.width = null;
  this.height = null;
  this.dpi = null;
  this.filename = null;
  this.colorDepth = null;
  this.description = null;
  this.image = null;
}
Photo.prototype.setType = function(inType) {
  this.type = inType;
}
Photo.prototype.getType = function() {
  return this.type;
}
Photo.prototype.setAddedBy = function(inAddedBy) {
  this.addedBy = inAddedBy;
}
Photo.prototype.getAddedBy = function() {
  return this.addedBy;
}
Photo.prototype.setAddedOn = function(inAddedOn) {
  this.addedOn = inAddedOn;
}
Photo.prototype.getAddedOn = function() {
  return this.addedOn;
}
Photo.prototype.setFileSize = function(inFileSize) {
  this.fileSize = inFileSize;
}
Photo.prototype.getFileSize = function() {
  return this.fileSize;
}
// Set the dimensions of the photo.  Expects the argument to be in the form
// widthxheight.
Photo.prototype.setDimensions = function(inDimensions) {
  this.dimensions = inDimensions;
  var a = inDimensions.split("x");
  this.width = a[0];
  this.height = a[1];
}
Photo.prototype.getDimensions = function() {
  return this.dimensions;
}
Photo.prototype.getWidth = function() {
  return this.width;
}
Photo.prototype.getHeight = function() {
  return this.height;
}
Photo.prototype.setDpi = function(inDpi) {
  this.dpi = inDpi;
}
Photo.prototype.getDpi = function() {
  return this.dpi;
}
Photo.prototype.setFilename = function(inFilename) {
  this.filename = inFilename;
}
Photo.prototype.getFilename = function() {
  return this.filename;
}
Photo.prototype.setColorDepth = function(inColorDepth) {
  this.colorDepth = inColorDepth;
}
Photo.prototype.getColorDepth = function() {
  return this.colorDepth;
}
Photo.prototype.setDescription = function(inDescription) {
  this.description = inDescription;
}
Photo.prototype.getDescription = function() {
  return this.description;
}
// Loads the image from the server corresponding to this photo.
Photo.prototype.loadImage = function() {
  this.image = new Image();
  this.image.src = "photos/" + this.filename;
}
Photo.prototype.getImage = function() {
  return this.image;
}
Photo.prototype.toString = function() {
  return "Photo=[type=" + this.type + ",addedBy=" + this.addedBy +
    ",addedOn=" + this.addedOn + ",fileSize=" + this.fileSize +
    ",dimensions=" + this.dimensions + ",dpi=" + this.dpi +
    ",filename=" + this.filename + ",colorDepth=" + this.colorDepth +
    "]";
}
