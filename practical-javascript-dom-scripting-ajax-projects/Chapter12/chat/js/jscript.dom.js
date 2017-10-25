/**
 * jscript.dom package
 *
 * This package contains functions for accessing and manipulating the DOM.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.dom = function() { }


/**
 * Center a given layer on the screen horizontally.
 *
 * @param inObj A reference to the element (presumably a layer) to center.
 */
jscript.dom.layerCenterH = function(inObj) {

  var lca;
  var lcb;
  var lcx;
  var iebody;
  var dsocleft;
  if (window.innerWidth) {
    lca = window.innerWidth;
  } else {
    lca = document.body.clientWidth;
  }
  lcb = inObj.offsetWidth;
  lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
  inObj.style.left = lcx + dsocleft + "px";

} // End layerCenterH().


/**
 * Center a given layer on the screen vertically.
 *
 * @param inObj A reference to the element (presumably a layer) to center.
 */
jscript.dom.layerCenterV = function(inObj) {

  var lca;
  var lcb;
  var lcy;
  var iebody;
  var dsoctop;
  if (window.innerHeight) {
    lca = window.innerHeight;
  } else {
    lca = document.body.clientHeight;
  }
  lcb = inObj.offsetHeight;
  lcy = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  dsoctop = document.all ? iebody.scrollTop : window.pageYOffset;
  inObj.style.top = lcy + dsoctop + "px";

} // End layerCenterV().


/**
 * This function is used to execute all the script blocks found in a
 * chunk of text.  This is typically used to execute the scripts found in
 * an AJAX response.
 *
 * @param inText The text to parse scripts from to execute.
 */
jscript.dom.execScripts = function (inText) {

  var si = 0;
  while (true) {
    // Finding opening script tag.
    var ss = inText.indexOf("<" + "script" + ">", si);
    if (ss == -1) {
      return;
    }
    // Find closing script tag.
    var se = inText.indexOf("<" + "/" + "script" + ">", ss);
    if (se == -1) {
      return;
    }
    // Jump ahead 9 characters, after the closing script tag.
    si = se + 9;
    // Get the content in between and execute it.
    var sc = inText.substring(ss + 8, se);
    eval(sc);
  }

} // End execScripts().


/**
 * This function accepts one or more DOM IDs and returns an array which
 * contains a reference to all of them.  If no arguments are passed in,
 * null is returned.  If a single ID is passed in, a single element is
 * returned.  If more than one ID is passed in, an array is passed back.
 *
 * @param  ?? A variable number of arguments, each being a DOM ID to get a
 *            reference to (or a single ID).
 * @return    Null is no arguments passed in, or a reference to a single
 *            DOM element if one ID passed in, or an array of references to
 *            DOM elements if multiple IDs passed in.
 */
jscript.dom.getDOMElements = function() {

  if (arguments.length == 0) {
    return null;
  }
  if (arguments.length == 1) {
    return document.getElementById(arguments[0]);
  }
  var elems = new Array();
  for (var i = 0; i < arguments.length; i++) {
    elems.push(document.getElementById(arguments[i]));
  }
  return elems;

} // End getDOMElements().
