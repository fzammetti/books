<%@ page language="java" import="java.sql.*,java.util.*" %>


<%

  // Filename that is a full path to the database file.
  String filename = "K:/tomcat5029/webapps/chat/database/chatDB.mdb";

  // Variables needed for database work.
  Connection conn = null;
  Statement stmt = null;

  // Load JDBC driver.
  Class.forName("sun.jdbc.odbc.JdbcOdbcDriver");
  String database = "jdbc:odbc:Driver={Microsoft Access Driver " +
    "(*.mdb)};DBQ=" + filename + ";DriverID=22;READONLY=false}";
  conn = DriverManager.getConnection( database ,"","");
  stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,
    ResultSet.CONCUR_UPDATABLE);

  // Get the function that was requested.
  String func = request.getParameter("func");

  // Construct a timestamp for this event.  Format is HHMMSSLLL (LLL is
  // milliseconds).
  GregorianCalendar calendar = new GregorianCalendar();
  String hh = Integer.toString(calendar.get(Calendar.HOUR_OF_DAY));
  if (hh.length() == 1) { hh = "0" + hh; }
  String mm = Integer.toString(calendar.get(Calendar.MINUTE));
  if (mm.length() == 1) { mm = "0" + mm; }
  String ss = Integer.toString(calendar.get(Calendar.SECOND));
  if (ss.length() == 1) { ss = "0" + ss; }
  String ms = Integer.toString(calendar.get(Calendar.MILLISECOND));
  if (ms.length() == 1) { ms = "0" + ms; }
  if (ms.length() == 2) { ms = "0" + ms; }
  String timeStamp = hh + mm + ss + ms;

  // Branch as appropriate for the command.
  if (func == null) {

    // Invalid function received.  Something's fishy!
    %>
    <html><head><title>Bad Function</title></head><body>
      A bad function was requested.  Are you hacking or something?!?
    </body></html>
    <%

  // Handle valid functions...
  } else {


    // ******************************
    // ** Logon                    **
    // ******************************
    if (func.equalsIgnoreCase("logon")) {

      // Processing a logon.
      String chatType = request.getParameter("chattype");

      if (chatType.equalsIgnoreCase("customer")) {

        // It's a customer logon.  See if the name is already in use.
        String customerChatName = request.getParameter("chatname");
        ResultSet rs = stmt.executeQuery(
          "select chatname from chatters where " +
          "chatname='" + customerChatName + "'");
        if (rs.first()) {
          // Name is already in use, have the chatter select a new one.
          rs.close();
          %>
          <html><head><title>Name already in use</title></head><body>
            I'm sorry but that name is already in use.  Please click
            <a href="../index.htm">HERE</a> and select a new name.
          </body></html>
          <%
        } else {
          // Name is available, so now we have to see if there are any available
          // support personnel to chat with.
          rs.close();
          rs = stmt.executeQuery("select chatname from chatters " +
            "where type='support' and chatwith='none'");
          if (rs.first()) {
            // Ok, we got someone.  Now log the chatter into the database and
            // send them to the chat page.
            String supportChatName = rs.getString(1);
            rs.close();
            stmt.executeUpdate("insert into chatters (chatname, logon, type, " +
              "chatwith) values (" +
              "'" + customerChatName + "', " +
              "'" + timeStamp + "', " +
              "'customer', '" + supportChatName + "')");
            // We also need to mark the support person as chatting with this
            // chatter.
            stmt.executeUpdate("update chatters set chatwith='" +
              customerChatName + "' where chatname='" + supportChatName + "'");
            // Lastly, add a message to the messages table so both chatters see
            // who they are chatting with.
            stmt.executeUpdate("insert into messages (messagetime, chatname, " +
              "messagetext) values ('" + timeStamp + "', '" + supportChatName +
              "', 'Hello, " + customerChatName + "!  " + supportChatName +
              " is here to help you!')");
            %>
            <html><head><title>Starting chat</title><script>
              function startChat() {
              window.location =
                "../chat.htm?func=startChat&" +
                "chatname=<%=customerChatName%>&chattype=customer&" +
                "chatwith=<%=supportChatName%>";
              }
              </script></head>
              <body onLoad="startChat();">Starting chat...</body>
            </html>
            <%
          } else {
            // No support personnel available.  Give the chatter the bad news.
            rs.close();
            %>
            <html><head>
            <title>No support personnel available</title>
            </head><body>
              There are currently no support personnel available.  Please click
              <a href="chatServer.jsp?func=logon&chattype=customer&chatname=<%=customerChatName%>">HERE</a>
              to check for someone again.
            </body></html>
            <%
          }
        }

      } else {

        // It's a support personnel logon.  See if the name is already in use.
        String supportChatName = request.getParameter("chatname");
        ResultSet rs = stmt.executeQuery(
          "select chatname from chatters where " +
          "chatname='" + supportChatName + "'");
        if (rs.first()) {
          // Name is already in use, have the chatter select a new one.
          rs.close();
          %>
          <html><head><title>Name already in use</title></head><body>
            I'm sorry but that name is already in use.  Please click
            <a href="../index.htm">HERE</a> and select a new name.
          </body></html>
          <%
        } else {
          // Name is available, so now log the chatter in.
          rs.close();
          stmt.executeUpdate("insert into chatters (chatname, logon, type, " +
            "chatwith) values (" +
            "'" + supportChatName + "', " +
            "'" + timeStamp + "', " +
            "'support', 'none')");
          %>
          <html>
            <head>
              <title>Starting chat</title>
              <script>
                function startChat() {
                  window.location =
                    "../chat.htm?func=startChat&" +
                    "chatname=<%=supportChatName%>&chattype=support";
                }
              </script>
            </head>
            <body onLoad="startChat();">Starting chat...</body>
          </html>
          <%
        }
      }

    } // End "logon" function handling.


    // ******************************
    // ** Get Messages             **
    // ******************************
    if (func.equalsIgnoreCase("getMessages")) {

      String chatname = request.getParameter("chatname");
      String lastMessageTime = request.getParameter("lastMessageTime");
      // First, find out who this chatter is chatting with.
      ResultSet rs = stmt.executeQuery(
        "select chatwith from chatters where " +
        "chatname='" + chatname + "'");
      rs.first();
      String chatwith = rs.getString(1);
      rs.close();
      // Now, get all messages posted by this chatter, or by who they were
      // chatting with, since the time of the last message passed in.
      rs = stmt.executeQuery(
        "select messagetime, chatname, messagetext from messages where " +
        "(chatname='" + chatname + "' or " + "chatname='" + chatwith +
        "') and messagetime >= " + lastMessageTime);
      boolean firstMessage = true;
      %>
      { "lastMessageTime" : "<%=timeStamp%>",
        "messages" : [
      <% while (rs.next()) {
        if (firstMessage) {
          firstMessage = false;
        } else {
          out.print(", ");
        }
      %>
           { "timestamp" : "<%=rs.getString(1)%>",
             "chatname" : "<%=rs.getString(2)%>",
             "message" : "<%=rs.getString(3)%>"
           }
      <% } %>
        ] }
      <%
      rs.close();

    } // End "getMessage" function handling.


    // ******************************
    // ** Post Messages            **
    // ******************************
    if (func.equalsIgnoreCase("postMessage")) {

      String chatname = request.getParameter("chatname");
      String messagetext = request.getParameter("messagetext");
      messagetext = messagetext.replace('\'', '`');
      stmt.executeUpdate("insert into messages (messagetime, chatname, " +
        "messagetext) values (" +
        timeStamp + ", " +
        "'" + chatname + "', " +
        "'" + messagetext + "')");

    } // End "postMessage" function handling.


    // ******************************
    // ** Exit Chat                **
    // ******************************
    if (func.equalsIgnoreCase("exitChat")) {

      String chatname = request.getParameter("chatname");
      // First, find out who this chatter is chatting with.
      ResultSet rs = stmt.executeQuery(
        "select chatwith from chatters where " +
        "chatname='" + chatname + "'");
      rs.first();
      String chatwith = rs.getString(1);
      // Now, delete all messages the chatter posted, as well as messages
      // posted by who they were chatting with.  After this query, the
      // "conversation" is effectively deleted from the database.
      stmt.executeUpdate("delete from messages where chatname='" + chatname +
        "' or chatname='" + chatwith + "'");
      // Next, delete the chatter from the chatters table.
      stmt.executeUpdate("delete from chatters where chatname='" + chatname +
        "'");
      // Finally, if we find any records in the chatters table where this
      // chatter is the value of the chatwith field, update that field of
      // that record to "none".  This covers when the chatter logging off is a
      // customer, it makes the support personnel available again.  If it's
      // a support personnel logging off, it does no harm to the chatter,
      // although the user is effectively "orphaned", i.e., their messages
      // will be seen no support personnel, and they will see messages from no
      // support personnel.
      stmt.executeUpdate("update chatters set chatwith='none' where " +
        "chatwith='" + chatname + "'");
      // Finally, say goodbye to the chatter.
      %>
      <html>
        <head>
          <title>Exiting chat</title>
          <script>
            function exitChat() {
              window.location = "../goodbye.htm";
            }
          </script>
        </head>
        <body onLoad="exitChat();">Exiting chat...</body>
      </html>
      <%

    } // End "exitChat" function handling.


  } // End function handling section.

  // Clean up the database resources.
  if (stmt != null) {
    stmt.close();
  }
  if (conn != null) {
    conn.close();
  }

%>
