/**
 * jscript.browser package
 *
 * This package contains functions for dealing with the web browser as a whole.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.browser = function() { }


/**
 * This function returns a string containing identification information
 * about the client
 *
 * @return String of browser identification information.
 */
jscript.browser.getBrowserIdentity = function() {

  return navigator.appName + " " + navigator.appVersion;

} // End getBrowserIdentity().
