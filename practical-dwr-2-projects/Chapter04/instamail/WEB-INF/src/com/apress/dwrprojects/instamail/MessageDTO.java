package com.apress.dwrprojects.instamail;


import java.lang.reflect.Field;


/**
 * This is a bean that describes an eMail message.
 *
 * @author <a href="mailto:fzammetti@omnytex.com">Frank W. Zammetti</a>.
 */
public class MessageDTO implements java.io.Serializable {


  /**
   * msgType.  This is the message type, either "sent" or "received".
   */
  private String msgType;


  /**
   * fileName.  This is the filename a sent message is stored on disk under.
   * This will be null for messages in the Inbox.
   */
  private String filename;


  /**
   * msgID.  This is the ID of a message in the Inbox.  This will be null for
   * Sent Messages.
   */
  private String msgID;


  /**
   * From.  This is who the message was sent from.  This will be the fromAddress
   * set in Options for Sent Messages.
   */
  private String from;


  /**
   * To.  This is who the message as sent to.  This will be the fromAddress set
   * in Options for messages in the Inbox.
   */
  private String to;


  /**
   * Subject.  This is the subject of the message.
   */
  private String subject;


  /**
   * Received date/time.  This is when a message in the Inbox was received.
   * This will be null for Sent Messages.
   */
  private String received;


  /**
   * Sent date/time.  This is when a Sent Message was sent.  This will be
   * null for messages in the Inbox.
   */
  private String sent;


  /**
   * Message text.  This is the actual text of the message.
   */
  private String msgText;


  /**
   * setMsgType.
   *
   * @param inMsgType inMsgType.
   */
  public void setMsgType(String inMsgType) {

    msgType = inMsgType;

  } // End setMsgType().


  /**
   * getMsgType.
   *
   * @return msgType.
   */
  public String getMsgType() {

    return msgType;

  } // End getMsgType().


  /**
   * setFilename.
   *
   * @param inFilename inFilename.
   */
  public void setFilename(String inFilename) {

    filename = inFilename;

  } // End setFilename().


  /**
   * getFilename.
   *
   * @return filename.
   */
  public String getFilename() {

    return filename;

  } // End getFilename().


  /**
   * setMsgID.
   *
   * @param inMsgID inMsgID.
   */
  public void setMsgID(String inMsgID) {

    msgID = inMsgID;

  } // End setMsgID().


  /**
   * getMsgID.
   *
   * @return msgID.
   */
  public String getMsgID() {

    return msgID;

  } // End getMsgID().


  /**
   * setFrom.
   *
   * @param inFrom inFrom.
   */
  public void setFrom(String inFrom) {

    from = inFrom;

  } // End setFrom().


  /**
   * getFrom.
   *
   * @return from.
   */
  public String getFrom() {

    return from;

  } // End getFrom().


  /**
   * setTo.
   *
   * @param inTo inTo.
   */
  public void setTo(String inTo) {

    to = inTo;

  } // End setTo().


  /**
   * getTo.
   *
   * @return to.
   */
  public String getTo() {

    return to;

  } // End getTo().


  /**
   * setSubject.
   *
   * @param inSubject inSubject.
   */
  public void setSubject(String inSubject) {

    subject = inSubject;

  } // End setSubject().


  /**
   * getSubject.
   *
   * @return subject.
   */
  public String getSubject() {

    return subject;

  } // End getSubject().


  /**
   * setReceived.
   *
   * @param inReceived inReceived.
   */
  public void setReceived(String inReceived) {

    received = inReceived;

  } // End setReceived().


  /**
   * getReceived.
   *
   * @return received.
   */
  public String getReceived() {

    return received;

  } // End getReceived().


  /**
   * setSent.
   *
   * @param inSent inSent.
   */
  public void setSent(String inSent) {

    sent = inSent;

  } // End setSent().


  /**
   * getSent.
   *
   * @return sent.
   */
  public String getSent() {

    return sent;

  } // End getSent().


  /**
   * setMsgText.
   *
   * @param inMsgText inMsgText.
   */
  public void setMsgText(String inMsgText) {

    msgText = inMsgText;

  } // End setMsgText().


  /**
   * getMsgText.
   *
   * @return msgText.
   */
  public String getMsgText() {

    return msgText;

  } // End getMsgText().


  /**
   * Overriden toString method.
   *
   * @return A reflexively-built string representation of this bean.
   */
  public String toString() {

    String str = null;
    StringBuffer sb = new StringBuffer(1000);
    sb.append("[" + super.toString() + "]={");
    boolean firstPropertyDisplayed = false;
    try {
      Field[] fields = this.getClass().getDeclaredFields();
      for (int i = 0; i < fields.length; i++) {
        if (firstPropertyDisplayed) {
          sb.append(", ");
        } else {
          firstPropertyDisplayed = true;
        }
        sb.append(fields[i].getName() + "=" + fields[i].get(this));
      }
      sb.append("}");
      str = sb.toString().trim();
    } catch (IllegalAccessException iae) {
      iae.printStackTrace();
    }
    return str;

  } // End toString().


} // End class.
