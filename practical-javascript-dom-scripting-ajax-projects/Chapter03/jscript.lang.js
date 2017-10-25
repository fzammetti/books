/**
 * jscript.lang package
 *
 * This package contains miscellaneous "low-level" functions for dealing with
 * the JavaScript language itself.  For instance, object manipulation
 * functions would be found here.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.lang = function() { }


/**
 * This function copies all properties from a source object to a destination
 * object, optionally overwriting matching existing members.
 *
 * @param  inSrcObj   The object to copy FROM.
 * @param  inDestObj  The object to copy TO.
 * @param  inOverride If true, any member in the destination object that
 *                    already exists will be overwritten.
 * @return            The destination object with members copied from the
 *                    source object,
 */
jscript.lang.copyProperties = function(inSrcObj, inDestObj, inOverride){

  var prop;
  for (prop in inSrcObj) {
    if (inOverride || !inDestObj[prop]) {
      inDestObj[prop] = inSrcObj[prop];
    }
  }
  return inDestObj;

} // End copyProperties().
