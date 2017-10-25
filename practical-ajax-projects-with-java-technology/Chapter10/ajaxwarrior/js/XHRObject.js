/**
 * This object contains three variables used to make Ajax requests.  The member
 * variable request is actually the XMLHttpRequest instance.  The callback
 * member is the function that is the callback for the current Ajax request.
 * The json member is the parsed JSON response.
 */
function XHRObject() {

  this.request = null;
  this.callback = null;
  this.json = null;

  /**
   * Function to null our XMLHttpRequest-related vars.
   */
  this.clearXHRVars = function() {

    this.callback = null;
    this.json = null;
    this.request = null;

  } // End clearXHRVars().

} // End XHRObject.
