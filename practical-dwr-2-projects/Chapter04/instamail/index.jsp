<%@ page language="java" import="com.apress.dwrprojects.instamail.*" %>
<html>

  <head>

    <title>InstaMail</title>

    <link rel="stylesheet" href="css/styles.css" type="text/css">

    <!-- DWR interfaces. -->
    <script type="text/javascript" src="js/script.js"></script>
    <script type="text/javascript" src="dwr/interface/OptionsManager.js"></script>
    <script type="text/javascript" src="dwr/interface/AddressBookManager.js"></script>
    <script type="text/javascript" src="dwr/interface/MailRetriever.js"></script>
    <script type="text/javascript" src="dwr/interface/MailSender.js"></script>
    <script type="text/javascript" src="dwr/interface/MailDeleter.js"></script>
    <script type="text/javascript" src="dwr/engine.js"></script>
    <script type="text/javascript" src="dwr/util.js"></script>

    <script>

      // Initialize the application.  This has to be here as opposed to
      // script.js because there is some JSP scriplet here that has to execute,
      // and that wouldn't have happened if it was in an external JS file.
      function init() {
        // There was a strange problem with Firefox... in some cases, no matter
        // what I did, the textboxes would still have values when I reloaded
        // the app. I never did figure out why this was, so all the textboxes
        // in the app are cleared here, which deals with the issue.  Same thing
        // for enabling text fields.  If anyone figures out why this happens,
        // I'd love to hear it!  Until then, I chalk it up as a Firefox quirk.
        setValue("contactNameEntry", "");
        setValue("contactAddressEntry", "");
        setValue("contactNoteEntry", "");
        setValue("pop3ServerEntry", "");
        setChecked("pop3ServerRequiresLoginEntry", null);
        setValue("pop3UsernameEntry", "");
        setValue("pop3PasswordEntry", "");
        setValue("smtpServerEntry", "");
        setChecked("smtpServerRequiresLoginEntry", null);
        setValue("smtpUsernameEntry", "");
        setValue("smtpPasswordEntry", "");
        setValue("fromAddressEntry", "");
        setValue("composeToEntry", "");
        setValue("composeSubjectEntry", "");
        setValue("composeTextEntry", "");
        setDisabled("contactNameEntry", false);
        setDisabled("contactAddressEntry", false);
        setDisabled("contactNoteEntry", false);
        setDisabled("pop3ServerEntry", false);
        setDisabled("pop3ServerRequiresLoginEntry", false);
        setDisabled("pop3UsernameEntry", false);
        setDisabled("pop3PasswordEntry", false);
        setDisabled("smtpServerEntry", false);
        setDisabled("smtpServerRequiresLoginEntry", false);
        setDisabled("smtpUsernameEntry", false);
        setDisabled("smtpPasswordEntry", false);
        setDisabled("fromAddressEntry", false);
        setDisabled("composeToEntry", false);
        setDisabled("composeSubjectEntry", false);
        setDisabled("composeTextEntry", false);
        // Start out on the Intro view.
        currentView = "divIntro";
        showView(currentView);
        <%
          OptionsDTO options = new OptionsManager().retrieveOptions(
            pageContext.getServletContext());
            // The application has not yet been configured, so we want to
            if (options.isConfigured()) {
        %>
              // The buttons start out not showing, to avoid Javascript errors
              // if you hover over them before the page fully loads, but now
              // we can show them.
              setClassName("topButtons", "divShowing");
              setClassName("sideButtons", "divShowing");
              appConfigured = true;
        <%
            } else {
        %>
              // The application has not yet been configured.  In this case,
              // the buttons ARE NOT shown, and instead we show the normally
              // hidden "Getting Started" div.
              setClassName("divGettingStarted", "divShowing");
              appConfigured = false;
        <%
            }
        %>
      }

    </script>


  </head>

  <body onLoad="init();">

    <div id="divPleaseWait" class="cssPleaseWait">
      <img src="img/pleasewait.gif" hspace="4" vspace="8" align="absmiddle">
      Please wait, processing...
    </div>

    <table class="border" border="0" cellpadding="0" cellspacing="0"
      width="100%" height="100%">
      <!-- Top Banner -->
      <tr>
        <td class="topstrip" valign="top" height="1">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td class="themecolor1" valign="top" width="191"><img
                src="img/logo.gif" border="0"></td>
              <td valign="top" width="36"><img src="img/cornerstrip.gif"
                border="0"></td>
              <td valign="top" width="100%">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td height="40" valign="top">
                      <div align="right"><img src="img/subheading.gif"
                        border="0"></div>
                    </td>
                  </tr>
                  <!-- Top Menu -->
                  <tr>
                    <td valign="top">
                      <table border="0" cellpadding="0" cellspacing="0"
                        id="topButtons" class="divHidden">
                        <tr>
                          <td><img src="img/compose.gif" border="0" id="compose"
                            onMouseOver="btnMouseOver(this);"
                            onMouseOut="btnMouseOut(this);"
                            onClick="gotoComposeMessage();"></td>
                          <td><img src="img/delete.gif" border="0" id="delete"
                            onMouseOver="btnMouseOver(this);"
                            onMouseOut="btnMouseOut(this);"
                            onClick="doDelete();"></td>
                          <td><img src="img/reply.gif" border="0"
                            id="reply"
                            onMouseOver="btnMouseOver(this);"
                            onMouseOut="btnMouseOut(this);"
                            onClick="gotoComposeReply();"></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Sidebar -->
      <tr>
        <td valign="top">
          <table border="0" cellpadding="0" cellspacing="0" width="100%"
            height="100%">
            <tr>
              <td class="leftcolbg" valign="top" width="96">
                <div align="center">
                  <table border="0" cellpadding="0" cellspacing="0"
                    id="sideButtons" class="divHidden">
                    <tr><td height="5"></td></tr>
                    <tr>
                      <td height="24"><img src="img/inbox.gif" id="inbox"
                        border="0" onMouseOver="btnMouseOver(this);"
                        onMouseOut="btnMouseOut(this);"
                        onClick="gotoInbox();"></td>
                    </tr>
                    <tr>
                      <td height="24"><img src="img/sentmessages.gif"
                        id="sentmessages" border="0"
                        onMouseOver="btnMouseOver(this);"
                        onMouseOut="btnMouseOut(this);"
                        onClick="gotoSentMessages();"></td>
                    </tr>
                    <tr>
                      <td height="24"><img src="img/addressbook.gif"
                        id="addressbook" border="0"
                        onMouseOver="btnMouseOver(this);"
                        onMouseOut="btnMouseOut(this);"
                        onClick="gotoAddressBook();"></td>
                    </tr>
                    <tr>
                      <td height="24"><img src="img/options.gif"
                        id="options" border="0"
                        onMouseOver="btnMouseOver(this);"
                        onMouseOut="btnMouseOut(this);"
                        onClick="gotoOptions();"></td>
                    </tr>
                  </table>
                </div>
              </td>
              <td class="rightcoltext" valign="top">

                <!-- Intro DIV -->
                <div id="divIntro" class="divHidden">
                  <img src="img/heading.gif" border="0">
                  <br><br>
                  InstaMail is an AJAX-based webmail client.  It works with
                  POP3 accounts only.  If this is your first use of InstaMail,
                  you will need to click the Options link to the left and
                  configure an account.  After an account has been configured,
                  you can click the Inbox button on the side to check for
                  new messages.
                  <br><br>
                  Help for the current view is always available by clicking
                  the link at the bottom.
                  <div id="divGettingStarted" class="divHidden">
                    <b>
                    <br>
                    <b>This appears to be your first time using InstaMail.  To
                    get started, you will need to configure your eMail
                    account.
                    <br><br>
                    <div onClick="gotoOptions();"
                      onMouseOver="this.className='rowHover';this.style.fontWeight='bold';"
                      onMouseOut="this.className=null;">
                      Click here to get started...
                    </div>
                    </b>
                  </div>
                </div>

                <!-- Inbox DIV -->
                <div id="divInbox" class="divHidden">
                  <div class="divTitle">Inbox</div>
                  <br>
                  <div class="msgCount" id="inboxCount"></div>
                  <br>
                  <table class="textboxborder" align="center" border="0"
                    cellpadding="2" cellspacing="0" width="100%">
                    <tr>
                      <td class="msgListHead" height="20" valign="top" width="1">
                        Delete&nbsp;&nbsp;
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        From
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        Received
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        Subject
                      </td>
                    </tr>
                    <tbody id="inboxTBody"></tbody>
                  </table>
                </div>

                <!-- Sent Messages DIV -->
                <div id="divSentMessages" class="divHidden">
                  <div class="divTitle">Sent Messages</div>
                  <br>
                  <div class="msgCount" id="sentMessagesCount"></div>
                  <br>
                  <table class="textboxborder" align="center" border="0"
                    cellpadding="2" cellspacing="0" width="100%">
                    <tr>
                      <td class="msgListHead" height="20" valign="top" width="1">
                        Delete&nbsp;&nbsp;
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        To
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        Sent
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        Subject
                      </td>
                    </tr>
                    <tbody id="sentMessagesTBody"></tbody>
                  </table>
                </div>

                <!-- Message DIV -->
                <div id="divMessage" class="divHidden">
                  <div class="divTitle" id="viewTitle"></div>
                  <br>
                  <table class="textboxborder" align="center" border="0"
                    cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="para3bg" height="20" valign="top">
                        <img src="img/paraheading3.gif" border="0">
                      </td>
                    </tr>
                    <tr>
                      <td class="textbox" valign="top">
                        <table border="0" cellpadding="2" cellspacing="0">
                          <tr>
                            <td width="1" class="msgDetailLabel" valign="middle"
                              id="msgFromToLabel"></td>
                            <td class="msgDetail" id="msgFromTo"
                              valign="middle">&nbsp;</td>
                          </tr>
                          <tr>
                            <td width="1" class="msgDetailLabel" valign="middle"
                              id="msgSentReceivedLabel"></td>
                            <td class="msgDetail" id="msgSentReceived"
                              valign="middle">&nbsp;</td>
                          </tr>
                          <tr>
                            <td width="1" class="msgDetailLabel"
                              valign="middle">Subject:&nbsp;</td>
                            <td class="msgDetail" id="msgSubject"
                              valign="middle">&nbsp;</td>
                          </tr>
                          <tr><td colspan="2">&nbsp;</td></tr>
                          <tr>
                            <td colspan="2" id="msgText">
                              &nbsp;
                            </td>
                          </tr>
                          <tr>
                            <td height="0" id="msgFilename"
                              style="display:none;"></td>
                            <td height="0" id="msgID"
                              style="display:none;"></td>
                          </tr>
                          <tr>
                            <td height="0" id="msgType"
                              style="display:none;"></td>
                            <td height="0" style="display:none;">&nbsp;</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Address Book DIV -->
                <div id="divAddressBook" class="divHidden">
                  <div class="divTitle">Address Book</div>
                  <br>
                  <table class="textboxborder" align="center" border="0"
                    cellpadding="2" cellspacing="0" width="100%">
                    <tr>
                      <td class="msgListHead" height="20" valign="top">
                        Name
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        eMail Address
                      </td>
                      <td class="msgListHead" height="20" valign="top">
                        Note
                      </td>
                    </tr>
                    <tbody id="addressBookTBody"></tbody>
                  </table>
                  <br><br>
                  <table width="100%" cellpadding="0" cellspacing="4"
                    class="cssOptionLabel">
                    <tr>
                      <td width="1" valign="middle">Name:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="contactNameEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">eMail&nbsp;Address:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="contactAddressEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1" valign="middle">Note:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="contactNoteEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1">&nbsp;</td>
                      <td valign="middle">
                        &nbsp;
                        <input type="image" src="img/save.gif"
                        onClick="saveContact();"
                        onMouseOver="this.src=img_save_over.src;"
                        onMouseOut="this.src=img_save.src;">
                        &nbsp;&nbsp;
                        <input type="image" src="img/delete1.gif"
                        onClick="deleteContact();"
                        onMouseOver="this.src=img_delete1_over.src;"
                        onMouseOut="this.src=img_delete1.src;">
                        &nbsp;&nbsp;
                        <input type="image" src="img/new.gif"
                        onClick="newContact();"
                        onMouseOver="this.src=img_new_over.src;"
                        onMouseOut="this.src=img_new.src;">
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- Options DIV -->
                <div id="divOptions" class="divHidden">
                  <div class="divTitle">Options</div>
                  <br>
                  InstaMail supports a single account, and only supports
                  POP3 for message retrieval and SMTP for message transmission.
                  Please fill in the values below to configure your account.
                  <br><br>
                  <table width="100%" cellpadding="0" cellspacing="4"
                    class="cssOptionLabel">
                    <tr>
                      <td width="1" valign="middle">POP3&nbsp;Server:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="pop3ServerEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1" valign="middle">POP3&nbsp;Server&nbsp;Requires&nbsp;Login:&nbsp;&nbsp;</td>
                      <td valign="middle"><input type="checkbox"
                        id="pop3ServerRequiresLoginEntry"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">POP3&nbsp;Username:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="pop3UsernameEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">POP3&nbsp;Password:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="pop3PasswordEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr><td>&nbsp;</td></tr>
                    <tr>
                      <td width="1"
                        valign="middle">SMTP&nbsp;Server:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="smtpServerEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1" valign="middle">SMTP&nbsp;Server&nbsp;Requires&nbsp;Login:&nbsp;&nbsp;</td>
                      <td valign="middle"><input type="checkbox"
                        id="smtpServerRequiresLoginEntry"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">SMTP&nbsp;Username:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="smtpUsernameEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">SMTP&nbsp;Password:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="smtpPasswordEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1"
                        valign="middle">From&nbsp;Address:&nbsp;&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="text" size="30"
                        class="editField" id="fromAddressEntry" value=""
                        onFocus="this.className='currentEditField';"
                        onBlur="this.className='editField';"></td>
                    </tr>
                    <tr>
                      <td width="1">&nbsp;</td>
                      <td valign="middle">&nbsp;<input type="image"
                        src="img/save.gif" onClick="saveOptions();"
                        onMouseOver="this.src=img_save_over.src;"
                        onMouseOut="this.src=img_save.src;">
                    </tr>
                  </table>
                </div>

                <!-- Compose Message DIV -->
                <div id="divCompose" class="divHidden">
                  <div class="divTitle">Compose Message</div>
                  <br>
                  <table class="textboxborder" align="center" border="0"
                    cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td class="para3bg" height="20" valign="top">
                        <img src="img/paraheading3.gif" border="0">
                      </td>
                    </tr>
                    <tr>
                      <td class="textbox" valign="top">
                        <table border="0" cellpadding="2" cellspacing="0">
                          <tr>
                            <td width="1" class="msgDetailLabel"
                              valign="middle">To:&nbsp;</td>
                            <td class="msgDetail" valign="middle">
                              <input type="text" size="30" class="editField"
                                id="composeToEntry" value=""
                                onFocus="this.className='currentEditField';"
                                onBlur="this.className='editField';">
                            </td>
                          </tr>
                          <tr>
                            <td width="1" class="msgDetailLabel"
                              valign="middle">Subject:&nbsp;</td>
                            <td class="msgDetail" valign="middle">
                              <input type="text" size="30" class="editField"
                                id="composeSubjectEntry" value=""
                                onFocus="this.className='currentEditField';"
                                onBlur="this.className='editField';">
                            </td>
                          </tr>
                          <tr><td colspan="2">&nbsp;</td></tr>
                          <tr>
                            <td colspan="2" id="msgText">
                              <textarea type="text" size="30" class="editField"
                                id="composeTextEntry" value="" cols="80"
                                rows="20"
                                onFocus="this.className='currentEditField';"
                                onBlur="this.className='editField';">
                              </textarea>
                              <br>
                              <input type="image" src="img/send.gif"
                                onClick="sendMessage();"
                                onMouseOver="this.src=img_send_over.src;"
                                onMouseOut="this.src=img_send.src;">
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>

              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td class="footer" height="20" valign="top"
          onMouseOver="this.className='footerHover';"
          onMouseOut="className='footer';"
          onClick="gotoHelp();" >
          <div align="center">Click here for help with the current view</div>
        </td>
      </tr>
    </table>

  </body>

</html>