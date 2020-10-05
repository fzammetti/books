/**
 * app.
 */
const app = {


  // Reference to the "My Work" nav bar.
  myWork : null,

  // Reference to the "My Hobbies" nav bar.
  myHobbies : null,

  // Reference to the "My Family" nav bar.
  myFamily : null,

  // Reference to the "Contact Me" nav bar.
  contactMe : null,

  // The current pixel value of a sliding nav bar.
  slideVal : null,

  // The interval running for a sliding nav bar.
  slideInterval : null,

  // The name of the currently sliding nav bar.
  slideWhich : null,

  // How many ticks have occurred for a sliding nav bar.
  slideTicks : null,

  // Records when the first mouse move event within a nav bar boundary occurs.
  firstMouseEventDone : false,


  /**
   * Called onLoad to start the app up.
   */
  start : function() {

    // Create nav bars.
    app.myWork = app.createNavBar("myWork");
    app.myHobbies = app.createNavBar("myHobbies");
    app.myFamily = app.createNavBar("myFamily");
    app.contactMe = app.createNavBar("contactMe");

    // Hook up event handlers for mouse movement and window resize events.
    document.onmousemove = app.mouseMoveHandler;
    window.onresize = app.resizeHandler;

    // Do initial "resize" to position nav bars.
    app.resizeHandler();

  }, /* End start(). */


  /**
   * Create a nav bar.
   *
   * @inWhich             The name of the bar (one of "myWork", "myHobbies", "myFamily" or "contactMe").
   * @return  HTMLElement A reference to the nav bar.
   */
  createNavBar : function(inWhich) {

    // When this function is called, we check to see what the current page is.  If the nav bar being requested to be
    // created is the one for the current page, then we'll instead make this nav bar be for the home page.
    let whichLink = inWhich;
    if (inWhich === app.currentPage) {
      inWhich = "index";
    }

    // Construct link element.
    const navBarOuter = document.createElement("a");
    navBarOuter.setAttribute("href", `${inWhich}.html`);

    // Construct div inside the link.
    const navBarInner = document.createElement("div");
    navBarInner.setAttribute("id", inWhich);
    navBarInner.setAttribute("class", `navBar ${whichLink}`);
    navBarInner.innerHTML =
      { contactMe : "Get In Touch With Me",
        myHobbies : "My Hobbies",
        myFamily : "My Family Life",
        myWork : "My Work Life",
        index : "Home Page"
      }[inWhich];
    navBarOuter.appendChild(navBarInner);
    document.body.appendChild(navBarOuter);

    // Return reference to nav bar.
    return document.getElementById(inWhich);

  }, /* End createNavBar(). */


  /**
   * Handle window resize events.
   */
  resizeHandler : function() {

    app.myWork.style.top = "-40px";
    app.myHobbies.style.left = `${window.innerWidth}px`;
    app.myFamily.style.left = "-40px";
    app.contactMe.style.top = `${window.innerHeight}4px`;

  }, /* End resizeHandler(). */


  /**
   * Handle mouse move events on the page.
   *
   * @param inEvent An event object.
   */
  mouseMoveHandler : function(inEvent) {

    // We don't want to register any mouse move events until one occurs outside the boundary of all the nav bars.
    // This addresses the case where the user clicks and bar and doesn't move the mouse, so that the nav bar
    // isn't active on the next page immediately until they move the mouse far enough away from the nav bar.
    if (!app.firstMouseEventDone) {
      if (inEvent.x > 80 && inEvent.x < (window.innerWidth - 80) && inEvent.y > 80 &&
        inEvent.y < (window.innerHeight - 80)
      ) {
        app.firstMouseEventDone = true;
      } else {
        return;
      }
    }

    // Trigger top nav bar.
    if (inEvent.y < 80) {
      if (app.slideWhich !== "myWork") {
        app.slideIn("myWork");
      }
    // Trigger left nav bar.
    } else if (inEvent.x > (window.innerWidth - 80)) {
      if (app.slideWhich !== "myHobbies") {
        app.slideIn("myHobbies");
      }
    // Trigger right nav bar.
    } else if (inEvent.x < 80) {
      if (app.slideWhich !== "myFamily") {
        app.slideIn("myFamily");
      }
    // Trigger bottom nav bar.
    } else if (inEvent.y > (window.innerHeight - 80)) {
      if (app.slideWhich !== "contactMe") {
        app.slideIn("contactMe");
      }
    // Not in a nav bar, so make sure noting is sliding and all nav bars are hidden.
    } else {
      if (!app.slideInterval) {
        clearInterval(app.slideInterval);
        app.slideInterval = null;
      }
      app.slideWhich = null;
      app.resizeHandler();
    }

  }, /* End mouseMoveHandler(). */


  /**
   * Slide a nav bar into view.
   *
   * @param inWhich The name of the bar (one of "myWork", "myHobbies", "myFamily" or "contactMe").
   */
  slideIn : function(inWhich) {

    // If a slide is currently in progress, stop it.
    if (app.slideInterval) {
      clearInterval(app.slideInterval);
      app.slideInterval = null;
    }

    // Reset all positions before beginning the new slide.
    app.resizeHandler();

    // Reset values to prepare for a new slide.
    app.slideWhich = inWhich;
    app.slideVal = 0;
    app.slideTicks = 0;

    // Set starting position according to which bar is sliding in.
    switch (app.slideWhich) {
      case "myWork": app.slideVal = -40; break;
      case "myHobbies": app.slideVal = window.innerWidth; break;
      case "myFamily": app.slideVal = -40; break;
      case "contactMe": app.slideVal = window.innerHeight; break;
    }

    // Kick off an interval to do slide.
    app.slideInterval = setInterval(function() {
      switch (app.slideWhich) {
        case "myWork":
          app.myWork.style.top = `${app.slideVal}px`;
          app.slideVal++;
        break;
        case "myHobbies":
          app.myHobbies.style.left = `${app.slideVal}px`;
          app.slideVal--;
        break;
        case "myFamily":
          app.myFamily.style.left = `${app.slideVal}px`;
          app.slideVal++;
        break;
        case "contactMe":
          app.contactMe.style.top = `${app.slideVal}px`;
          app.slideVal--;
        break;
      }
      app.slideTicks++;
      // Stop the slide when it's time.
      if (app.slideTicks === 40) {
        clearInterval(app.slideInterval);
      }
    }, 5);

  } /* End slideIn(). */


}; /* End App object. */
