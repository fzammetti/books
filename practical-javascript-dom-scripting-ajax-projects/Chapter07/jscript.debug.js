/**
 * jscript.debug package
 *
 * This package contains utility functions for helping debug JavaScript.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. ZAmmetti</a>
 */
if (typeof jscript == 'undefined') {
  jscript = function() { }
}


jscript.debug = function() { }


/**
 * This simple function is one of the handiest: pass it an object, and it
 * will pop an alert() listing all the properties of the object and their
 * values.
 *
 * @param inObj The object to display properties of.
 */
jscript.debug.enumProps = function(inObj) {

  var props = "";
  var i;
  for (i in inObj) {
    props += i + " = " + inObj[i] + "\n";
  }
  alert(props);

} // End enumProps().



/**
 * This is a very simple logger that sends all log messages to an alert()
 * popup.
 */
jscript.debug.AlertLogger = function() {


  /**
   * The following are faux constants that define the various levels a log
   * instance can be set to output.
   */
  this.LEVEL_TRACE = 1;
  this.LEVEL_DEBUG = 2;
  this.LEVEL_INFO  = 3;
  this.LEVEL_WARN  = 4;
  this.LEVEL_ERROR = 5;
  this.LEVEL_FATAL = 6;


  /**
   * logLevel determines the minimum message level the instance will show.
   */
  this.logLevel = 3;


  /**
   * This function is used to set the minimum level a log instance will show.
   *
   * @param inLevel One of the level constants.  Any message at this level
   *                or a higher level will be displayed, others will not.
   */
  this.setLevel = function(inLevel) {

    this.logLevel = inLevel;

  } // End setLevel().


  /**
   * This function is called to determine if a particular message meets or
   * exceeds the current level of the log instance and should therefore be
   * logged.
   *
   * @param inLevel The level of the message being checked.
   */
  this.shouldBeLogged = function(inLevel) {

    if (inLevel >= this.logLevel) {
      return true;
    } else {
      return false;
    }

  } // End shouldBeLogged().


  /**
   * This function logs messages at TRACE level.
   *
   * @param inMessage The message to log.
   */
  this.trace = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_TRACE)) {
      alert("[TRACE] " + inMessage);
    }

  } // End trace().


  /**
   * This function logs messages at DEBUG level.
   *
   * @param inMessage The message to log.
   */
  this.debug = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_DEBUG)) {
      alert("[DEBUG] " + inMessage);
    }

  } // End debug().


  /**
   * This function logs messages at INFO level.
   *
   * @param inMessage The message to log.
   */
  this.info = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_INFO)) {
      alert("[INFO] " + inMessage);
    }

  } // End info().


  /**
   * This function logs messages at WARN level.
   *
   * @param inMessage The message to log.
   */
  this.warn = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_WARN)) {
      alert("[WARN] " + inMessage);
    }

  } // End warn().


  /**
   * This function logs messages at ERROR level.
   *
   * @param inMessage The message to log.
   */
  this.error = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_ERROR)) {
      alert("[ERROR] " + inMessage);
    }

  } // End error().


  /**
   * This function logs messages at FATAL level.
   *
   * @param inMessage The message to log.
   */
  this.fatal = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_FATAL)) {
      alert("[FATAL] " + inMessage);
    }

  } // End fatal().


} // End AlertLogger().


/**
 * This is a very simple logger that sends all log messages to a specified
 * DIV.
 */
jscript.debug.DivLogger = function() {


  /**
   * The following are faux constants that define the various levels a log
   * instance can be set to output.
   */
  this.LEVEL_TRACE = 1;
  this.LEVEL_DEBUG = 2;
  this.LEVEL_INFO  = 3;
  this.LEVEL_WARN  = 4;
  this.LEVEL_ERROR = 5;
  this.LEVEL_FATAL = 6;


  /**
   * These are the font colors for each logging level.
   */
  this.LEVEL_TRACE_COLOR = "a0a000";
  this.LEVEL_DEBUG_COLOR = "64c864";
  this.LEVEL_INFO_COLOR  = "000000";
  this.LEVEL_WARN_COLOR  = "0000ff";
  this.LEVEL_ERROR_COLOR = "ff8c00";
  this.LEVEL_FATAL_COLOR = "ff0000";


  /**
   * logLevel determines the minimum message level the instance will show.
   */
  this.logLevel = 3;


  /**
   * targetDIV is the DIV object to output to.
   */
  this.targetDiv = null;


  /**
   * This function is used to set the minimum level a log instance will show.
   *
   * @param inLevel One of the level constants.  Any message at this level
   *                or a higher level will be displayed, others will not.
   */
  this.setLevel = function(inLevel) {

    this.logLevel = inLevel;

  } // End setLevel().


  /**
   * This function is used to set the target DIV that all messages are
   * written to.  Note that when you call this, the DIV's existing contents
   * are cleared out.
   *
   * @param inDiv The DIV object that all messages are written to.
   */
  this.setTargetDiv = function(inTargetDiv) {

    this.targetDiv = inTargetDiv;
    this.targetDiv.innerHTML = "";

  } // End setTargetDiv().


  /**
   * This function is called to determine if a particular message meets or
   * exceeds the current level of the log instance and should therefore be
   * logged.
   *
   * @param inLevel The level of the message being checked.
   */
  this.shouldBeLogged = function(inLevel) {

    if (inLevel >= this.logLevel) {
      return true;
    } else {
      return false;
    }

  } // End shouldBeLogged().


  /**
   * This function logs messages at TRACE level.
   *
   * @param inMessage The message to log.
   */
  this.trace = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_TRACE) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_TRACE_COLOR + ";'>" +
      "[TRACE] " + inMessage + "</div>";
    }

  } // End trace().


  /**
   * This function logs messages at DEBUG level.
   *
   * @param inMessage The message to log.
   */
  this.debug = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_DEBUG) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_DEBUG_COLOR + ";'>" +
      "[DEBUG] " + inMessage + "</div>";
    }

  } // End debug().


  /**
   * This function logs messages at INFO level.
   *
   * @param inMessage The message to log.
   */
  this.info = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_INFO) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_INFO_COLOR + ";'>" +
      "[INFO] " + inMessage + "</div>";
    }

  } // End info().


  /**
   * This function logs messages at WARN level.
   *
   * @param inMessage The message to log.
   */
  this.warn = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_WARN) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_WARN_COLOR + ";'>" +
      "[WARN] " + inMessage + "</div>";
    }

  } // End warn().


  /**
   * This function logs messages at ERROR level.
   *
   * @param inMessage The message to log.
   */
  this.error = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_ERROR) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_ERROR_COLOR + ";'>" +
      "[ERROR] " + inMessage + "</div>";
    }

  } // End error().


  /**
   * This function logs messages at FATAL level.
   *
   * @param inMessage The message to log.
   */
  this.fatal = function(inMessage) {

    if (this.shouldBeLogged(this.LEVEL_FATAL) && this.targetDiv) {
      this.targetDiv.innerHTML +=
      "<div style='color:#" + this.LEVEL_FATAL_COLOR + ";'>" +
      "[FATAL] " + inMessage + "</div>";
    }

  } // End fatal().


} // End DivLogger().
