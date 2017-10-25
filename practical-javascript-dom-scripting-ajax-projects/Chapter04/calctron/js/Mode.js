function Mode() {


  /**
   * The ID of the calculator mode.
   */
  this.id = null;


  /**
   * The value currently displayed (and being edited by the user).
   */
  this.resultsCurrent = "";


  /**
   * The last value entered by the user.
   */
  this.resultsPrevious = "";


  /**
   * Flag: Is the current value negative?
   */
  this.resultsCurrentNegated = false;


  /**
   * Flag: Is the previous value negative?
   */
  this.resultsPreviousNegated = false;


  /**
   * Called to initialize the mode, set up the screen, etc.
   *
   * @param inVal The first time this is called, inVal will not be passed,
   *              and hence the JSON for the mode will be loaded.  The second
   *              time through, inVal will be the evaluated JSON for the mode.
   */
  this.init = function(inVal) {

    if (inVal) {

      var mainDiv = $("mainContainer");

      // Size width and height as specified.
      mainDiv.style.width = inVal.mainWidth + "px";
      mainDiv.style.height = inVal.mainHeight + "px";

      // Center the main content div in the browser content area.
      mainDiv.style.left = (calcTron.scrWidth - parseInt(inVal.mainWidth)) / 2;
      mainDiv.style.top = (calcTron.scrHeight - parseInt(inVal.mainHeight)) / 2;

      // Command buttons (10 of them, numbered 0-8).
      for (var i = 0; i < 9; i++) {
        var btn = $("commandButton" + i);
        if (inVal.commandButtons[i].enabled == "true") {
          btn.style.display = "block";
          btn.value = inVal.commandButtons[i].caption;
        } else {
          btn.style.display = "none";
        }
      }

      // Buttons (50 of them, 10 in a row numbered 0-9 in 5 rows numbered 0-4).
      for (var y = 0; y < 5; y++) {
        for (var x = 0; x < 10; x++) {
          btn = $("button" + y + "_" + x);
          if (inVal.buttons[y][x].enabled == "true") {
            btn.style.display = "block";
            btn.value = inVal.buttons[y][x].caption;
          } else {
            btn.style.display = "none";
          }
        }
      }

    } else {

      this.loadJSON(this.id);

    }

    // Show current mode in info box and clear results div.
    this.updateResults("");
    this.updateInfo(this.id + " Mode");

  } // End init().


  /**
   * Called to load the JSON definition file for the specified mode.  Done
   * using a dynamic script tag.
   *
   * @param inID The ID of the calcualtor mode to load JSON for.
   */
  this.loadJSON = function(inID) {

    var scriptTag = document.createElement("script");
    scriptTag.src = "modes/" + this.id + ".json";
    var headTag = document.getElementsByTagName("head").item(0);
    headTag.appendChild(scriptTag);

  } // End loadJSON().


  /**
   * This function updates the results display from the current value.
   */
  this.updateResults = function() {

    var results = this.resultsCurrent;
    if (this.resultsCurrentNegated) {
      results = "-" + results;
    }
    $("divResults").innerHTML = results;

  } // End updateResults().


  /**
   * This function updates the info display bar.
   */
  this.updateInfo = function(inInfo) {

    $("divInfo").innerHTML = inInfo;

  } // End updateInfo().


  /**
   * Methods for the command buttons.
   */
  this.commandButton0 = function() { }
  this.commandButton1 = function() { }
  this.commandButton2 = function() { }
  this.commandButton3 = function() { }
  this.commandButton4 = function() { }
  this.commandButton5 = function() { }
  this.commandButton6 = function() { }
  this.commandButton7 = function() { }
  this.commandButton8 = function() { }


  /**
   * Methods for the buttons.
   */
  this.button0_0 = function() { }
  this.button0_1 = function() { }
  this.button0_2 = function() { }
  this.button0_3 = function() { }
  this.button0_4 = function() { }
  this.button0_5 = function() { }
  this.button0_6 = function() { }
  this.button0_7 = function() { }
  this.button0_8 = function() { }
  this.button0_9 = function() { }

  this.button1_0 = function() { }
  this.button1_1 = function() { }
  this.button1_2 = function() { }
  this.button1_3 = function() { }
  this.button1_4 = function() { }
  this.button1_5 = function() { }
  this.button1_6 = function() { }
  this.button1_7 = function() { }
  this.button1_8 = function() { }
  this.button1_9 = function() { }

  this.button2_0 = function() { }
  this.button2_1 = function() { }
  this.button2_2 = function() { }
  this.button2_3 = function() { }
  this.button2_4 = function() { }
  this.button2_5 = function() { }
  this.button2_6 = function() { }
  this.button2_7 = function() { }
  this.button2_8 = function() { }
  this.button2_9 = function() { }

  this.button3_0 = function() { }
  this.button3_1 = function() { }
  this.button3_2 = function() { }
  this.button3_3 = function() { }
  this.button3_4 = function() { }
  this.button3_5 = function() { }
  this.button3_6 = function() { }
  this.button3_7 = function() { }
  this.button3_8 = function() { }
  this.button3_9 = function() { }

  this.button4_0 = function() { }
  this.button4_1 = function() { }
  this.button4_2 = function() { }
  this.button4_3 = function() { }
  this.button4_4 = function() { }
  this.button4_5 = function() { }
  this.button4_6 = function() { }
  this.button4_7 = function() { }
  this.button4_8 = function() { }
  this.button4_9 = function() { }


} // End class.
