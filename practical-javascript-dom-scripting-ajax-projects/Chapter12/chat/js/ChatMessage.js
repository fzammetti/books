function ChatMessage() {


  /**
   * The time this message was posted.
   */
  var timestamp = "";


  /**
   * The chatname of the chatter who posted it.
   */
  var chatname = "";


  /**
   * The text of the message
   */
  var message = "";


  /**
   * Mutator.
   *
   * @param inTime The new field value.
   */
  this.setTimestamp = function(inTimestamp) {

    timestamp = inTimestamp;

  } // End setTimestamp().


  /**
   * Accessor
   *
   * @return The value of the time field.
   */
  this.getTimestamp = function() {

    return timestamp;

  } // End getTimestamp().


  /**
   * Mutator.
   *
   * @param inChatname The new field value.
   */
  this.setChatname = function(inChatname) {

    chatname = inChatname;

  } // End setChatname().


  /**
   * Accessor
   *
   * @return The value of the chatname field.
   */
  this.getChatname = function() {

    return chatname;

  } // End getChatname().


  /**
   * Mutator.
   *
   * @param inMessage The new field value.
   */
  this.setMessage = function(inMessage) {

    message = inMessage;

  } // End setMessage().


  /**
   * Accessor
   *
   * @return The value of the message field.
   */
  this.getMessage = function() {

    return message;

  } // End getMessage().


  /**
   * Overriden toString() method.
   *
   * @return A meaningful string representation of the object.
   */
  this.toString = function() {

    return "ChatMessage : [ " +
      "timestamp='" + timestamp + "', " +
      "chatname='" + chatname + "', " +
      "message='" + message + "' ]";

  } // End toString().


} // End ChatMessage class.
