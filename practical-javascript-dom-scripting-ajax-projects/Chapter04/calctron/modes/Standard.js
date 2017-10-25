function Standard() {


  /**
   * Fields inherited from Mode class.
   */
  this.id = "Standard";


  /**
   * The current operation that will be performed when equals is clicked.
   */
  this.currentOperation = "";


  /**
   * Records the last key that was pressed.
   */
  this.lastKeyPressed = "";


  /**
   * Function called every time a key is pressed.  It swaps current and
   * previous result values when applicable, and deald with equal signs and
   * other situations.  In short, the calculator won't work with this!
   */
  this.checkLastPressed = function() {

    if (this.lastKeyPressed == "+" || this.lastKeyPressed == "-" ||
      this.lastKeyPressed == "*" || this.lastKeyPressed == "/") {
      // Time to start entering a new number, but save the current one first.
      this.resultsPrevious = this.resultsCurrent;
      this.resultsPreviousNegated = this.resultsCurrentNegated;
      this.resultsCurrent = "";
      this.resultsCurrentNegated = false;
    }
    // When equals is pressed, it's also time to start a new number, but in
    // that case we clear the previous number too.
    if (this.lastKeyPressed == "=") {
      this.lastKeyPressed = "";
      this.resultsCurrent = "";
      this.resultsCurrentNegated = false;
      this.resultsPrevious = "";
      this.resultsPreviousNegated = false;
      this.currentOperation = "";
    }

  } // End checkLastPressed().


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

    this.checkLastPressed();
    this.lastKeyPressed = "7";
    this.resultsCurrent += "7";
    this.updateResults();

  } // End button0_5().


  /**
   * 8 key.
   */
  this.button0_6 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "8";
    this.resultsCurrent += "8";
    this.updateResults();

  } // End button0_6().


  /**
   * 9 key.
   */
  this.button0_7 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "9";
    this.resultsCurrent += "9";
    this.updateResults();

  } // End button0_7().


  /**
   * 4 key.
   */
  this.button1_5 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "4";
    this.resultsCurrent += "4";
    this.updateResults();

  } // End button1_5().


  /**
   * 5 key.
   */
  this.button1_6 = function() {

    this.checkLastPressed();
    this.lastKeyPressed = "5";
    this.resultsCurrent += "5";
    this.updateResults();

  } // End button1_6().


  /**
   * 6 key.
   */
  this.button1_7 = function() {

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

    this.checkLastPressed();
    this.lastKeyPressed = "1";
    this.resultsCurrent += "2";
    this.updateResults();

  } // End button2_6().


  /**
   * 3 key.
   */
  this.button2_7 = function() {

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
   * Negation key.
   */
  this.button3_6 = function() {

    this.resultsCurrentNegated = !this.resultsCurrentNegated;
    this.updateResults();

  } // End button3_6().


  /**
   * Decimal point key.
   */
  this.button3_7 = function() {

    this.checkLastPressed();
    if (this.resultsCurrent.indexOf(".") == -1) {
      this.lastKeyPressed = ".";
      this.resultsCurrent += ".";
      this.updateResults();
    }

  } // End button3_7().


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
   * Square root key.
   */
  this.button0_9 = function() {

    if (this.resultsCurrent != "") {
      this.resultsCurrent = Math.sqrt(parseFloat(this.resultsCurrent)) + "";
      this.updateResults();
    }

  } // End button0_9().


  /**
   * Percentage key.
   */
  this.button1_9 = function() {

    if (this.resultsCurrent != "" && this.resultsPrevious != "") {
      var a = parseFloat(this.resultsPrevious) / 100;
      var b = a * parseFloat(this.resultsCurrent);
      this.resultsCurrent = b + "";
      this.updateResults();
    }

  } // End button1_9().


  /**
   * Reciprocal key.
   */
  this.button2_9 = function() {

    if (this.resultsCurrent != "") {
      this.resultsCurrent = (1 / parseFloat(this.resultsCurrent)) + "";
      this.updateResults();
    }

  } // End button2_9().


  /**
   * Equals key.
   */
  this.button3_9 = function() {

    if (this.currentOperation) {
      var answer = 0;
      // Negate the current value if the flag says to.
      var resCurrent = parseFloat(this.resultsCurrent);
      if (this.resultsCurrentNegated) {
        resCurrent = resCurent * -1;
      }
      // Negate the previous value if the flag says to.
      var resPrevious = parseFloat(this.resultsPrevious);
      if (isNaN(resPrevious)) {
        resPrevious = resCurrent;
      }
      if (this.resultsPreviousNegated) {
        resPrevious = resPrevious * -1;
      }
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
      // Reset some variables so we're ready for the next operation or input
      // key, and finally, update the results to show the answer.
      this.resultsCurrent = "" + answer;
      this.resultsPrevious = "";
      this.resultsPreviousNegated = false;
      this.currentOperation = null;
      this.lastKeyPressed = "=";
      this.updateResults();
    }

  } // End button3_9().


} // End class.


// Standard inherits from Mode.
Standard.prototype = new Mode();
// Continue the sequence of events after this class is loaded.
calcTron.setMode(new Standard());
