/**
 * jscript.math package
 *
 * This package contains math-related utility functions.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.math = function() { }


/**
 * This function returns a random integer number within a specified range.
 * If the specified minumum is greated than the maximum, zero is returned.
 *
 * @param  inMin The minimum value of the range, inclusive.
 * @param  inMax The maximum value of the range, inclusive.
 * @return       A random number within the specified range.
 */
jscript.math.genRandomNumber = function(inMin, inMax) {

  if (inMin > inMax) {
    return 0;
  }
  return Math.round(inMin + (inMax - inMin) * Math.random());

} // End genRandomNumber().
