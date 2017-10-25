
<%@ page language="java" import="java.util.Enumeration" %>

<%
  request.getSession().setAttribute("mySessionAttribute", "Hello again!");
%>

<html>
<head>
<title>SimpleJSP</title>
</head>

<body>

Request Parameters:<br>
<%
  for (Enumeration en = request.getParameterNames(); en.hasMoreElements();) {
    String next = (String)en.nextElement();
    out.println(next + " = " + request.getParameter(next) + "<br>");
  }
%>
<br><br>
Request Attributes:<br>
<%
  for (Enumeration en = request.getAttributeNames(); en.hasMoreElements();) {
    String next = (String)en.nextElement();
    out.println(next + " = " + request.getAttribute(next) + "<br>");
  }
%>
<br><br>
Request Headers:<br>
<%
  for (Enumeration en = request.getHeaderNames(); en.hasMoreElements();) {
    String next = (String)en.nextElement();
    out.println(next + " = " + request.getHeader(next) + "<br>");
  }
%>
<br><br>
Session Attributes:<br>
<%
  for (Enumeration en = request.getSession().getAttributeNames(); en.hasMoreElements();) {
    String next = (String)en.nextElement();
    out.println(next + " = " + request.getSession().getAttribute(next) + "<br>");
  }
%>

</body>
</html>