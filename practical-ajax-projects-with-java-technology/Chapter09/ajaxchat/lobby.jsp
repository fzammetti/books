<%@ taglib prefix="html" uri="http://jakarta.apache.org/struts/tags-html" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>

<html>

<head>

  <link rel="stylesheet" href="css/styles.css" type="text/css">
  <title><fmt:message key="messages.appTitle" /></title>

  <script>


    /**
     * This variable holds a value that is incremented with each request made.
     * The value is appended to the requested URL so that the URL is always
     * unique.  This is done to get around some caching issues with IE.
     */
    assureUnique = 1;


    /**
     * This is the XMLHttpRequest object that is used to service this page
     * to update the stats (how many users are chatting in each room.
     */
    xhrLobbyUpdateStats = null;


    /**
     * This is the timer that fires to continually update the room stats.
     */
    timerLobbyUpdateStats = null;


    /**
     * This is the delay between AJAX requests to update room stats.
     */
    lobbyUpdateStatsDelay = 2000;


    /**
     * When the user clicks the logout button, we need to immediately stop
     * firing AJAX events because if the timing is just right, the session could
     * be invalidated before another stats update is requested, which results
     * in an exception.  So, this gets set to false when the logout button is
     * clicked, which stops the next request from being made.  Note that there
     * is still a very small chance for the exception to occur, but the timing
     * would have to be pretty darned close!
     */
    sendAJAXRequest = true;


    /**
     * This funtion is called on page load to initialize things.
     */
    function init() {

      timerLobbyUpdateStats = setTimeout("lobbyUpdateStats()", 0);

    } // End init().


    /**
     * This function is called as a result of the firing of the
     * timerLobbyUpdateStats timer to make an AJAX request to get counts of
     * users chatting in each room.  This happens continually as the user
     * sits in the lobby.
     */
    function lobbyUpdateStats() {

      // Only fire a new event if a previous one has completed, or if the
      // XMLHttpRequest object is in an uninitialized state, or one has not
      // yet been instantiated.
      if (xhrLobbyUpdateStats == null || xhrLobbyUpdateStats.readyState == 0 ||
        xhrLobbyUpdateStats.readyState == 4) {
        // Create XMLHttpRequest object instance based on browser type.
        try {
          if (window.XMLHttpRequest){
            xhrLobbyUpdateStats = new XMLHttpRequest();
          } else {
            xhrLobbyUpdateStats = new ActiveXObject('Microsoft.XMLHTTP');
          }
          // Set the Javascript function that will act as a callback for
          // any events the instance fires.
          xhrLobbyUpdateStats.onreadystatechange = lobbyUpdateStatsHandler;
          // Set the target URI for the request.  Note that we append a
          // value that will ensure that the URL is always unique.
          // This is to deal with caching issues in IE.
          target = "<html:rewrite action="ajaxLobbyUpdateStats" />" +
            "?assureUnique=" + assureUnique++;
          // One minor problem that
          if (sendAJAXRequest) {
            xhrLobbyUpdateStats.open("get", target, true);
            xhrLobbyUpdateStats.send(null);
          }
        } catch(e) {
          alert("Error in lobbyUpdateStats() - " + e.message);
        }
      }
      // Restart the timer no matter what happened above.
      timerLobbyUpdateStats = setTimeout("lobbyUpdateStats()",
        lobbyUpdateStatsDelay);

    } // End lobbyUpdateStats().


    /**
     * This is the Ajax callback handler that updates the display.
     */
    function lobbyUpdateStatsHandler() {

      if (xhrLobbyUpdateStats.readyState == 4) {
        if (xhrLobbyUpdateStats.status == 200) {
          // Get the returned XML and parse it, creating our HTML for display.
          newHTML = "";
          msgDOM  = xhrLobbyUpdateStats.responseXML;
          root    = msgDOM.getElementsByTagName("rooms")[0];
          rooms   = root.getElementsByTagName("room");
          for (i = 0; i < rooms.length; i++) {
            room = rooms[i];
            roomName = room.getAttribute("name");
            users = room.getAttribute("users");
            url = "<a href=\"<c:url value="joinRoom.do?name=" />";
            newHTML += url + escape(roomName) + "\">" + roomName + "</a>";
            newHTML += " (" + users + ")<br/>";
          }
          // Update the display.
          objRoomList = document.getElementById("roomList");
          objRoomList.innerHTML = newHTML;
        } else {
          alert("Error in lobbyUpdateStatsHandler() - " +
            xhrLobbyUpdateStats.status);
        }
      }

    } // End lobbyUpdateStatsHandler().


  </script>

</head>

<body class="cssMain" onLoad="init();">

  <div class="cssHeading"><fmt:message key="messages.appTitle" /></div>
  <div class="cssAppVersion"><fmt:message key="app.version" /></div>
  <hr/><br/>

  <fmt:message key="messages.inTheLobby" />
  <br/><br/>

  <div id="roomList">
    <c:forEach var="roomName" items="${LobbyActionForm.rooms}">
      <a href="<c:url value="joinRoom.do">
        <c:param name="name" value="${roomName}" /></c:url>">
        <c:out value="${roomName}" />
      </a>
      <br/>
    </c:forEach>
  </div>
  <br/>

  <fmt:message key="messages.joinRoomInstructions" />
  <br/><br/><br/>

  <input type="button" class="cssButton"
    onClick="sendAJAXRequest=false;window.location='<html:rewrite action="logout" />';"
    value="<fmt:message key="labels.logoutButton" />" />

</body>

</html>
