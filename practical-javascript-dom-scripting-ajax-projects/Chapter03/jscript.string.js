/**
 * jscript.string package
 *
 * This package contains utility functions for working with strings.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.string = function() { }


/**
 * This function searches a string for another string and returns a count
 * of how many times the second string appears in the first.
 *
 * @param  inStr       The string to be searched.
 * @param  inSearchStr The string to search for.
 * @return             The number of times inSearchStr appears in inStr,
 *                     or 0 if inStr or inSearchStr is null or a blank string.
 */
jscript.string.substrCount = function(inStr, inSearchStr) {

  if (inStr == null || inStr == "" ||
    inSearchStr == null || inSearchStr == "") {
    return 0;
  }
  var splitChars = inStr.split(inSearchStr);
  return splitChars.length - 1;

} // End substrCount().


/**
 * This function will take take an input string and either strip any
 * character that appears in a given list of characters, or will strip any
 * character that does NOT appear in a given list of characters.
 *
 * @param  inStr          The string to strip characters from.
 * @param  inStripOrAllow Either the value "strip" or "allow".
 * @param  inCharList     This is either (a) the list of characters that
 *                        will be stripped from inStr (when inStripOrAllow ==
 *                        "strip"), or (b) the list of characters that will
 *                        NOT be stripped from inStr (when inStripOrAllow ==
                          "allow".
 * @return                The value of inStr after characters have been
 *                        stripped as specified.
 */
jscript.string.stripChars = function(inStr, inStripOrAllow, inCharList) {

  if (inStr == null || inStr == "" ||
    inCharList == null || inCharList == "" ||
    inStripOrAllow == null || inStripOrAllow == "") {
     return "";
  }
  inStripOrAllow = inStripOrAllow.toLowerCase();
  var outStr = "";
  var i;
  var j;
  var nextChar;
  var keepChar;
  for (i = 0; i < inStr.length; i++) {
    nextChar = inStr.substr(i, 1);
    if (inStripOrAllow == "allow") {
      keepChar = false;
    } else {
      keepChar = true;
    }
    for (j = 0; j < inCharList.length; j++) {
      checkChar = inCharList.substr(j, 1);
      if (inStripOrAllow == "allow" && nextChar == checkChar) {
        keepChar = true;
      }
      if (inStripOrAllow == "strip" && nextChar == checkChar) {
        keepChar = false;
      }
    }
    if (keepChar == true) {
      outStr = outStr + nextChar;
    }
  }
  return outStr;

} // End stripChars().


/**
 * This function can check is a given string either only contains characters
 * from a list, or does not contain any characters from a given list.
 *
 * @param  inString    The string to validate.
 * @param  inCharList  A list of characters that is either (a) the only
 *                     characters allowed in inString (when inFromExcept
 *                     is == "from_list") or (b) the only characters that
 *                     cannot appear in inString (when inFromExcept is
 *                     == "not_from_list").
 * @param inFromExcept When this is "from_list", then inString may only
 *                     contain characters from inCharList.  When this is
 *                     "not_from_list", then inString can contain any character
 *                     except thos in inCharList.
 * @return             True if inString only contains valid characters,
 *                     as listed in inCharList when inFromExcept ==
 *                     "from_list", false if not, or true if inString does
 *                     not containt any of the characters listed in
 *                     inCharList when inFromExcept == "not_from_list".
 */
jscript.string.strContentValid = function(inString, inCharList, inFromExcept) {

  if (inString == null || inCharList == null || inFromExcept == null ||
    inString == "" || inCharList == "") {
    return false;
  }
  inFromExcept = inFromExcept.toLowerCase();
  var i;
  if (inFromExcept == "from_list") {
    for (i = 0; i < inString.length; i++) {
      if (inCharList.indexOf(inString.charAt(i)) == -1) {
        return false;
      }
    }
    return true;
  }
  if (inFromExcept == "not_from_list") {
    for (i = 0; i < inString.length; i++) {
      if (inCharList.indexOf(inString.charAt(i)) != -1) {
        return false;
      }
    }
    return true;
  }

} // End strContentValid().


/**
 * This function replaces a given substring of a string (all occurances of
 * it to be more precise) with a specified new substring.  The substrings
 * can of course be single characters.
 *
 * @param  inSrc The string to replace substring(s) in.
 * @param  inOld The substring to replace.
 * @param  inNew The new substring to insert.
 * @return       The value of inSrc with all occurances of inOld replaced
 *               with inNew.
 */
jscript.string.replace = function(inSrc, inOld, inNew) {

  if (inSrc == null || inSrc == "" || inOld == null || inOld == "" ||
    inNew == null || inNew == "") {
    return "";
  }
  while (inSrc.indexOf(inOld) > -1) {
    inSrc = inSrc.replace(inOld, inNew);
  }
  return inSrc;

} // End replace().


/**
 * Function to trim whitespace from the beginning of a string.
 *
 * @param  inStr The string to trim.
 * @return       The trimmed string, or null if null or a blank string was
 *               passed in.
 */
jscript.string.leftTrim = function(inStr) {

  if (inStr == null || inStr == "") {
    return null;
  }
  var j;
  for (j = 0; inStr.charAt(j) == " "; j++) { }
  return inStr.substring(j, inStr.length);

} // End leftTrim().


/**
 * Function to trim whitespace from the end of a string.
 *
 * @param  inStr The string to trim.
 * @return       The trimmed string, or null if null or a blank string was
 *               passed in.
 */
jscript.string.rightTrim = function(inStr) {

  if (inStr == null || inStr == "") {
    return null;
  }
  var j;
  for (j = inStr.length - 1; inStr.charAt(j) == " "; j--) { }
  return inStr.substring(0, j + 1);

} // End rightTrim().


/**
 * Function to trim whitespace from both ends of a string.
 *
 * @param  inStr The string to trim.
 * @return       The trimmed string, or null if null or a blank string was
 *               passed in.
 */
jscript.string.fullTrim = function(inStr) {

  if (inStr == null || inStr == "") {
    return "";
  }
  inStr = this.leftTrim(inStr);
  inStr = this.rightTrim(inStr);
  return inStr;

} // End fullTrim().


/**
 * Breaks a string of text into chunks of a specified size.  It will break
 * on whitespace only, no mid-word breaks.
 *
 * @param  inText The text to break up.
 * @oaram  inSize The size of each chunk.
 * @return        An array containing X number of chunks.
 */
jscript.string.breakLine = function(inText, inSize) {

  if (inText == null || inText == "" || inSize <= 0) {
    return inText;
  }
  if (inText.length <= inSize) {
    return inText;
  }
  var outArray = new Array();
  var str = inText;
  while (str.length > inSize) {
    var x = str.substring(0, inSize);
    var y = x.lastIndexOf(" ");
    var z = x.lastIndexOf("\n");
    if (z != -1) {
      y = z;
    }
    if (y == -1) {
      y = inSize;
    }
    outArray.push(str.substring(0, y));
    str = str.substring(y);
  }
  outArray.push(str);
  return outArray;

} // End breakLine().
