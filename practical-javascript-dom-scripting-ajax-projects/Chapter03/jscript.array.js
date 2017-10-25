/**
 * jscript.array package
 *
 * This package contains utility functions for working with JavaScript arrays.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.array = function() { }


/**
 * Copies inSrcArray into inDestArray, appending all the values from inSrcArray
 * onto inDestArray.
 *
 * @param inSrcArray  The array to copy FROM.
 * @param inDestArray The array to copy TO.
 * @return            The destination array with the copied elements from the
 *                    source array.
 */
jscript.array.copyArray = function(inSrcArray, inDestArray) {

  var i;
  for (i = 0; i < inSrcArray.length; i++) {
    inDestArray.push(inSrcArray[i]);
  }
  return inDestArray;

} // End copyArray().


/**
 * Finds a specified value in an array and returns its position, or -1 if
 * the value is not found.
 *
 * @param  inArray The array to search.
 * @param  inValue The value to look for.  Note that the value is search for
 *                 EXACTLY, i.e., case matters, as does whitespace.
 * @return         The array position the match is found, or -1 if not found.
 */
jscript.array.findInArray = function(inArray, inValue) {

  var i;
  for (i = 0; i < inArray.length; i++) {
    if (inArray[i] == inValue) {
      return i;
    }
  }
  return -1;

} // End findInArray().


/**
 * Calculates the average of an array of numeric values.  Note that any
 * element in the array that is not numeric will likely fowl things up, and
 * this IS NOT checked for.  It is the caller's responsibility to ensure
 * the array contains only numeric values!
 *
 * @param inArray The array of ONLY numeric values to average.
 */
jscript.array.arrayAverage = function(inArray) {

  var accumulator = 0;
  var i;
  for (i = 0; i < inArray.length; i++) {
    accumulator += inArray[i];
  }
  return accumulator / inArray.length;

} // End arrayAverage().
