<%@ taglib prefix="html" uri="http://jakarta.apache.org/struts/tags-html" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>

<html>

<head>

  <link rel="stylesheet" href="css/styles.css" type="text/css">
  <title><fmt:message key="messages.appTitle" /></title>

  <script>


    /**
     * These variables hold a value that is incremented with each request made.
     * The value is appended to the requested URL so that the URL is always
     * unique.  This is done to get around some caching issues with IE.
     * Note that the AJAX request to post of message DOES NOT need this
     * because it is a POST, which is always unique.
     */
    assureUniqueUsersInRoom = 1;
    assureUniqueGetMessages = 1;


    /**
     * This is the size of the font in the chat scroll.  It is adjustable
     * between 8 and 48 using the magnification icons.  Note that affects both
     * your text and other users' text together.
     */
    scrollChatFontSize = 12;


    /**
     * This variable stores the last HTML that was inserted into the userList
     * div.  When we get the list of users in the room, we compare this value
     * to the new HTML we construct.  If they are identical, we DO NOT update
     * the div.  This is to alleviate flickering that happens in Firefox priod
     * to v1.5 (supposed to have been fixed in 1.5, I have not tested it).
     */
    oldUserListHTML = "";


    /**
     * These variables are references to the XMLHttpRequest objects we'll use
     * to service our continual AJAX events.
     */
    xhrListUsersInRoom = null;
    xhrGetMessages     = null;


    /**
     * These variables are references to the Javascript timers that fire our
     * continuous AJAX events.
     */
    timerListUsersInRoom = null;
    timerGetMessages     = null;


    /**
     * These variables define how many milliseconds will elapse before each
     * of the continuous AJAX requests fire.  In other words, the list of users
     * timer will fire every second to send an AJAX request to update the list.
     * Note that this DOES NOT mean an AJAX request will be sent... if one is
     * already in progress, that iteration is effectively skipped.  This means
     * that a sever network problem could cause a new event to never fire (hey,
     * that would make a good enhancement... for each skipped request, see how
     * long it's been since the last successful one, and if it's been more than
     * a few seconds, allow the new event to fire anyway).
     */
    listUsersInRoomDelay = 2000;
    getMessagesDelay     = 1000;


    /**
     * This function initializes everything.  Basically this amounts to kicking
     * off the user list and chat history scroll retrieval timers so that we
     * have two AJAX events constantly firing, one get update the list of users
     * in the room, the other to update the list of messages posted to the room.
     */
    function init() {

      // Start the timers that fires the AJAX event to update the list of
      // users in the room and the chat history scroll.
      timerListUsersInRoom =
        setTimeout("listUsersInRoom()", 0);
      timerGetMessages = setTimeout("getMessages()", 0);

    } // End init().


    /**
     * This function sends the AJAX request to get the list of users currently
     * in the room.
     */
    function listUsersInRoom() {

      // Only fire a new event if a previous one has completed, or if the
      // XMLHttpRequest object is in an uninitialized state, or one has not
      // yet been instantiated.
      if (xhrListUsersInRoom == null || xhrListUsersInRoom.readyState == 0 ||
        xhrListUsersInRoom.readyState == 4) {
        // Create XMLHttpRequest object instance based on browser type.
        try {
          if (window.XMLHttpRequest){
            xhrListUsersInRoom = new XMLHttpRequest();
          } else {
            xhrListUsersInRoom = new ActiveXObject('Microsoft.XMLHTTP');
          }
          // Set the Javascript function that will act as a callback for
          // any events the instance fires.
          xhrListUsersInRoom.onreadystatechange = listUsersInRoomHandler;
          // Set the target URI for the request.  Note that we append a
          // value that will ensure that the URL is always unique.
          // This is to deal with caching issues in IE.
          target = "<html:rewrite action="ajaxListUsersInRoom" />" +
            "?assureUnique=" + assureUniqueUsersInRoom++;
          // Go ahead and fire off the request, no payload to send.
          xhrListUsersInRoom.open("get", target, true);
          xhrListUsersInRoom.send(null);
        } catch(e) {
          alert("Error in listUsersInRoom() - " + e.message);
        }
      }
      // Restart the timer no matter what happened above.
      timerListUsersInRoom =
        setTimeout("listUsersInRoom()", listUsersInRoomDelay);

    } // End listUsersInRoom().


    /**
     * This function handles state changes for the listUsersInRoom Ajax request.
     */
    function listUsersInRoomHandler() {

      if (xhrListUsersInRoom.readyState == 4) {
        if (xhrListUsersInRoom.status == 200) {
          // Get the returned XML and parse it, creating our HTML for display.
          newHTML = "";
          msgDOM  = xhrListUsersInRoom.responseXML;
          root    = msgDOM.getElementsByTagName("users")[0];
          users   = root.getElementsByTagName("user");
          for (i = 0; i < users.length; i++) {
            newHTML += users[i].getAttribute("name") + "<br/>";
          }
          // Update the display.
          if (oldUserListHTML != newHTML) {
            oldUserListHTML = newHTML;
            document.getElementById("userList").innerHTML = newHTML;
          }
        } else {
          alert("Error in listUsersInRoomHandler() - " +
            xhrListUsersInRoom.status);
        }
      }

    } // End listUsersInRoomHandler().


    /**
     * This function sends the AJAX request to get the messages to be shown
     * in the history scroll.  With each such request, we record the index that
     * was last requested (which will be set to the index of the highest
     * message we get back), so that each subsequent request effectively only
     * gets new messages.
     */
    function getMessages() {

      // Only fire a new event if a previous one has completed, or if the
      // XMLHttpRequest object is in an uninitialized state, or one has not
      // yet been instantiated.
      if (xhrGetMessages == null || xhrGetMessages.readyState == 0 ||
        xhrGetMessages.readyState == 4) {
        // Create XMLHttpRequest object instance based on browser type.
        try {
          if (window.XMLHttpRequest){
            xhrGetMessages = new XMLHttpRequest();
          } else {
            xhrGetMessages = new ActiveXObject('Microsoft.XMLHTTP');
          }
          // Set the Javascript function that will act as a callback for
          // any events the instance fires.
          xhrGetMessages.onreadystatechange = getMessagesHandler;
          // Set the target URI for the request.  Note that we append a
          // value that will ensure that the URL is always unique.
          // This is to deal with caching issues in IE.
          target = "<html:rewrite action="ajaxGetMessages" />" +
            "?assureUnique=" + assureUniqueGetMessages++;
          // Go ahead and fire off the request, no payload to send.
          xhrGetMessages.open("get", target, true);
          xhrGetMessages.send(null);
        } catch(e) {
          alert("Error in getMessages() - " + e.message);
        }
      }
      // Restart the timer no matter what happened above.
      timerGetMessages = setTimeout("getMessages()", getMessagesDelay);

    } // End getMessages().


    /**
     * This function handles state changes for the listUsersInRoom AJAX request.
     */
    function getMessagesHandler() {

      if (xhrGetMessages.readyState == 4) {
        if (xhrGetMessages.status == 200) {
          // Get the returned XML and parse it, creating our HTML for display.
          newHTML      = "";
          msgDOM       = xhrGetMessages.responseXML;
          root         = msgDOM.getElementsByTagName("messages")[0];
          messages     = root.getElementsByTagName("message");
          // Now we're going to cycle through all the <message> elements in
          // the returns XML and for each we'll pull out the pertinent details
          // and construct HTML for it.
          for (i = 0; i < messages.length; i++) {
            message = messages[i];
            postedBy =
              message.getElementsByTagName("postedBy")[0].firstChild.nodeValue;
            postedDateTime =
              message.getElementsByTagName(
                "postedDateTime")[0].firstChild.nodeValue;
            msgText =
              message.getElementsByTagName(
                "msgText")[0].firstChild.nodeValue;
            txtColor = "";
            if (postedBy == "<c:out value="${user.username}" />") {
              txtColor = document.getElementById("yourColor").value;
            } else {
              txtColor = document.getElementById("theirColor").value;
            }
            newHTML += "<font color=\"" + txtColor + "\">" +
              "[" + postedDateTime + "] " + postedBy + ": " + msgText +
              "</font><br/>";
          }
          // Update the display.  Note that the first time through we want to
          // completely overwrite what's there (just &nbsp;), all other times
          // we want to add on to what's there.  This is done to avoid the
          // borders collapsing and there being a minor visual glitch.
          objChatScroll = document.getElementById("chatScroll");
          if (newHTML != "") {
            if (objChatScroll.innerHTML == "&nbsp;") {
              objChatScroll.innerHTML = newHTML;
            } else {
              objChatScroll.innerHTML += newHTML;
            }
          }
          // Lastly, always scroll to the bottom.
          objChatScroll.scrollTop = 1000000;
        } else {
          alert("Error in getMessagesHandler() - " + xhrGetMessages.status);
        }
      }

    } // End getMessagesHandler().


    /**
     * This function is called to leave the room.
     */
    function leaveRoom() {

      window.location = "<html:rewrite action="leaveRoom" />";

    } // End leaveRoom().


    /**
     * This function is called to clear the chat history scroll.
     */
    function clearHistory() {

      document.getElementById("chatScroll").innerHTML = "&nbsp;";

    } // End clearHistory().


    /**
     * Utility function to trim whitespace from both ends of a string.
     */
    function fullTrim(inString) {

      return (inString.replace(/^\s*(.*\S|.*)\s*$/, '$1'));

    } // End fullTrim().


    /**
     * This function is called to post a message to the room.  Note that there
     * is no AJAX callback handler... since the message scroll will be updated
     * anyway, it's kind of redundant.  It also means there will be potentially
     * a slight delay between a user submitting a message and it showing up,
     * but this is considered acceptable.
     */
    function postMessage() {

      // Only try and send if the user entered something.
      userInputText = document.getElementById("userInput");
      if (fullTrim(userInputText.value) != "") {
        // Create XMLHttpRequest object instance based on browser type.
        if (window.XMLHttpRequest){
          xhrPostMessage = new XMLHttpRequest();
        } else {
          xhrPostMessage = new ActiveXObject('Microsoft.XMLHTTP');
        }
        try {
          // Set the target URI for the request.
          target =  "<html:rewrite action="ajaxPostMessage" />";
          target += "?msgText=" + escape(userInputText.value);
          // Go ahead and fire off the request, no payload to send.  Well,
          // technically, the payload was appended to the URI as a query
          // string.  In this case that was probably the easiest way to go.
          xhrPostMessage.open("get", target, true);
          xhrPostMessage.send(null);
          // Some UI niceness: clear what was just sent and set focus to the
          // user input box.
          userInputText.value = "";
          userInputText.focus();
        } catch(e) {
          alert(e.message);
        }
      }

    } // End postMessage().


    /**
     * This function is called when the increase font size image is clicked.
     * It's a simple client-side adjustment, simply setting the font-size
     * style attribute of the chat scroll.
     */
    function increaseChatScrollFontSize() {

      cs = document.getElementById("chatScroll");
      scrollChatFontSize = scrollChatFontSize + 2;
      if (scrollChatFontSize > 48) {
        scrollChatFontSize = 48;
      }
      cs.style.fontSize = scrollChatFontSize + "pt";

    }


    /**
     * This function is called when the decrease font size image is clicked.
     * It's a simple client-side adjustment, simply setting the font-size
     * style attribute of the chat scroll.
     */
    function decreaseChatScrollFontSize() {

      cs = document.getElementById("chatScroll");
      scrollChatFontSize = scrollChatFontSize - 2;
      if (scrollChatFontSize < 8) {
        scrollChatFontSize = 8;
      }
      cs.style.fontSize = scrollChatFontSize + "pt";

    }


  </script>

</head>

<body onLoad="init();" class="cssMain">

  <table align="center" border="1" bordercolor="#000000" width="100%"
    height="100%" cellpadding="4" cellspacing="0" class="cssRoomMainTable">

    <!-- ***** Header section ***** -->
    <tr>
      <td colspan="2" class="cssRoomHeader" height="40">
        <fmt:message key="messages.nowChattingIn" />
        <c:out value="${roomName}" />
      </td>
    </tr>

    <!-- ***** Chat scroll section ***** -->
    <tr>
      <td height="100%" valign="top">
        <div id="chatScroll" class="cssRoomChatScroll" />
      </td>
      <!-- User list section -->
      <td rowspan="3" width="200" align="top">
        <div id="userList" class="cssRoomUserList" />
      </td>
    </tr>

    <!-- ***** User control section ***** -->
    <tr>
      <td height="66" valign="middle" id="userControl"
        class="cssRoomUserControl">
        <table border="0" cellpadding="2" cellspacing="0" width="100%"
          height="100%" class="cssRoomUserControl">
          <tr>
            <td width="50%"
              <!-- Leave room button -->
              <input type="button"
                value="<fmt:message key="labels.leaveRoomButton" />"
                class="cssButton" onClick="leaveRoom();" />
              &nbsp;&nbsp;
              <!-- Clear history button -->
              <input type="button"
                value="<fmt:message key="labels.clearHistoryButton" />"
                class="cssButton" onClick="clearHistory();" />
            </td>
            <td width="50%" align="right">
              <!-- Your color -->
              <fmt:message key="labels.yourColor" />&nbsp;
              <select class="cssSelect" id="yourColor">
                <%@ include file="/inc/color_options.inc" %>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <!-- Increase/Decrease font size -->
              <fmt:message key="labels.fontSize" />
              &nbsp;
              <img src="img/zoomUp.gif" align="absmiddle" hspace="2"
                alt="<fmt:message key="labels.increaseFontSize" />"
                onClick="increaseChatScrollFontSize();"
                onMouseOver="this.style.cursor='hand';"
                onMouseOut="this.style.cursor='';">
              <img src="img/zoomDown.gif" align="absmiddle" hspace="8"
                alt="<fmt:message key="labels.decreaseFontSize" />"
                onClick="decreaseChatScrollFontSize()";
                onMouseOver="this.style.cursor='hand';"
                onMouseOut="this.style.cursor='';">
            </td>
            <td align="right">
              <!-- Their color -->
              <fmt:message key="labels.theirColor" />&nbsp;
              <select class="cssSelect" id="theirColor">
                <%@ include file="/inc/color_options.inc" %>
              </select>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- ***** User input section ***** -->
    <tr>
      <td height="70" valign="middle" class="cssRoomUserInput">
        <textarea class="cssUserInput" id="userInput"
          onKeyUp="if(event.keyCode==13){postMessage();}"></textarea>
        <input type="button" class="cssButton"
          value="<fmt:message key="labels.sendButton" />"
          onClick="postMessage();" />
      </td>
    </tr>

  </table>

</body>

</html>
