function EventHandlers() {


  // ********** Selector images array.
  this.selectorImages = null;


  // ********** Array of images to load.
  this.imageIDs = [
    "sel_XX", "sel_09", "sel_ac", "sel_df", "sel_gi", "sel_jl",
    "sel_mo", "sel_pr", "sel_su", "sel_vx", "sel_yz"
  ];


  // ********** Initialization.
  this.init = function() {

    this.selectorImages = new Array();

    // Load images form the above array and store them in selectorImages.
    for (var i = 0; i < this.imageIDs.length; i++) {
      var sid = this.imageIDs[i];
      this.selectorImages[sid] = new Image();
      this.selectorImages[sid].src = "img/" +
        sid + ".gif";
      this.selectorImages[sid + "_over"] = new Image();
      this.selectorImages[sid + "_over"].src = "img/" +
        sid + "_over.gif";
    }

    // Get all input fields and attach onFocus and onBlur handlers.
    var inputFields = document.getElementsByTagName("input");
    for (i = 0; i < inputFields.length; i++) {
      inputFields[i].onfocus = this.ifFocus;
      inputFields[i].onblur = this.ifBlur;
    }

  } // End init().


  // ********** Input Field focus.
  this.ifFocus = function() {

    this.style.backgroundColor = "#ffffa0";

  } // End ifFocus();


  // ********** Input Field blur.
  this.ifBlur = function() {

    this.style.backgroundColor = "#ffffff";

  } // End ifBlur().


  // ********** Selector Tab mouseOver.
  this.stOver = function(inTab) {

    inTab.src = this.selectorImages[inTab.id + "_over"].src;

  } // End stOver().


  // ********** Selector Tab mouseOut.
  this.stOut = function(inTab) {

    // Only switch state if not the current tab.
    if (contactManager.currentTab != inTab.id.substr(4, 2)) {
      inTab.src = this.selectorImages[inTab.id].src;
    }

  } // End stOut().


  // ********** Selector Tab click.
  this.stClick = function(inTab) {

    // Reset all tabs before setting the current one.
    for (var i = 0; i < this.imageIDs.length; i++) {
      var sid = this.imageIDs[i];
      dojo.byId(sid).src = this.selectorImages[sid].src;
    }

    inTab.src = this.selectorImages[inTab.id + "_over"].src;

    // Record the current tab, and redisplay the contact list.
    contactManager.currentTab = inTab.id.substr(4, 2);
    contactManager.displayContactList();

  } // End stClick().


  // ********** Contact List mouseOver.
  this.clOver = function(inContact) {

    inContact.className = "cssContactListOver";

  } // End clOver().


  // ********** Contact List mouseOut.
  this.clOut = function(inContact) {

    if (inContact.getAttribute("altRow") == "true") {
      inContact.className = "cssContactListAlternate";
    } else {
      inContact.className = "cssContactListNormal";
    }

  } // End clOut().


} // End EventHandlers class.
