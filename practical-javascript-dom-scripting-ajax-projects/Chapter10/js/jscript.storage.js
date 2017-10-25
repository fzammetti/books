/**
 * jscript.storage package
 *
 * This package contains functions for doing client-side storage, including
 * cookie functions.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.storage = function() { }


/**
 * Sets a cookie.
 *
 * @param inName   The name of the cookie to set.
 * @param inValue  The value of the cookie.
 * @param inExpiry A Date object representing the expiration date of the
 *                 cookie.
 */
jscript.storage.setCookie = function(inName, inValue, inExpiry) {

  if (typeof inExpiry == "Date") {
    inExpiry = inExpiry.toGMTString();
  }
  document.cookie = inName + "=" + escape(inValue) + "; expires=" + inExpiry;

} // End setCookie().


/**
 * Gets thbe value of a specified cookie.  Returns null if cookie isn't found.
 *
 * @param inName The name of the cookie to get the value of.
 */
jscript.storage.getCookie = function(inName) {

  var docCookies = document.cookie;
  var cIndex = docCookies.indexOf(inName + "=");
  if (cIndex == -1) {
    return null;
  }
  cIndex = docCookies.indexOf("=", cIndex) + 1;
  var endStr = docCookies.indexOf(";", cIndex);
  if (endStr == -1) {
    endStr = docCookies.length;
  }
  return unescape(docCookies.substring(cIndex, endStr));

} // End getCookie().


/**
 * Deletes a cookie.
 */
jscript.storage.deleteCookie = function(inName) {

  if (this.getCookie(inName)) {
    this.setCookie(inName, null, "Thu, 01-Jan-1970 00:00:01 GMT");
  }

} // End deleteCookie().
