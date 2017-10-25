function SupportChat() {


  /**
   * What back-end server technology are we using?  "jsp" or "asp".
   */
  this.serverType = "jsp";


  /**
   * The type of chatter this is, "customer" or "support" personnel.
   */
  this.chattype = "";


  /**
   * The name of the chatter.
   */
  this.chatname = "";


  /**
   * The time of the last message retrieval.
   */
  this.lastMessageTime = 0;


  /**
   * Called to initialize the application.
   */
  this.init = function() {

    // Get the chatter type
    this.chattype = jscript.page.getParameter("chattype");

    // Get the chatter's name
    this.chatname = jscript.page.getParameter("chatname");

    // Insert greeting.
    $("spnChatname").innerHTML = this.chatname;

    // Set a timer to fire to update the time at the bottom.
    setTimeout(updateDateTime, 0);

    // Set a timer to look for new messages on the server
    // (once every 2 seconds).
    setTimeout(getMessages, 2000);

  } // End init().


  /**
   * Called via timeout to update the date/time at the bottom.
   */
  var updateDateTime = function() {

    $("pDateTime").innerHTML = new Date();
    setTimeout(updateDateTime, 1000);

  } // End updateDateTime().


  /**
   * Called via timeout to get new messages in this conversation.
   */
  var getMessages = function() {

    new Ajax("server/chatServer." + chat.serverType, {
      postBody :
        Object.toQueryString(
          { "func" : "getMessages", "chatname" : chat.chatname,
          "lastMessageTime" : chat.lastMessageTime }
        ),
      onComplete : function(inResponse) {
        // Parse JSON response.
        var messageJSON = eval("(" + inResponse.trim() + ")");
        chat.lastMessageTime = messageJSON.lastMessageTime;
        var lines = new Array();
        // Iterate over messages received.
        for (var i = 0; i < messageJSON.messages.length; i++) {
          var nextMessage = messageJSON.messages[i];
          // Construct a new ChatMessage and add to array.
          var chatMessage = new ChatMessage();
          chatMessage.setTimestamp(nextMessage.timestamp);
          chatMessage.setChatname(nextMessage.chatname);
          chatMessage.setMessage(nextMessage.message);
          lines.push(chatMessage);
        }
        // Display new message lines.
        addLines(lines);
      }
    }).request();

    // Kick off the timer again.
    setTimeout(getMessages, 2000);

  } // End getMessages().


  /**
   * This function is called to add text to the chat display.
   *
   * @param inLines This is an array of Message objects to add to the display.
   */
  var addLines = function(inLines) {

    for (var i = 0; i < inLines.length; i++) {
      var message = inLines[i];
      var styleClass = "cssChatterText";
      if (message.getChatname() != chat.chatname) {
        styleClass = "cssSupportText";
      }
      htmlOut = "<div class=\"" + styleClass + "\">" +
        message.getChatname() + " : " +
        message.getMessage() +
        "</div>";
      $("divChat").innerHTML = $("divChat").innerHTML + htmlOut;
    }

  } // End addLines().


  /**
   * This function is called to post a message from a chatter.
   */
  this.postMessage = function(inLines) {

    new Ajax("server/chatServer." + chat.serverType, {
      postBody :
        Object.toQueryString(
          { "func" : "postMessage", "chatname" : chat.chatname,
          "messagetext" : $("postMessage").value }
        )
    }).request();
    $("postMessage").value = "";

  } // End addPostMessage().


  /**
   * Get the transcript of this chat session.
   *
   * @return The transcript of the chat session as a string.
   */
  var getChatTranscript = function() {

    // Get the text of the chat.
    var chatTranscript = $("divChat").innerHTML;

    // Now we need to go through the text and remove the HTML components so
    // we are left with nothing but text.  Then, for each line, we make sure
    // there's no trailing or leading whitespace, and we build up a string
    // containing all the lines, separated by linebreaks.
    var transcriptLines = chatTranscript.split(">");
    chatTranscript = "";
    for (var i = 0; i < transcriptLines.length; i++) {
      if (transcriptLines[i].toLowerCase().indexOf("</div") != -1) {
        transcriptLines[i] = transcriptLines[i].replace("</div", "");
        transcriptLines[i] = transcriptLines[i].replace("</DIV", "");
        chatTranscript += transcriptLines[i].trim() + "\r\n";
      }
    }

    return chatTranscript;

  } // End getChatTranscript().


  /**
   * Called to print the transcript of the chat.
   */
  this.printTranscript = function() {

    // Get the transcript of the chat.
    var chatTranscript = getChatTranscript();

    // Open a new window for it.
    var newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write("<pre>" + chatTranscript + "<pre>");
    newWindow.document.close();
    newWindow.print();

  } // End printTranscript().


  /**
   * Called to copy the transcript of the chat to the clipboard.
   */
  this.copyTranscript = function() {

    // Get the transcript of the chat.
    var textToCopy = getChatTranscript();

    // Branch based on browser capabilities...
    if (window.clipboardData) {

      // Internet Explorer is easy!
      window.clipboardData.setData("Text", textToCopy);

      // Let the chatter know we're done.
      alert("Chat transcript has been copied to the clipboard");

    } else if (window.netscape) {

      // Netscape/Firefox is hard!  First, ask it for permission to do this.
      try {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
      } catch (exception) {
        alert(exception);
        return;
      }

      // Instantiate a clipboard object.
      var clip =
        Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(
        Components.interfaces.nsIClipboard);
      // Instantiate a transferrable object and set it's "flavor"
      var trans =
        Components.classes['@mozilla.org/widget/transferable;1'].createInstance(
        Components.interfaces.nsITransferable);
      trans.addDataFlavor('text/unicode');
      // Instantiate a string object and set its value.
      var str =
        Components.classes["@mozilla.org/supports-string;1"].createInstance(
        Components.interfaces.nsISupportsString);
      str.data = textToCopy;
      // Set the value of the transferrable using the string.
      trans.setTransferData("text/unicode", str, textToCopy.length * 2);
      // Finally, put the text onto the clipboard.
      clip.setData(trans, null,
        Components.interfaces.nsIClipboard.kGlobalClipboard);

      // Let the chatter know we're done.
      alert("Chat transcript has been copied to the clipboard");

    } else {

      // Unsupported browser.
      alert("Unable to copy chat transcript to clipboard.\n\nOnly Internet " +
        "Explorer and Netscape-based browsers (including Firefox) " +
        "are supported.");

    }

  } // End copyTranscript().


  /**
   * Called to exit the application.
   */
  this.exitChat = function() {

    if (confirm("Are you sure you want to exit this chat session?")) {
      window.location = "server/chatServer." + chat.serverType +
        "?func=exitChat&chatname=" + chat.chatname;
    }

  } // End exitChat().


} // End SupportChat Class.


var chat = new SupportChat();
