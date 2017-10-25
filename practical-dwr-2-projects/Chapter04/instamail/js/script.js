
// ***************************************************************************
// Image preloads for buttons.
// ***************************************************************************

img_send = new Image();
img_send.src = "img/send.gif";
img_send_over = new Image();
img_send_over.src = "img/send_over.gif";
img_save = new Image();
img_save.src = "img/save.gif";
img_save_over = new Image();
img_save_over.src = "img/save_over.gif";
img_new = new Image();
img_new.src = "img/new.gif";
img_new_over = new Image();
img_new_over.src = "img/new_over.gif";
img_delete1 = new Image();
img_delete1.src = "img/delete1.gif";
img_delete1_over = new Image();
img_delete1_over.src = "img/delete1_over.gif";
img_compose = new Image();
img_compose.src = "img/compose.gif";
img_compose_over = new Image();
img_compose_over.src = "img/compose_over.gif";
img_delete = new Image();
img_delete.src = "img/delete.gif";
img_delete_over = new Image();
img_delete_over.src = "img/delete_over.gif";
img_reply = new Image();
img_reply.src = "img/reply.gif";
img_reply_over = new Image();
img_reply_over.src = "img/reply_over.gif";
img_inbox = new Image();
img_inbox.src = "img/inbox.gif";
img_inbox_over = new Image();
img_inbox_over.src = "img/inbox_over.gif";
img_sentmessages = new Image();
img_sentmessages.src = "img/sentmessages.gif";
img_sentmessages_over = new Image();
img_sentmessages_over.src = "img/sentmessages_over.gif";
img_addressbook = new Image();
img_addressbook.src = "img/addressbook.gif";
img_addressbook_over = new Image();
img_addressbook_over.src = "img/addressbook_over.gif";
img_options = new Image();
img_options.src = "img/options.gif";
img_options_over = new Image();
img_options_over.src = "img/options_over.gif";


// ***************************************************************************
// Globals.
// ***************************************************************************

// What view is currently showing?
var currentView = null;
// This variable is used when rendering checkboxes.  Each checkbox has to have
// a unique ID, so we simply number then starting at zero.  Because of the way
// we create the checkboxes via DWR, this seemed the only way to create such
// an index number.
var checkboxNumber = null;
// When init() is called, a check is done to determine if the application has
// been configured yet.  If it has not been yet, then only the Options view
// is available to the user.  This variable is used to make that determination.
var appConfigured = null;


// ***************************************************************************
// Button handlers.
// ***************************************************************************

// onMouseOver handler for buttons.
function btnMouseOver(obj) {
  id = obj.id;
  obj.src = eval("img_" + id + "_over").src;
  obj.style.cursor = "pointer";
}


// onMouseOut handler for buttons.
function btnMouseOut(obj) {
  id = obj.id;
  obj.src = eval("img_" + id).src;
  obj.style.cursor = "";
}


// ***************************************************************************
// Handlers for rows in Inbox or Sent Messages.
// ***************************************************************************

// onMouseOver handler for rows in Inbox or Sent Messages.
function rowMouseOver() {
  this.parentNode.className = "rowHover";
}


// onMouseOut handler for rows in Inbox or Sent Messages.
function rowMouseOut() {
  this.parentNode.className = this.parentNode.rowClass;
}


// ***************************************************************************
// Utility functions.
// ***************************************************************************

// The following functions save us from having to have
// document.getElementById() everywhere.
function setElement(inID, inElement) {
  return document.getElementById(inID) = inElement;
}
function getElement(inID) {
  return document.getElementById(inID);
}
function setValue(inID, inValue) {
  document.getElementById(inID).value = inValue;
}
function getValue(inID) {
  return document.getElementById(inID).value;
}
function setInnerHTML(inID, inInnerHTML) {
  document.getElementById(inID).innerHTML = inInnerHTML;
}
function getInnerHTML(inID) {
  return document.getElementById(inID).innerHTML;
}
function setChecked(inID, inChecked) {
  document.getElementById(inID).checked = inChecked;
}
function getChecked(inID) {
  return document.getElementById(inID).checked;
}
function setClassName(inID, inClassName) {
  document.getElementById(inID).className = inClassName;
}
function getClassName(inID) {
  return document.getElementById(inID).className;
}
function setDisplay(inID, inDisplay) {
  document.getElementById(inID).style.display = inDisplay;
}
function getDisplay(inID) {
  return document.getElementById(inID).style.display;
}
function setDisabled(inID, inDisabled) {
  document.getElementById(inID).disabled = inDisabled;
}
function getDisabled(inID) {
  return document.getElementById(inID).disabled;
}


// Hide all layers.
function hideAll() {
  setClassName("divIntro", "divHidden");
  setClassName("divInbox", "divHidden");
  setClassName("divSentMessages", "divHidden");
  setClassName("divMessage", "divHidden");
  setClassName("divAddressBook", "divHidden");
  setClassName("divOptions", "divHidden");
  setClassName("divCompose", "divHidden");
}


// Called to show the Please Wait layer when an operation begins.
function showPleaseWait() {
  hideAll();
  enableButtons(false);
  // First we center the layer.
  pleaseWaitDIV = getElement("divPleaseWait");
  if (window.innerWidth) {
    lca = window.innerWidth;
  } else {
    lca = document.body.clientWidth;
  }
  lcb = pleaseWaitDIV.offsetWidth;
  lcx = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  dsocleft = document.all ? iebody.scrollLeft : window.pageXOffset;
  pleaseWaitDIV.style.left = (lcx + dsocleft - 120) + "px";
  if (window.innerHeight) {
    lca = window.innerHeight;
  } else {
    lca = document.body.clientHeight;
  }
  lcb = pleaseWaitDIV.offsetHeight;
  lcy = (Math.round(lca / 2)) - (Math.round(lcb / 2));
  iebody = (document.compatMode &&
    document.compatMode != "BackCompat") ?
    document.documentElement : document.body;
  dsoctop = document.all ? iebody.scrollTop : window.pageYOffset;
  pleaseWaitDIV.style.top = (lcy + dsoctop - 40) + "px";
  // Now actually show it.
  pleaseWaitDIV.style.display = "block";
}


// Called to hide the Please Wait layer when an operation completes.
function hidePleaseWait() {
  setDisplay("divPleaseWait", "none");
  enableButtons(appConfigured);
}


// Called to show a named view DIV.
function showView(inViewToShow) {
  setClassName(inViewToShow, "divShowing");
}


// Called to enable or disable all buttons when Please Wait is shown.
function enableButtons(inEnabled) {
  if (inEnabled) {
    setClassName("topButtons", "divShowing");
    setClassName("sideButtons", "divShowing");
  } else {
    setClassName("topButtons", "divHidden");
    setClassName("sideButtons", "divHidden");
  }
}


// ***************************************************************************
// ***************************************************************************
// START OF AJAX FUNCTIONS.
// ***************************************************************************
// ***************************************************************************


// Called when the Inbox link is clicked, shows divInbox.
function gotoInbox() {
  showPleaseWait();
  MailRetriever.getInboxContents(replyGetInboxContents);
}
// Our callback.
var replyGetInboxContents = function(data) {
  DWRUtil.removeAllRows("inboxTBody");
  checkboxNumber = 0;
  var altRow = true;
  var getFrom = function(data) { return data.from; };
  var getReceived = function(data) { return data.received; };
  var getSubject = function(data) { return data.subject; };
  var getCheckbox = function(data) {
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "cb_received_" + checkboxNumber;
    cb.msgID = data.msgID;
    checkboxNumber++;
    return cb;
  };
  var count = 0;
  DWRUtil.addRows("inboxTBody", data,
    [ getCheckbox, getFrom, getReceived, getSubject ], {
    rowCreator:function(options) {
      count++;
      var row = document.createElement("tr");
      if (altRow) {
        row.rowClass = "msgListRow1";
        row.className = "msgListRow1";
        altRow = false;
      } else {
        row.rowClass = "msgListRow2";
        row.className = "msgListRow2";
        altRow = true;
      }
      row.msgType = data[options.rowIndex].msgType;
      row.msgID = data[options.rowIndex].msgID;
      return row;
    },
    cellCreator:function(options) {
      var cell = document.createElement("td");
      if (options.cellNum != 0) {
        cell.onclick = gotoViewMessage;
        cell.onmouseover = rowMouseOver;
        cell.onmouseout = rowMouseOut;
      }
      return cell;
    }
  });
  setInnerHTML("inboxCount", count + " total messages");
  currentView = "divInbox";
  showView(currentView);
  hidePleaseWait();
}


// Called when the Sent Messages link is clicked, shows divSentMessages.
function gotoSentMessages() {
  showPleaseWait();
  MailRetriever.getSentMessagesContents(replyGetSentMessagesContents);
}
// Our callback.
var replyGetSentMessagesContents = function(data) {
  DWRUtil.removeAllRows("sentMessagesTBody");
  checkboxNumber = 0;
  var altRow = true;
  var getTo = function(data) { return data.to; };
  var getSent = function(data) { return data.sent; };
  var getSubject = function(data) { return data.subject; };
  var getCheckbox = function(data) {
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "cb_sent_" + checkboxNumber;
    cb.filename = data.filename;
    checkboxNumber++;
    return cb;
  };
  var count = 0;
  DWRUtil.addRows("sentMessagesTBody", data,
    [ getCheckbox, getTo, getSent, getSubject ], {
    rowCreator:function(options) {
      count++;
      var row = document.createElement("tr");
      if (altRow) {
        row.rowClass = "msgListRow1";
        row.className = "msgListRow1";
        altRow = false;
      } else {
        row.rowClass = "msgListRow2";
        row.className = "msgListRow2";
        altRow = true;
      }
      row.msgType = data[options.rowIndex].msgType;
      row.filename = data[options.rowIndex].filename;
      return row;
    },
    cellCreator:function(options) {
      var cell = document.createElement("td");
      if (options.cellNum != 0) {
        cell.onclick = gotoViewMessage;
        cell.onmouseover = rowMouseOver;
        cell.onmouseout = rowMouseOut;
      }
      return cell;
    }
  });
  setInnerHTML("sentMessagesCount", count + " total messages");
  currentView = "divSentMessages";
  showView(currentView);
  hidePleaseWait();
}


// Called when a message is clicked while divInbox or divSentMessages is
// showing, shows divMessage.
function gotoViewMessage() {
  var _msgID = null;
  var _msgType = null;
  var _filename = null;
  showPleaseWait();
  if (currentView == "divInbox") {
    _msgID = this.parentNode.msgID;
    _filename = null;
  }
  if (currentView == "divSentMessages") {
    _filename  = this.parentNode.filename;
    _msgID = null;
  }
  _msgType = this.parentNode.msgType;
  MailRetriever.retrieveMessage(_msgType, _filename, _msgID, replyRetrieveMessage);
}
// Our callback.
var replyRetrieveMessage = function(data) {
  setInnerHTML("msgSubject", data.subject);
  setInnerHTML("msgText", data.msgText);
  setInnerHTML("msgType", data.msgType);
  if (data.msgType == "received") {
    setInnerHTML("msgID", data.msgID);
    setInnerHTML("msgFromToLabel", "From:&nbsp;");
    setInnerHTML("msgFromTo", data.from);
    setInnerHTML("viewTitle", "Received Message");
    setInnerHTML("msgSentReceivedLabel", "Received:&nbsp;");
    setInnerHTML("msgSentReceived", data.received);
  }
  if (data.msgType == "sent") {
    setInnerHTML("msgFilename", data.filename);
    setInnerHTML("msgFromToLabel", "To:&nbsp;");
    setInnerHTML("msgFromTo", data.to);
    setInnerHTML("viewTitle", "Sent Message");
    setInnerHTML("msgSentReceivedLabel", "Sent:&nbsp;");
    setInnerHTML("msgSentReceived", data.sent);
  }
  currentView = "divMessage";
  showView(currentView);
  hidePleaseWait();
}


// Called to delete a message or group of messages.
// showing, shows divMessage.
function doDelete() {
  // First, make sure the current view is valid for the delete function.
  if (currentView != "divInbox" && currentView != "divSentMessages" &&
    currentView != "divMessage") {
    alert("The delete function can only be used from the Inbox, " +
      "Sent Messages or individual message views");
    return false;
  }
  // These are the three variables we will need to set for the delete to work.
  var msgType = "";
  var filenames = "";
  var msgIDs = "";
  // If it's the divMessage view, then the user wants
  // to delete a single message.  In that case it's relatively easy...
  if (currentView == "divMessage") {
    msgType = getInnerHTML("msgType");
    filenames = getInnerHTML("msgFilename");
    msgIDs = getInnerHTML("msgID");
  }
  // If it's the divInbox or divSentMessages view, then the user wants
  // to potentially delete multiple messages.  Slightly trickier because we
  // have to construct a comma-separated list of IDs or filenames.
  var obj = null;
  var i = 0;
  // Construct a CSV list of MsgIDs for Inbox messages.
  if (currentView == "divInbox") {
    msgType = "received";
    filenames = null;
    obj = getElement("cb_received_" + i);
    while (obj != null) {
      if (obj.checked) {
        if (msgIDs != "") {
          msgIDs += ",";
        }
        msgIDs += obj.msgID;
      }
      i++;
      obj = getElement("cb_received_" + i);
    }
  }
  // Construct a CSV of filenames for Sent Messages.
  if (currentView == "divSentMessages") {
    msgType = "sent";
    msgIDs = null;
    obj = getElement("cb_sent_" + i);
    while (obj != null) {
      if (obj.checked) {
        if (filenames != "") {
          filenames += ",";
        }
        filenames += obj.filename;
      }
      i++;
      obj = getElement("cb_sent_" + i);
    }
  }
  // At this point, msgType has been set properly, and we have a CSV of
  // either filenames or msgIDs populated, depending on which view we are
  // in.  Now we just send it and we're good to go.
  showPleaseWait();
  MailDeleter.deleteMessages(msgType, filenames, msgIDs, replyDeleteMessages);
}
// Our callback.
var replyDeleteMessages = function(data) {
  alert(data);
  hidePleaseWait();
  if (currentView == "divInbox") {
    gotoInbox();
  }
  if (currentView == "divSentMessages") {
    gotoSentMessages();
  }
  if (currentView == "divMessage") {
    if (getInnerHTML("viewTitle") == "Received Message") {
      gotoInbox();
    }
    if (getInnerHTML("viewTitle") == "Sent Message") {
      gotoSentMessages();
    }
  }
}


// Called to send a message.
function sendMessage() {
  composeTo      = getValue("composeToEntry");
  composeSubject = getValue("composeSubjectEntry");
  composeText    = getValue("composeTextEntry");
  if (composeTo == "" || composeSubject == "" || composeText == "") {
    alert("Please enter a to address, a subject and a message");
    hidePleaseWait();
    return false;
  }
  showPleaseWait();
  MailSender.sendMessage(composeTo, composeSubject, composeText,
    replySendMessage);
}
// Our callback.
var replySendMessage = function(data) {
  newContact();
  alert(data);
  setValue("composeToEntry", "");
  setValue("composeSubjectEntry", "");
  setValue("composeTextEntry", "");
  hidePleaseWait();
  currentView = "divSentMessages";
  gotoSentMessages();
}


// Called when the Address Book link is clicked, shows divAddressBook.
function gotoAddressBook() {
  showPleaseWait();
  AddressBookManager.retrieveContacts(replyRetrieveContacts);
}
// Our callback.
var replyRetrieveContacts = function(data) {
  DWRUtil.removeAllRows("addressBookTBody");
  var altRow = true;
  var getName = function(data) { return data.name };
  var getAddress = function(data) { return data.address };
  var getNote = function(data) { return data.note };
  DWRUtil.addRows("addressBookTBody", data,
    [ getName, getAddress, getNote ], {
    rowCreator:function(options) {
    var row = document.createElement("tr");
    if (altRow) {
      row.rowClass = "msgListRow1";
      row.className = "msgListRow1";
      altRow = false;
    } else {
      row.rowClass = "msgListRow2";
      row.className = "msgListRow2";
      altRow = true;
    }
    row.contactName = getName;
    return row;
    },
    cellCreator:function(options) {
      var cell = document.createElement("td");
      cell.onclick = editContact;
      cell.onmouseover = rowMouseOver;
      cell.onmouseout = rowMouseOut;
      return cell;
    }
  });
  currentView = "divAddressBook";
  showView(currentView);
  hidePleaseWait();
}


// Called to save a contact.
function saveContact() {
  contactName = getValue("contactNameEntry");
  contactAddress = getValue("contactAddressEntry");
  contactNote = getValue("contactNoteEntry");
  if (contactName == "" || contactAddress == "") {
    alert("Please enter both a name and address");
    hidePleaseWait();
    return false;
  }
  showPleaseWait();
  AddressBookManager.saveContact(contactName, contactAddress, contactNote,
    replySaveContact);
}
// Our callback.
var replySaveContact = function(data) {
  newContact();
  alert(data);
  hidePleaseWait();
  gotoAddressBook();
}


// Called to delete a contact.
function deleteContact() {
  contactName = getValue("contactNameEntry");
  if (contactName == "") {
    alert("Please select a contact to delete");
    hidePleaseWait();
    return false;
  }
  showPleaseWait();
  AddressBookManager.deleteContact(contactName, replyDeleteContact);
}
// Our callback.
var replyDeleteContact = function(data) {
  newContact();
  alert(data);
  hidePleaseWait();
  gotoAddressBook();
}


// Called when the Options link is clicked, shows divOptions.
function gotoOptions() {
  showPleaseWait();
  OptionsManager.retrieveOptions(replyRetrieveOptions);
}
// Our callback.
var replyRetrieveOptions = function(data) {
  setValue("pop3ServerEntry", data.pop3Server);
  if (data.pop3ServerRequiresLogin == "true") {
    setChecked("pop3ServerRequiresLoginEntry", "true");
  } else {
    setChecked("pop3ServerRequiresLoginEntry", null);
  }
  setValue("pop3UsernameEntry", data.pop3Username);
  setValue("pop3PasswordEntry", data.pop3Password);
  setValue("smtpServerEntry", data.smtpServer);
  if (data.smtpServerRequiresLogin == "true") {
    setChecked("smtpServerRequiresLoginEntry", "true");
  } else {
    setChecked("smtpServerRequiresLoginEntry", null);
  }
  setValue("smtpUsernameEntry", data.smtpUsername);
  setValue("smtpPasswordEntry", data.smtpPassword);
  setValue("fromAddressEntry", data.fromAddress);
  currentView = "divOptions";
  showView(currentView);
  hidePleaseWait();
}


// Called when the Save button is clicked when divOptions is showing.
function saveOptions() {
  pop3Server = getValue("pop3ServerEntry");
  pop3ServerRequiresLogin = getChecked("pop3ServerRequiresLoginEntry");
  pop3Username = getValue("pop3UsernameEntry");
  pop3Password = getValue("pop3PasswordEntry");
  smtpServer = getValue("smtpServerEntry");
  smtpServerRequiresLogin = getChecked("smtpServerRequiresLoginEntry");
  smtpUsername = getValue("smtpUsernameEntry");
  smtpPassword = getValue("smtpPasswordEntry");
  fromAddress = getValue("fromAddressEntry");
  if (pop3Server == "") {
    alert("You must enter a POP3 server address");
    hidePleaseWait();
    return false;
  }
  if (pop3ServerRequiresLogin == true &&
    (pop3Username == "" || pop3Password == "")) {
    alert("If the POP3 server requires login, then you must enter " +
      "both a POP3 username and password");
    hidePleaseWait();
    return false;
  }
  if (smtpServer == "") {
    alert("You must enter an SMTP server address");
    hidePleaseWait();
    return false;
  }
  if (smtpServerRequiresLogin == true &&
    (smtpUsername == "" || smtpPassword == "")) {
    alert("If the SMTP server requires login, then you must enter " +
      "both an SMTP username and password");
    hidePleaseWait();
    return false;
  }
  if (fromAddress == "") {
    alert("You must enter a from address");
    hidePleaseWait();
    return false;
  }
  showPleaseWait();
  OptionsManager.saveOptions(pop3Server, pop3ServerRequiresLogin,
    pop3Username, pop3Password, smtpServer, smtpServerRequiresLogin,
    smtpUsername, smtpPassword, fromAddress, replySaveOptions);
}
// Our callback.
var replySaveOptions = function(data) {
  alert(data);
  appConfigured = true;
  setClassName("divGettingStarted", "divHidden");
  showView(currentView);
  hidePleaseWait();
}


// ***************************************************************************
// ***************************************************************************
// START OF NON-AJAX FUNCTIONS.
// ***************************************************************************
// ***************************************************************************


// Called to edit/delete an existing contact.
function editContact() {
  setValue("contactNameEntry", this.parentNode.cells[0].innerHTML);
  setValue("contactAddressEntry", this.parentNode.cells[1].innerHTML);
  setValue("contactNoteEntry", this.parentNode.cells[2].innerHTML);
  setDisabled("contactNameEntry", true);
  setDisabled("contactAddressEntry", false);
  setDisabled("contactNoteEntry", false);
}


// Called when the Compose Message link is clicked, shows divCompose.
function gotoComposeMessage() {
  if (currentView == "divAddressBook") {
    setValue("composeToEntry", getValue("contactAddressEntry"));
  }
  showPleaseWait();
  currentView = "divCompose";
  showView(currentView);
  hidePleaseWait();
}


// Called when the Reply button is clicked, shows divCompose.
function gotoComposeReply() {
  // First, make sure the current view is valid for this function.
  if (currentView != "divMessage") {
    alert("The Reply function can only be used from the " +
      "individual message view");
    return false;
  }
  setValue("composeToEntry", getInnerHTML("msgFromTo"));
  setValue("composeSubjectEntry", "Re: " + getInnerHTML("msgSubject"));
  setValue("composeTextEntry",
    "\n\n---- In reply to the following message ----\n\n" +
    getInnerHTML("msgText"));
  showPleaseWait();
  currentView = "divCompose";
  showView(currentView);
  hidePleaseWait();
}


// Called to create a new contact (just clears out the edit boxes).
function newContact() {
  setValue("contactNameEntry", "");
  setValue("contactAddressEntry", "");
  setValue("contactNoteEntry", "");
  setDisabled("contactNameEntry", false);
  setDisabled("contactAddressEntry", false);
  setDisabled("contactNoteEntry", false);
}


// Called when the help link at the bottom is clicked.
function gotoHelp() {
  if (currentView == "divIntro") {
    alert("This is the intro view.\n\nTo get started, click one of the " +
      "buttons on the top or the side");
      return false;
  }
  if (currentView == "divCompose") {
    alert("This is the Compose view.\n\nThis is where you can compose an eMail " +
      "message.\n\nEnter the eMail address to send to, a subject and some " +
      "text, then click Send.");
      return false;
  }
  if (currentView == "divInbox") {
    alert("This is the Inbox view.\n\nThis is where you will see all " +
      "received message.\n\nClick on a message to view it in full.\n\nYou " +
      "can check off a number of messages and then click Delete to delete " +
      "them all.\n\nYou can also delete a single message while viewing it.");
      return false;
  }
  if (currentView == "divSentMessages") {
    alert("This is the Sent Messages view.\n\nThis is where you will see all " +
      "sent message.\n\nClick on a message to view it in full.\n\nYou can " +
      "check off a number of messages and then click Delete to delete " +
      "them all.\n\nYou can also delete a single message while viewing it.");
      return false;
  }
  if (currentView == "divMessage") {
    alert("This is the Message view.\n\nThis is where you will view a " +
      "single message in full.\n\nYou can delete the message you are viweing " +
      "by clicking the Delete button up top.\n\nWhen viewing a received " +
      "message, you can click the Reply button to compose a reply to it.");
      return false;
  }
  if (currentView == "divOptions") {
    alert("This is the Options view.\n\nThis is where you will set all " +
      "options, including setting up your eMail account.\n\nEnter the " +
      "details for your POP3 server and SMTP server, and the from address to " +
      "use for all sent messages, and click Save.");
      return false;
  }
  if (currentView == "divAddressBook") {
    alert("This is the Address Book view.\n\nThis is where you will maintain " +
      "your list of frequent contacts.\n\nTo edit an existing contact, click " +
      "it in the list, make your changes, then click Save.\n\nTo delete an " +
      "existing contact, click it in the list, then click Delete.\n\nTo add " +
      "a new contact, click the New button to clear the entry fields, enter " +
      "the contact details and then click Save.\n\nTo compose a message to " +
      "an existing contact, click them in the list, then click the Compose " +
      "button up top.");
      return false;
  }
}
