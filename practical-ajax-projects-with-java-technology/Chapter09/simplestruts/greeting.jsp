<%@ taglib prefix="html" uri="http://jakarta.apache.org/struts/tags-html" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jstl/core" %>
<html>
  <head>
    <title><fmt:message key="title" /></title>
  </head>
  <style>
    .cssMessage {
      font-size   : 14pt;
      color       : #ff0000;
      font-style  : italic;
      font-weight : bold;
    }
  </style>
  <body>
    <div class="cssMessage"><c:out value="${requestScope.greeting}" /></div>
  </body>
  <br>
  <html:link forward="showMainPage"><fmt:message key="returnToEntryPage" /></html:link>
</html>
