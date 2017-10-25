// This class represents an Actor in a Movie.
function Actor() {
  this.gender = null;
  this.name = null;
}
Actor.prototype.setGender = function(inGender) {
  this.gender = inGender;
}
Actor.prototype.getGender = function() {
  return this.gender;
}
Actor.prototype.setName = function(inName) {
  this.name = inName;
}
Actor.prototype.getName = function() {
  return this.name;
}
Actor.prototype.toString = function() {
  return "Actor=[name=" + this.name + ",gender=" + this.gender + "]";
}


// This class represents a Movie.
function Movie() {
  this.title = null;
  this.actors = new Array();
}
Movie.prototype.setTitle = function(inTitle) {
  this.title = inTitle;
}
Movie.prototype.getTitle = function() {
  return this.title;
}
Movie.prototype.addActor = function(inActor) {
  this.actors.push(inActor);
}
Movie.prototype.getActors = function() {
  return this.actors;
}
Movie.prototype.toString = function() {
  return "Movie=[title=" + this.title + ",actors={" + this.actors + "}]";
}


// This class stores a collection of Movies.
function Movies() {
  this.movieList = new Array();
  this.numMovies = null;
}
Movies.prototype.setNumMovies = function(inNumMovies) {
  this.numMovies = inNumMovies;
}
Movies.prototype.getNumMovies = function() {
  return this.numMovies;
}
Movies.prototype.addMovie = function(inMovie) {
  this.movieList.push(inMovie);
}
Movies.prototype.getMovieList = function() {
  return this.movieList;
}
Movies.prototype.toString = function() {
  return "Movies=[numMovies=" + this.numMovies + ",movieList={" +
  this.movieList + "}]";
}