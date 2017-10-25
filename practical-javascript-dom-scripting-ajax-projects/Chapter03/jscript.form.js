/**
 * jscript.form package
 *
 * This package contains utility functions for working with HTML forms.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.form = function() { }


/**
 * This function takes an HTML form and constructs an XML document from it,
 * using the specified root element.
 *
 * @param  inForm        A reference ot the HTML form object to serialize.
 * @param  inRootElement The root element the XML dccument should use.
 * @return               A string of XML constructed from serializing the
 *                       specified form.
 */
jscript.form.formToXML = function(inForm, inRootElement) {

  if (inForm == null) {
    return null;
  }
  if (inRootElement == null) {
    return null;
  }
  var outXML = "<" + inRootElement + ">";
  var i;
  for (i = 0; i < inForm.length; i++) {
    var ofe = inForm[i];
    var ofeType = ofe.type.toUpperCase();
    var ofeName = ofe.name;
    var ofeValue = ofe.value;
    if (ofeType == "TEXT" || ofeType == "HIDDEN" ||
      ofeType == "PASSWORD" || ofeType == "SELECT-ONE" ||
      ofeType == "TEXTAREA") {
      outXML += "<" + ofeName + ">" + ofeValue + "</" + ofeName + ">"
    }
    if (ofeType == "RADIO" && ofe.checked == true) {
      outXML += "<" + ofeName + ">" + ofeValue + "</" + ofeName + ">"
    }
    if (ofeType == "CHECKBOX") {
      if (ofe.checked == true) {
        cbval = "true";
      } else {
        cbval = "false";
      }
      outXML = outXML + "<" + ofeName + ">" + cbval + "</" + ofeName + ">"

    }
    outXML += "";
  }
  outXML += "</" + inRootElement + ">";
  return outXML;

} // End formToXML().


/**
 * This function will determine is a select element contains a specified
 * option, and optionally will select it.
 *
 * @param  inSelect          A reference to the select object to search.
 * @param  inValue           The value to search for.
 * @param  inJustFind        True to just determine if the value exists, false
 *                           to also select it.
 * @param  inCaseInsensitive If true, the search will ignore case.  If false
 *                           only an exact case match will be found.
 * @return                   True if an option with the specified value is
 *                           found in the select, false if not.
 */
jscript.form.selectLocateOption = function(inSelect, inValue, inJustFind,
  inCaseInsensitive) {

  if (inSelect == null ||
    inValue == null || inValue == "" ||
    inCaseInsensitive == null ||
    inJustFind == null) {
    return;
  }
  if (inCaseInsensitive) {
    inValue = inValue.toLowerCase();
  }
  var found = false;
  var i;
  for (i = 0; (i < inSelect.length) && !found; i++) {
    var nextVal = inSelect.options[i].value;
    if (inCaseInsensitive) {
      nextVal = nextVal.toLowerCase();
    }
    if (nextVal == inValue) {
      found = true;
      if (!inJustFind) {
        inSelect.options[i].selected = true;
      }
    }
  }
  return found;

} // End selectLocateOption().


/**
 * This function will select all the options in a specified select element.
 *
 * @param inSelect The select element to select all options in.
 */
jscript.form.selectSelectAll = function(inSelect) {

  if (inSelect == null || !inSelect.options || inSelect.options.length == 0) {
    return;
  }
  var i;
  for (i = 0; i < inSelect.options.length; i++) {
    inSelect.options[i].selected = true;
  }

} // End selectSelectAll().


/**
 * This function will unselect all the options in a specified select element.
 *
 * @param inSelect The select element to unselect all options in.
 */
jscript.form.selectUnselectAll = function(inSelect) {

  if (inSelect == null || !inSelect.options || inSelect.options.length == 0) {
    return;
  }
  var i;
  for (i = 0; i < inSelect.options.length; i++) {
    inSelect.options[i].selected = false;
  }

} // End selectUnselectAll().
