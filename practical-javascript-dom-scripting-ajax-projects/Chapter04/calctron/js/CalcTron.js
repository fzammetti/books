function CalcTron() {


  /**
   * The object for the calculator mode (a subclass of Mode) that the
   * calculator is currentlyin.
   */
  this.currentMode = null;


  /**
   * The classloader instance CalcTron will use to load calculator mode classes.
   */
  this.classloader = new Classloader();


  /**
   * The width of the content area of the browser window.
   */
  this.scrWidth = null;


  /**
   * The height of the content area of the browser window.
   */
  this.scrHeight = null;


  /**
   * Initialize CalcTron.
   */
  this.init = function() {

    // Figure out how wide the browser content area is.
    if (window.innerWidth) {
      this.scrWidth = window.innerWidth;
    } else {
      this.scrWidth = document.body.clientWidth;
    }

    // Figure out how high the browser content area is.
    if (window.innerHeight) {
      this.scrHeight = window.innerHeight;
    } else {
      this.scrHeight = document.body.clientHeight;
    }

    // Round the corners of the main content div.
    new Rico.Effect.Round(null, "cssCalculatorOuter");

    // Set initial mode to standard.
    this.setMode("Standard");

  } // End init().


  /**
   * Called to show the mode change popup.
   */
  this.changeModePopup = function() {

    // This is the width and height of the div as it should ultimately appear.
    var divWidth = 150;
    var divHeight = 150;

    // Get reference to mode change div and reset it to begin animation.  It's
    // going to randomly come flying from one of the corners of the screen,
    // so first choose which corner, then set the top and left attributes
    // accordingly.
    var modeDiv = $("divMode");
    modeDiv.style.width = "0px";
    modeDiv.style.height = "0px";

    // What corner does it fly from?
    var whatCorner = jscript.math.genRandomNumber(1, 4)

    // Set the starting coordinates accordingly.
    switch (whatCorner) {
      case 1:
        modeDiv.style.left = "0px";
        modeDiv.style.top = "0px";
      break;
      case 2:
        modeDiv.style.left = this.scrWidth - divWidth;
        modeDiv.style.top = "0px";
      break;
      case 3:
        modeDiv.style.left = "0px";
        modeDiv.style.top = this.scrHeight - divHeight;
      break;
      case 4:
        modeDiv.style.left = this.scrWidth - divWidth;
        modeDiv.style.top = this.scrHeight - divHeight;
      break;
    }

    // Calculate the final left and top position for the div so it's centered
    // in the browser content area.
    var left = (this.scrWidth - divWidth) / 2;
    var top = (this.scrHeight - divHeight) / 2;

    // Show the div so the animation can begin.  Since its width and height are
    // zero, it won't actually be visible just yet.
    $("divMode").style.display = "block";

    // Ask Rico to do the animation for us.
    new Rico.Effect.SizeAndPosition("divMode", left, top, divWidth, divHeight,
      400, 25, null
    );

  } // End changeMode().


  /**
   * Set a particular calculator mode.
   *
   * @param inVal This will be one of two things: a string naming the mode to
   *              switch to, or an instance of a class descending from Mode.
   *              This function branched based o that.
   */
  this.setMode = function(inVal) {

    // First time through: should have been passed a string naming the mode
    // to switch to.  We simply pass it to the classloader to load it for us.
    if (typeof inVal == "string") {

      $("divMode").style.display = "none";
      this.classloader.load(inVal);

    } else {

      // Second time through, inVal is an instance of a class descending from
      // Mode.  In that case, we ask the classloader to verify it for us,
      // and assumimg it's valid, we store a reference to it and ask it to
      // initialize itself.
      if (this.classloader.verify(inVal, new Mode())) {
        this.currentMode = inVal;
        this.currentMode.init();
      } else {
        alert("Not a valid mode class");
      }

    }

  } // End setMode().


} // End CalcTron class.
