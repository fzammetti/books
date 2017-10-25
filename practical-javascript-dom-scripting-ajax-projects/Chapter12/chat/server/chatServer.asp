<%

  ' Filename that is a full path to the database file.
  filename = "C:\Inetpub\wwwroot\Code\database/chatDB.mdb"

  ' Variables needed for database work.
  Set conn = Server.CreateObject("ADODB.Connection")

  ' Open connection to database.
  conn.Open "DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=" & filename
  Set rs = Server.CreateObject("ADODB.Recordset")
  rs.CursorLocation = 3
  rs.CursorType = 3
  rs.LockType = 4

  ' Get the function that was requested.
  func = Request("func")

  ' Construct a timestamp for this event.  Format is HHMMSSLLL (LLL is
  ' milliseconds).
  hh = CStr(Hour(Now()))
  If Len(hh) = 1 Then hh = "0" & hh End If
  mm = CStr(Minute(Now()))
  If Len(mm) = 1 Then mm = "0" & mm End If
  ss = CStr(Second(Now()))
  If Len(ss) = 1 Then ss = "0" & ss End If
  ms = "000"
  timeStamp = hh + mm + ss + ms

  ' Branch as appropriate for the command.
  If func = "" Then

    ' Invalid function received.  Something's fishy!
    %>
    <html><head><title>Bad Function</title></head><body>
      A bad function was requested.  Are you hacking or something?!?
    </body></html>
    <%

  ' Handle valid functions...
  Else



    ' ******************************
    ' ** Logon                    **
    ' ******************************
    If func = "logon" Then

      ' Processing a logon.
      chatType = Trim(Request("chattype"))

      If chatType = "customer" Then

        ' It's a customer logon.  See if the name is already in use.
        customerChatName = Trim(Request("chatname"))
        rs.Open "select chatname from chatters where " & _
          "chatname='" & customerChatName & "'", conn
        If rs.RecordCount <> 0 Then
          ' Name is already in use, have the chatter select a new one.
          rs.Close
          %>
          <html><head><title>Name already in use</title></head><body>
            I'm sorry but that name is already in use.  Please click
            <a href="../index.htm">HERE</a> and select a new name.
          </body></html>
          <%
        Else
          ' Name is available, so now we have to see if there are any available
          ' support personnel to chat with.
          rs.Close
          rs.Open ("select chatname from chatters " & _
            "where type='support' and chatwith='none'")
          If rs.RecordCount <> 0 Then
            ' Ok, we got someone.  Now log the chatter into the database and
            ' send them to the chat page.
            supportChatName = rs("chatname")
            rs.Close
            conn.Execute "insert into chatters (chatname, logon, type, " & _
              "chatwith) values (" & _
              "'" & customerChatName & "', " & _
              "'" & timeStamp & "', " & _
              "'customer', '" & supportChatName & "')"
            ' We also need to mark the support person as chatting with this
            ' chatter.
            conn.Execute "update chatters set chatwith='" & _
              customerChatName & "' where chatname='" & supportChatName & "'"
            // Lastly, add a message to the messages table so both chatters see
            // who they are chatting with.
            conn.Execute "insert into messages (messagetime, chatname, " & _
              "messagetext) values ('" & timeStamp & "', '" & _
              supportChatName & "', 'Hello, " & customerChatName & "!  " & _
              supportChatName & " is here to help you!')"
            %>
            <html><head><title>Starting chat</title><script>
              function startChat() {
                window.location =
                  "../chat.htm?func=startChat&" +
                  "chatname=<%=customerChatName%>&chattype=customer&" +
                  "chatwith=<%=supportChatName%>"
              }
              </script></head>
              <body onLoad="startChat();">Starting chat...</body>
            </html>
            <%
          Else
            ' No support personnel available.  Give the chatter the bad news.
            rs.Close
            %>
            <html><head>
            <title>No support personnel available</title>
            </head><body>
              There are currently no support personnel available.  Please click
              <a href="<%=request.ServerVariables("URL")%>?func=logon&chattype=customer&chatname=<%=customerChatName%>">HERE</a>
              to check for someone again.
            </body></html>
            <%
          End If
        End If

      Else

        ' It's a support personnel logon.  See if the name is already in use.
        supportChatName = Trim(Request("chatname"))
        rs.Open "select chatname from chatters where " & _
          "chatname='" & supportChatName & "'", conn
        If rs.RecordCount <> 0 Then
          ' Name is already in use, have the chatter select a new one.
          rs.Close
          %>
          <html><head><title>Name already in use</title></head><body>
            I'm sorry but that name is already in use.  Please click
            <a href="../index.htm">HERE</a> and select a new name.
          </body></html>
          <%
        Else
          ' Name is available, so now log the chatter in.
          rs.Close
          conn.Execute "insert into chatters (chatname, logon, type, " & _
            "chatwith) values (" & _
            "'" & supportChatName & "', " & _
            "'" & timeStamp & "', " & _
            "'support', 'none')"
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
        End If
      End If

    End If ' End "logon" function handling.


    ' ******************************
    ' ** Get Messages             **
    ' ******************************
    If func = "getMessages" Then

     chatname = Trim(Request("chatname"))
     lastMessageTime = Trim(Request("lastMessageTime"))
      ' First, find out who this chatter is chatting with.
      rs.Open "select chatwith from chatters where " & _
        "chatname='" & chatname & "'", conn
      chatwith = rs("chatwith")
      rs.Close
      ' Now, get all messages posted by this chatter, or by who they were
      ' chatting with, since the time of the last message passed in.
      rs.Open "select messagetime, chatname, messagetext from messages " & _
        "where (chatname='" & chatname & "' or " & "chatname='" & chatwith & _
        "') and messagetime >= " & lastMessageTime, conn
      firstMessage = true
      %>
      { "lastMessageTime" : "<%=timeStamp%>",
        "messages" : [
      <% Do While Not rs.EOF
        If firstMessage = true Then
          firstMessage = false
        Else
          response.write ", "
        End If
      %>
           { "timestamp" : "<%=rs("messagetime")%>",
             "chatname" : "<%=rs("chatname")%>",
             "message" : "<%=rs("messagetext")%>"
           }
      <%
           rs.MoveNext
         Loop
      %>
        ] }
      <%
      rs.close()

    End If ' End "getMessage" function handling.


    ' ******************************
    ' ** Post Messages            **
    ' ******************************
    If func = "postMessage" Then

      chatname = Trim(Request("chatname"))
      messagetext = Trim(Request("messagetext"))
      messagetext = Replace(messagetext, "'", "''")
      conn.Execute "insert into messages (messagetime, chatname, " & _
        "messagetext) values (" & _
        timeStamp & ", " & _
        "'" & chatname & "', " & _
        "'" & messagetext & "')"

    End If ' End "postMessage" function handling.


    ' ******************************
    ' ** Exit Chat                **
    ' ******************************
    If func = "exitChat" Then

      chatname = Trim(Request("chatname"))
      ' First, find out who this chatter is chatting with.
      rs.Open "select chatwith from chatters where " & _
        "chatname='" & chatname & "'", conn
      chatwith = rs("chatwith")
      rs.Close
      ' Now, delete all messages the chatter posted, as well as messages
      ' posted by who they were chatting with.  After this query, the
      ' "conversation" is effectively deleted from the database.
      conn.Execute "delete from messages where chatname='" & chatname & _
        "' or chatname='" & chatwith & "'"
      ' Next, delete the chatter from the chatters table.
      conn.Execute "delete from chatters where chatname='" & chatname & "'"
      ' Finally, if we find any records in the chatters table where this
      ' chatter is the value of the chatwith field, update that field of
      ' that record to "none".  This covers when the chatter logging off is a
      ' customer, it makes the support personnel available again.  If it's
      ' a support personnel logging off, it does no harm to the chatter,
      ' although the chatter is effectively "orphaned", i.e., their messages
      ' will not be seen by a support personnel, and they will see messages
      ' from no support personnel.
      conn.Execute "update chatters set chatwith='none' where " & _
        "chatwith='" & chatname & "'"
      ' Finally, say goodbye to the chatter.
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

    End If ' End "exitChat" function handling.


  End If ' End function handling section.

  ' Clean up the database resources.
  Set conn = Nothing

%>
