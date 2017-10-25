<%
  String requestURI = (String)request.getAttribute("webwork.request_uri");
  requestURI = requestURI.toLowerCase();
  String headerFile = ""; String whatItem   = "";
  String whatOp     = ""; String targetFunc = "";
  if (requestURI.indexOf("account") != -1) {
    headerFile = "myAccount"; whatItem = "Your account";
    if (requestURI.indexOf("update") != -1) {
      targetFunc = "showDayAtAGlance();";
    } else {
      targetFunc = "window.location='index.jsp';";
    }
  }
  if (requestURI.indexOf("appointment") != -1) {
    headerFile = "appointments"; whatItem = "Appointment";
    targetFunc = "showAppointments();";
  }
  if (requestURI.indexOf("note") != -1) {
    headerFile = "notes"; whatItem = "Note";
    targetFunc = "showNotes();";
  }
  if (requestURI.indexOf("task") != -1) {
    headerFile = "tasks"; whatItem = "Task";
    targetFunc = "showTasks();";
  }
  if (requestURI.indexOf("contact") != -1) {
    headerFile = "contacts"; whatItem = "Contact";
    targetFunc = "showContacts();";
  }
  if (requestURI.indexOf("create") != -1) { whatOp = "created"; }
  if (requestURI.indexOf("update") != -1) { whatOp = "updated"; }
  if (requestURI.indexOf("delete") != -1) { whatOp = "deleted"; }
%>
<img src="img/head_<%=headerFile%>.gif">
<br><br>

<%=whatItem%> has been <%=whatOp%>.
<br><br>

<input type="image" src="img/ok0.gif" id="ok"
  onmouseover="rollover(this, 'ok');" onmouseout="rollout(this, 'ok');"
  onclick="<%=targetFunc%>">
