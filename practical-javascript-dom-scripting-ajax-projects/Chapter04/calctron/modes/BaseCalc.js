function BaseCalc() {


  /**
   * Fields inherited from Mode class.
   */
  this.id = "BaseCalc";


  /**
   * The current operation that will be performed when equals is clicked.
   */
  this.currentOperation = "";


  /**
   * Records the last key that was pressed.
   */
  this.lastKeyPressed = "";


  /**
   * What number base is the current value displayed in?
   */
  this.currentBase = "dec";


  /**
   * An array of values used during base conversions.
   */
  this.baseArray = new Array();


  /**
   * Initialize this calculator mode.
   *
   * @param inVal The first time this is called, inVal will not be passed,
   *              and hence the JSON for the mode will be loaded.  The second
   *              time through, inVal will be the evaluated JSON for the mode.
   */
  this.init = function(inVal) {

    if (inVal) {

      // Initialize array for base conversions.
      this.baseArray[1] = "0";
      this.baseArray[2] = "1";
      this.baseArray[3] = "2";
      this.baseArray[4] = "3";
      this.baseArray[5] = "4";
      this.baseArray[6] = "5";
      this.baseArray[7] = "6";
      this.baseArray[8] = "7";
      this.baseArray[9] = "8";
      this.baseArray[10] = "9";
      this.baseArray[11] = "A";
      this.baseArray[12] = "B";
      this.baseArray[13] = "C";
      this.baseArray[14] = "D";
      this.baseArray[15] = "E";
      this.baseArray[16] = "F";

      // Call superclass constructor.  Note that this only works if the
      // method of the superclass does not reference anything specific to the
      // subclass... see the notes about the id field on the next statement!
      BaseCalc.prototype.init(inVal);

      // Note that the call to init() of the superclass will result in the
      // information bar saying "null Mode" because the this reference points
      // to the instance of Mode that is the prototype for this BaseCalc
      // instance.  So, we need to set it here using the id field of this
      // instance so what's in the info bar is correct.
      this.updateInfo(this.id + " Mode");

    } else {

      // Load the JSON for this tab.
      this.loadJSON(this.id);

    }

  } // End init().


  /**
   * Function called every time a key is pressed.  It swaps current and
   * previous result values when applicable, and deald with equal signs and
   * other situations.  In short, the calculator won't work with this!
   */
  this.checkLastPressed = function() {

    if (this.lastKeyPressed == "+" || this.lastKeyPressed == "-" ||
      this.lastKeyPressed == "*" || this.lastKeyPressed == "/") {
      // Always store previous result as a decimal, since calculations will
      // always be done in decimal, and so this will be one less conversion to
      // do at calculation time.
      this.convert("dec");
      // Time to start entering a new number, but save the current one first.
      this.resultsPrevious = this.resultsCurrent;
      this.resultsCurrent = "";
    }
    // When equals is pressed, it's also time to start a new number, but in
    // that case we clear the previous number too.
    if (this.lastKeyPressed == "=") {
      this.lastKeyPressed = "";
      this.resultsCurrent = "";
      this.resultsPrevious = "";
      this.currentOperation = "";
    }

  } // End checkLastPressed().


  /**
  * Hexadecimal command button.
  */
  this.commandButton1 = function() {

    this.updateInfo("Hexadecimal");
    if (this.resultsCurrent != "") {
      this.convert("hex");
      this.updateResults();
    }
    this.currentBase = "hex";

  } // End commandButton1().


  /**
  * Decimal command button.
  */
  this.commandButton2 = function() {

    this.updateInfo("Decimal");
    if (this.resultsCurrent != "") {
      this.convert("dec");
      this.updateResults();
    }
    this.currentBase = "dec";

  } // End commandButton2().


  /**
  * Octal command button.
  */
  this.commandButton6 = function() {

    this.updateInfo("Octal");
    if (this.resultsCurrent != "") {
      this.convert("oct");
      this.updateResults();
    }
    this.currentBase = "oct";

  } // End commandButton6().


  /**
  * Binary command button.
  */
  this.commandButton7 = function() {

    this.updateInfo("Binary");
    if (this.resultsCurrent != "") {
      this.convert("bin");
      this.updateResults();
    }
    this.currentBase = "bin";

  } // End commandButton7().


  /**
  * Backspace command button.
  */
  this.commandButton3 = function() {

    if (this.resultsCurrent != "") {
      this.resultsCurrent =
        this.resultsCurrent.substr(0, this.resultsCurrent.length - 1);
      this.updateResults();
    }

  } // End commandButton3().


  /**
  * Clear command button.
  */
  this.commandButton4 = function() {

    this.resultsCurrent = "";
    this.updateResults();

  } // End commandButton4().


  /**
   * 7 key.
   */
  this.button0_5 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "7";
    this.resultsCurrent += "7";
    this.updateResults();

  } // End button0_5().


  /**
   * 8 key.
   */
  this.button0_6 = function() {

    if (this.currentBase == "bin" || this.currentBase == "oct") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "8";
    this.resultsCurrent += "8";
    this.updateResults();

  } // End button0_6().


  /**
   * 9 key.
   */
  this.button0_7 = function() {

    if (this.currentBase == "bin" || this.currentBase == "oct") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "9";
    this.resultsCurrent += "9";
    this.updateResults();

  } // End button0_7().


  /**
   * 4 key.
   */
  this.button1_5 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "4";
    this.resultsCurrent += "4";
    this.updateResults();

  } // End button1_5().


  /**
   * 5 key.
   */
  this.button1_6 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "5";
    this.resultsCurrent += "5";
    this.updateResults();

  } // End button1_6().


  /**
   * 6 key.
   */
  this.button1_7 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "6";
    this.resultsCurrent += "6";
    this.updateResults();

  } // End button1_7().


  /**
   * 1 key.
   */
  this.button2_5 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "1";
    this.resultsCurrent += "1";
    this.updateResults();

  } // End button2_5().


  /**
   * 2 key.
   */
  this.button2_6 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "1";
    this.resultsCurrent += "2";
    this.updateResults();

  } // End button2_6().


  /**
   * 3 key.
   */
  this.button2_7 = function() {

    if (this.currentBase == "bin") {
      return;
    }
    this.checkLastPressed();
    this.lastKeyPressed = "3";
    this.resultsCurrent += "3";
    this.updateResults();

  } // End button2_7().


  /**
   * 0 key.
   */
  this.button3_5 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "0";
    this.resultsCurrent += "0";
    this.updateResults();

  } // End button3_5().


  /**
   * Division key.
   */
  this.button0_8 = function() {

    this.currentOperation = "/";
    this.lastKeyPressed = "/";

  } // End button0_8().


  /**
   * Multiplication key.
   */
  this.button1_8 = function() {

    this.currentOperation = "*";
    this.lastKeyPressed = "*";

  } // End button1_8().


  /**
   * Subtraction key.
   */
  this.button2_8 = function() {

    this.currentOperation = "-";
    this.lastKeyPressed = "-";

  } // End button2_8().


  /**
   * Addition key.
   */
  this.button3_8 = function() {

    this.currentOperation = "+";
    this.lastKeyPressed = "+";

  } // End button3_8().


  /**
   * A key.
   */
  this.button4_4 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "A";
      this.resultsCurrent += "A";
      this.updateResults();
    }

  } // End button4_4().


  /**
   * B key.
   */
  this.button4_5 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "B";
      this.resultsCurrent += "B";
      this.updateResults();
    }

  } // End button4_5().


  /**
   * C key.
   */
  this.button4_6 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "C";
      this.resultsCurrent += "C";
      this.updateResults();
    }

  } // End button4_6().


  /**
   * D key.
   */
  this.button4_7 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "D";
      this.resultsCurrent += "D";
      this.updateResults();
    }

  } // End button4_7().


  /**
   * E key.
   */
  this.button4_8 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "E";
      this.resultsCurrent += "E";
      this.updateResults();
    }

  } // End button4_8().


  /**
   * F key.
   */
  this.button4_9 = function() {

    if (this.currentBase == "hex") {
      this.checkLastPressed();
      this.lastKeyPressed = "F";
      this.resultsCurrent += "F";
      this.updateResults();
    }

  } // End button4_9().


  /**
   * Equals key.
   */
  this.button3_9 = function() {

    if (this.currentOperation) {
      var answer = 0;
      // First, convert the current value to decimal.  Since the previous value
      // was converted when it was set, both values are now in decimal.
      this.convert("dec");
      var resCurrent = parseFloat(this.resultsCurrent);
      var resPrevious = parseFloat(this.resultsPrevious);
      // Now perform the current operation.
      switch(this.currentOperation) {
        case "+":
          answer = resPrevious + resCurrent;
        break;
        case "-":
          answer = resPrevious - resCurrent;
        break;
        case "*":
          answer = resPrevious * resCurrent;
        break;
        case "/":
          answer = resPrevious / resCurrent;
        break;
      }
      this.resultsCurrent = "" + answer;
      // Next, convert the new current value to the current base.  Before we
      // can do that though, we need to set the current base to decimal to
      // match the answer we have.
      var storedCurrentBase = this.currentBase;
      this.currentBase = "dec";
      this.convert(storedCurrentBase);
      this.currentBase = storedCurrentBase;
      // Reset some variables so we're ready for the next operation or input
      // key, and finally, update the results to show the answer.
      this.resultsPrevious = "";
      this.currentOperation = null;
      this.lastKeyPressed = "=";
      this.updateResults();
    }

  } // End button3_9().


  /**
   * Convert the current value to the newly selected base.
   *
   * @param inNewBase The base to convert the value to.
   */
  this.convert = function(inNewBase) {

    var currentValue = null;
    switch (this.currentBase) {
      case "dec":
        currentValue = parseInt(this.resultsCurrent, 10);
      break;
      case "hex":
        currentValue = parseInt(this.resultsCurrent, 16);
      break;
      case "oct":
        currentValue = parseInt(this.resultsCurrent, 8);
      break;
      case "bin":
        currentValue = parseInt(this.resultsCurrent, 2);
      break;
    }
    switch (inNewBase) {
      case "dec":
        currentValue = this.convertToBase(currentValue, 10);
      break;
      case "hex":
        currentValue = this.convertToBase(currentValue, 16);
      break;
      case "oct":
        currentValue = this.convertToBase(currentValue, 8);
      break;
      case "bin":
        currentValue = this.convertToBase(currentValue, 2);
      break;
    }
    this.resultsCurrent = "" + currentValue;

  } // End convert().


  /**
   * This function converts a number in decimal to another base.
   *
   * @param  inNumber  The number to convert.
   * @param  inNewBase The new base to convert the number to.
   * @return           The number in the specified base.
   */
  this.convertToBase = function (inNumber, inNewBase) {

    var str = "";
    var calc = inNumber;
    while (calc >= inNewBase) {
      var divVal = calc % inNewBase;
      calc = Math.floor(calc / inNewBase);
      str += this.baseArray[divVal + 1];
    }
    str += this.baseArray[calc + 1];
    var len = str.length;
    var fnl = "";
    for (var j = 0; j < len; j++) {
      var a = (len - j) - 1;
      var b = len - j;
      fnl += str.substring(a, b);
    }
    return fnl;

  } // End convertToBase().


} // End class.


// BaseCalc inherits from Mode.
BaseCalc.prototype = new Mode();
// Continue the sequence of events after this class is loaded.
calcTron.setMode(new BaseCalc());
